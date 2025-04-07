'use server'

import { RelationshipStatus } from '@prisma/client'

import { prisma } from '@/prisma/client'

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

    const orConditions: Array<{ [key: string]: any }> = []

    if (patientName) {
      const searchTerms = patientName.trim().split(/\s+/)

      if (searchTerms.length > 1) {
        orConditions.push({
          OR: [
            { firstName: { contains: patientName, mode: 'insensitive' } },
            { lastName: { contains: patientName, mode: 'insensitive' } },
            {
              AND: [
                { firstName: { contains: searchTerms[0], mode: 'insensitive' } },
                { lastName: { contains: searchTerms[1], mode: 'insensitive' } }
              ]
            }
          ]
        })
      } else {
        orConditions.push({
          OR: [
            { firstName: { contains: patientName, mode: 'insensitive' } },
            { lastName: { contains: patientName, mode: 'insensitive' } }
          ]
        })
      }
    }

    if (email) {
      orConditions.push({ email: { contains: email, mode: 'insensitive' } })
    }

    const clinicianPatients = await prisma.clinicianPatient.findMany({
      where: {
        clinicianId,
        agreedToShareData: true,
        status: patientLink
          ? { equals: patientLink }
          : { in: [RelationshipStatus.PENDING, RelationshipStatus.CONNECTED] },
        ...(orConditions.length > 0 && {
          patient: {
            OR: orConditions
          }
        })
      },
      select: {
        patientId: true,
        status: true,
        agreedToShareData: true,
        patient: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            dateOfBirth: true
          }
        }
      },
      skip,
      take: pageSize
    })

    const total = await prisma.clinicianPatient.count({
      where: {
        clinicianId,
        agreedToShareData: true,
        status: patientLink
          ? { equals: patientLink }
          : { in: [RelationshipStatus.PENDING, RelationshipStatus.CONNECTED] },
        ...(orConditions.length > 0 && {
          patient: {
            OR: orConditions
          }
        })
      }
    })

    const patients = clinicianPatients.map(cp => ({
      id: cp.patient.id,
      name: `${cp.patient.firstName} ${cp.patient.lastName}`,
      firstName: cp.patient.firstName,
      lastName: cp.patient.lastName,
      email: cp.patient.email,
      dateOfBirth: cp.patient.dateOfBirth?.toISOString().split('T')[0] || '',
      patientLink: cp.status,
      agreedToShareData: cp.agreedToShareData 
    }))

    return {
      patients,
      total,
      page,
      pageSize
    }
  } catch (error) {
    console.error('Failed to obtain patient data:', error)
    throw new Error('Failed to obtain patient data')
  }
}

export async function updatePatientLink(clinicianId: string, patientId: string, status: RelationshipStatus) {
  try {
    const existingRelation = await prisma.clinicianPatient.findUnique({
      where: {
        patientId_clinicianId: {
          patientId,
          clinicianId
        }
      }
    })

    if (existingRelation) {
      await prisma.clinicianPatient.update({
        where: {
          patientId_clinicianId: {
            patientId,
            clinicianId
          }
        },
        data: {
          status
        }
      })
    } else {
      await prisma.clinicianPatient.create({
        data: {
          patientId,
          clinicianId,
          status,
          agreedToShareData: false
        }
      })
    }
  } catch (error) {
    console.error('Failed to update patient link:', error)
    throw new Error('Failed to update patient link')
  }
}

export async function updateAgreedToShareData(clinicianId: string, patientId: string, agreed: boolean) {
  try {
    await prisma.clinicianPatient.update({
      where: {
        patientId_clinicianId: {
          patientId,
          clinicianId
        }
      },
      data: {
        agreedToShareData: agreed
      }
    })
    
return { success: true }
  } catch (error) {
    console.error('Failed to update agreed to share data:', error)
    throw new Error('Failed to update agreed to share data')
  }
}

export const deletePatientLink = async (clinicianId: string, patientId: string) => {
  'use server'

  try {
    const deletedLink = await prisma.clinicianPatient.delete({
      where: {
        patientId_clinicianId: {
          patientId,
          clinicianId
        }
      }
    })

    return { success: true, data: deletedLink }
  } catch (error) {
    console.error('Error deleting patient link:', error)
    throw new Error('Failed to delete patient link')
  }
}

export const deleteManyPatientLinks = async (clinicianId: string, patientIds: string[]) => {
  'use server'

  try {
    const result = await prisma.clinicianPatient.deleteMany({
      where: {
        clinicianId,
        patientId: {
          in: patientIds
        }
      }
    })

    return { success: true, deletedCount: result.count }
  } catch (error) {
    console.error('Error deleting multiple patient links:', error)
    throw new Error('Failed to delete patient links')
  }
}
