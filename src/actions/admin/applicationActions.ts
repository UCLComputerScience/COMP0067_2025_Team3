'use server'

import { revalidatePath } from 'next/cache'

import type { DataField } from '@prisma/client';
import { ApplicationStatus } from '@prisma/client'

import type { AdminStudyFormValues } from '@/components/study-details/AdminStudyProcessForm'
import { mapDataAccessFields, stringToApplicationStatus } from '@/libs/mappers'
import { prisma } from '@/prisma/client'


export async function processStudyForm(researcherId: string, applicationId: number, formData: AdminStudyFormValues) {
  try {
    const status = formData.status
    const message = formData.message

    console.log('message: ', message)

    await updateDataAccessByUserId(researcherId, formData)
    await udpateApplicationStatusById(applicationId, status)

    if (message) {
      await updateApplicationAdminMessageById(applicationId, message)
    } else {
      await updateApplicationAdminMessageById(applicationId, '')
    }

    revalidatePath(`/all-users/${researcherId}`)
    revalidatePath(`/all-users/${researcherId}/study-application/${applicationId}`)

    return { message: 'Admin decision saved successfully!', success: true }
  } catch (error) {
    console.error('Error:', error)
    
return { message: 'An error occurred while updating data access application...', success: false }
  }
}

export const udpateApplicationStatusById = async (applicationId: number, status: string) => {
  try {
    const application = await prisma.application.findUnique({
      where: {
        id: applicationId
      }
    })

    if (!application) {
      console.log('cannot find application:', applicationId)
      
return false
    }

    await prisma.application.update({
      where: {
        id: applicationId
      },
      data: {
        status: stringToApplicationStatus(status)
      }
    })

    return true
  } catch (error) {
    console.error('failed to update the application status:', error)
  }
}

export const updateApplicationAdminMessageById = async (applicationId: number, message: string) => {
  try {
    const application = await prisma.application.findUnique({
      where: {
        id: applicationId
      }
    })

    if (!application) {
      console.log('cannot find application:', applicationId)
      
return false
    }

    await prisma.application.update({
      where: {
        id: applicationId
      },
      data: {
        adminMessage: message
      }
    })
    
return true
  } catch (error) {
    console.error('Error updating application admin message: ', error)
    
return false
  }
}

export const updateDataAccessByUserId = async (userId: string, formData: AdminStudyFormValues) => {
  console.log(userId)

  try {
    const hasAccess = formData.status === ApplicationStatus.APPROVED

    let dataFields: DataField[] = []
    let expiresAt: Date | null = null
    let startFrom: Date | null = null

    if (hasAccess) {
      const demographicFields = mapDataAccessFields(formData.demographicDataAccess || [], 'demographic')

      const questionnaireFields = mapDataAccessFields(formData.questionnaireAccess || [], 'questionnaire')

      dataFields = [...demographicFields, ...questionnaireFields]

      if (formData.dateRange?.expectedStartDate) {
        startFrom = new Date(formData.dateRange.expectedStartDate)
      } else {
        startFrom = new Date()
      }

      // Set expiration date if provided, or default to 30 days from now
      if (formData.dateRange?.expectedEndDate) {
        expiresAt = new Date(formData.dateRange.expectedEndDate)
      } else {
        expiresAt = new Date()
        expiresAt.setDate(expiresAt.getDate() + 30)
      }
    } else {
      expiresAt = new Date()
      startFrom = new Date()
    }

    const dataAccess = await prisma.dataAccessPermission.findUnique({
      where: {
        researcherId: userId
      }
    })

    if (!dataAccess) {
      const newDataAccess = await prisma.dataAccessPermission.create({
        data: {
          researcherId: userId,
          hasAccess: hasAccess,
          dataFields: dataFields,
          expiresAt: expiresAt,
          startFrom: startFrom
        }
      })

      console.log('Created new data access permission:', newDataAccess.id)
      
return true
    } else {
      const updatedDataAccess = await prisma.dataAccessPermission.update({
        where: {
          researcherId: userId
        },
        data: {
          hasAccess: hasAccess,
          dataFields: dataFields,
          expiresAt: expiresAt,
          updatedAt: new Date()
        }
      })

      console.log('Updated existing data access permission:', updatedDataAccess.id)
      
return true
    }
  } catch (error) {
    console.error('Error updating data access: ', error)
    
return false
  }
}
