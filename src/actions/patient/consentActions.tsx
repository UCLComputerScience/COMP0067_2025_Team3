'use server'

import { revalidatePath } from 'next/cache'

import { prisma } from '@/prisma/client'

export async function updatePatientAgreedToResearch(patientId: string, agreedForResearch: boolean) {
  try {
    await prisma.user.update({
      where: {
        id: patientId
      },
      data: {
        agreedForResearch
      }
    })

    if (!agreedForResearch) {
      await prisma.studyConsent.updateMany({
        where: {
          patientId: patientId,
          hasConsented: true
        },
        data: {
          hasConsented: false,
          updatedAt: new Date()
        }
      })
    }

    return {
      success: true,
      message: agreedForResearch
        ? 'Successfully opted in to research participation'
        : 'Successfully opted out to research participation'
    }
  } catch (error) {
    console.error('Error updating research consent:', error)

    return {
      success: false,
      message: 'Failed to update research consent. Please try again later.'
    }
  }
}

export async function getPatientAgreedToResearch(patientId: string) {
  const patient = await prisma.user.findUnique({
    where: {
      id: patientId
    },
    select: {
      agreedForResearch: true
    }
  })

  return patient?.agreedForResearch || false
}

export async function getPatientConsentStatus(patientId: string, studyId: number) {
  try {
    // Check if a consent record exists
    const consent = await prisma.studyConsent.findUnique({
      where: {
        patientId_applicationId: {
          patientId: patientId,
          applicationId: studyId
        }
      }
    })

    return {
      hasConsented: consent?.hasConsented || false,
      lastUpdated: consent?.updatedAt || null
    }
  } catch (error) {
    console.error('Error fetching patient consent status:', error)
    throw error
  }
}

export async function updatePatientStudyConsent(patientId: string, studyId: number, hasConsent: boolean) {
  try {
    const patientAgreedToResearch = await getPatientAgreedToResearch(patientId)

    if (!patientAgreedToResearch) throw Error('The current patient does not agree to participate in any research')

    const consent = await prisma.studyConsent.findUnique({
      where: {
        patientId_applicationId: {
          patientId: patientId,
          applicationId: studyId
        }
      }
    })

    let result

    if (!consent) {
      if (hasConsent) {
        result = await prisma.studyConsent.create({
          data: {
            patientId,
            applicationId: studyId,
            hasConsented: true
          }
        })
      } else {
        result = { hasConsented: false }
      }
    } else {
      if (hasConsent) {
        // Update existing consent to true
        result = await prisma.studyConsent.update({
          where: {
            id: consent.id
          },
          data: {
            hasConsented: true,
            updatedAt: new Date()
          }
        })
      } else {
        result = await prisma.studyConsent.update({
          where: {
            id: consent.id
          },
          data: {
            hasConsented: false,
            updatedAt: new Date()
          }
        })
      }
    }

    revalidatePath(`/studies/${studyId}`)

    return {
      success: true,
      ...result
    }
  } catch (error) {
    console.error('Error updating patient study consent:', error)
    throw error
  }
}
