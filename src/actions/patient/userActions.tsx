'use server'

import { prisma } from '@/prisma/client'

export async function getPatientClinicians(patientId: string) {
  try {
    const clinicianPatients = await prisma.clinicianPatient.findMany({
      where: {
        patientId
      },
      include: {
        clinician: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            profession: true,
            institution: true
          }
        }
      }
    })

    const clinicians = clinicianPatients.map(cp => ({
      id: cp.clinician.id,
      firstName: cp.clinician.firstName,
      lastName: cp.clinician.lastName,
      email: cp.clinician.email,
      profession: cp.clinician.profession || '',
      institution: cp.clinician.institution || '',
      status: cp.status,
      agreedToShareData: cp.agreedToShareData
    }))

    return {
      success: true,
      data: clinicians,
      message: 'Clinicians fetched successfully'
    }
  } catch (error) {
    console.error('Error fetching patient clinicians:', error)
    return {
      success: false,
      data: [],
      message: 'Failed to fetch clinicians'
    }
  }
}
