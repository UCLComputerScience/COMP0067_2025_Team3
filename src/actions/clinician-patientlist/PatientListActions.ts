'use server'

import { PrismaClient , RelationshipStatus } from '@prisma/client'


const prisma = new PrismaClient()

type PatientFilters = {
  patientName?: string
  email?: string
  patientLink?: RelationshipStatus
  page?: number
  pageSize?: number
}

export async function getPatients(filters: PatientFilters, clinicianId: string) {
  const { patientName, email, patientLink, page = 1, pageSize = 10 } = filters

  try {
    const skip = (page - 1) * pageSize
    const orConditions: any[] = []

    if (patientName) {
      orConditions.push({
        OR: [
          { firstName: { contains: patientName, mode: 'insensitive' } },
          { lastName: { contains: patientName, mode: 'insensitive' } },
        ],
      })
    }

    if (email) {
      orConditions.push({ email: { contains: email, mode: 'insensitive' } })
    }

    const clinicianPatients = await prisma.clinicianPatient.findMany({
      where: {
        clinicianId,
        status: {
          in: [RelationshipStatus.PENDING, RelationshipStatus.CONNECTED],
          ...(patientLink && { equals: patientLink }),
        },
        ...(orConditions.length > 0 && {
          patient: {
            OR: orConditions,
          },
        }),
      },
      select: {
        patientId: true,
        status: true,
        patient: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            dateOfBirth: true,
          },
        },
      },
      skip,
      take: pageSize,
    })

    const total = await prisma.clinicianPatient.count({
      where: {
        clinicianId,
        status: {
          in: [RelationshipStatus.PENDING, RelationshipStatus.CONNECTED],
          ...(patientLink && { equals: patientLink }),
        },
        ...(orConditions.length > 0 && {
          patient: {
            OR: orConditions,
          },
        }),
      },
    })

    const patients = clinicianPatients.map((cp) => ({
      id: cp.patient.id,
      name: `${cp.patient.firstName} ${cp.patient.lastName}`,
      email: cp.patient.email,
      dateOfBirth: cp.patient.dateOfBirth?.toISOString().split('T')[0] || '',
      patientLink: cp.status,
    }))

    return {
      patients,
      total,
      page,
      pageSize,
    }
  } catch (error) {
    console.error('Failed to obtain patient data:', error)
    throw new Error('Failed to obtain patient data')
  } finally {
    await prisma.$disconnect()
  }
}

export async function updatePatientLink(
  clinicianId: string,
  patientId: string,
  status: RelationshipStatus
) {
  try {
    const existingRelation = await prisma.clinicianPatient.findUnique({
      where: {
        patientId_clinicianId: { patientId, clinicianId },
      },
    })

    if (existingRelation) {
      await prisma.clinicianPatient.update({
        where: {
          patientId_clinicianId: { patientId, clinicianId },
        },
        data: { status },
      })
    } else {
      await prisma.clinicianPatient.create({
        data: {
          patientId,
          clinicianId,
          status,
          agreedToShareData: false,
        },
      })
    }
  } catch (error) {
    console.error('Failed to update patient link:', error)
    throw new Error('Failed to update patient link')
  } finally {
    await prisma.$disconnect()
  }
}


