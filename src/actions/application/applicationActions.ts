'use server'

import { ApplicationStatus } from '@prisma/client'

import { prisma } from '@/prisma/client'

export const getAllApplications = async () => {
  try {
    const applications = await prisma.application.findMany({
      select: {
        id: true,
        title: true,
        summary: true,
        institution: true,
        updatedAt: true,
        createdAt: true,
        status: true,
        userId: true
      }
    })

    
return applications
  } catch (error) {
    console.error('Error getting all applications:', error)
  }
}

export const getAllApprovedApplications = async (currentPatientId?: string) => {
  try {
    const applications = await prisma.application.findMany({
      where: {
        status: ApplicationStatus.APPROVED
      },
      select: {
        id: true,
        title: true,
        summary: true,
        institution: true,
        updatedAt: true,
        createdAt: true,
        patientConsents: currentPatientId
          ? {
              where: {
                patientId: currentPatientId,
                hasConsented: true
              }
            }
          : undefined
      }
    })

    const transformedApplications = applications.map(app => {
      const hasConsented = currentPatientId ? app.patientConsents.length > 0 : false

      return {
        id: app.id,
        title: app.title,
        summary: app.summary,
        institution: app.institution,
        updatedAt: app.updatedAt,
        createdAt: app.createdAt,
        isConsent: hasConsented
      }
    })

    return transformedApplications
  } catch (error) {
    console.error('Error getting all approved applications:', error)

    // Best practice: Rethrow or return a proper error response
    throw new Error('Failed to fetch approved applications')
  }
}
