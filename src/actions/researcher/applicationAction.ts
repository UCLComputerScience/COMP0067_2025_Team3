'use server'

// node.js
import { existsSync } from 'fs'
import fs from 'fs/promises'
import { join } from 'path'

// prisma
import { revalidatePath } from 'next/cache'

import { ApplicationStatus } from '@prisma/client'

import { prisma } from '@/prisma/client'

// utils
import { mapDataAccessFields } from '@/libs/mappers'
import { uploadDocuments, deleteDocumentByPath } from './documentHelpers'

export async function createApplication(formData: FormData, userId: string) {
  try {
    const rawFormData = {
      researchTitle: formData.get('researchTitle'),
      researchQuestion: formData.get('researchQuestion'),
      institution: formData.get('institution'),
      expectedStartDate: formData.get('expectedStartDate'),
      expectedEndDate: formData.get('expectedEndDate'),
      summary: formData.get('summary'),
      documents: [] as string[] | null,
      demographicDataAccess: mapDataAccessFields(formData.getAll('demographicDataAccess') as string[], 'demographic'),
      questionnaireAccess: mapDataAccessFields(formData.getAll('questionnaireAccess') as string[], 'questionnaire')
    }

    rawFormData.documents = await uploadDocuments(formData)

    const application = await prisma.application.create({
      data: {
        title: rawFormData.researchTitle as string,
        question: rawFormData.researchQuestion as string,
        institution: rawFormData.institution as string,
        expectedStartDate: new Date(rawFormData.expectedStartDate as string),
        expectedEndDate: new Date(rawFormData.expectedEndDate as string),
        summary: rawFormData.summary as string,
        documents: {
          create: rawFormData.documents.map(docPath => ({
            documentPath: docPath
          }))
        },
        demographicDataAccess: rawFormData.demographicDataAccess,
        questionnaireAccess: rawFormData.questionnaireAccess,
        userId: userId,
        status: ApplicationStatus.PENDING
      },
      include: {
        documents: true
      }
    })

    console.log('Submitting Form Data:', rawFormData)
    console.log('Application created:', application)

    revalidatePath('/my-profile/study-application')

    return true
  } catch (error) {
    console.error('Form submission failed:', error)

    return false
  }
}

export async function getApplications(userId: string) {
  return await prisma.application.findMany({
    where: {
      userId: userId
    }
  })
}

export async function getApplicationById(id: number) {
  try {
    const application = await prisma.application.findUnique({
      where: {
        id: id
      },
      include: {
        documents: true
      }
    })

    if (!application) {
      throw new Error(`Application with ID ${id} does not exist`)
    }

    return application
  } catch (error) {
    console.error(`Error getting application with id ${id}:`, error)
    throw new Error(`Failed to get application with ID ${id}`)
  }
}

export async function deleteApplicationById(id: number) {
  try {
    console.log(`Deleting application with ID: ${id}`)

    // Check if the application exists
    const existingApplication = await prisma.application.findUnique({
      where: { id },
      select: { documents: true }
    })

    if (!existingApplication) {
      throw new Error(`Application with ID ${id} does not exist`)
    }

    // Delete associated documents
    for (const doc of existingApplication.documents) {
      await deleteDocumentByPath(doc.documentPath)
    }

    // Delete the application
    await prisma.application.delete({
      where: { id }
    })

    console.log(`Successfully deleted application with ID: ${id}`)

    // Revalidate the profile path
    revalidatePath('/my-profile')
  } catch (error) {
    console.error(`Error deleting application with ID ${id}:`, error)
    throw new Error(`Failed to delete application with ID ${id}`)
  }
}

export async function updateApplication(formData: FormData, userId: string, applicationId: number) {
  try {
    const rawFormData = {
      researchTitle: formData.get('researchTitle'),
      researchQuestion: formData.get('researchQuestion'),
      institution: formData.get('institution'),
      expectedStartDate: formData.get('expectedStartDate'),
      expectedEndDate: formData.get('expectedEndDate'),
      summary: formData.get('summary'),
      documents: [] as string[] | null,
      demographicDataAccess: mapDataAccessFields(formData.getAll('demographicDataAccess') as string[], 'demographic'),
      questionnaireAccess: mapDataAccessFields(formData.getAll('questionnaireAccess') as string[], 'questionnaire')
    }

    // Get the current application and its existing documents
    const currentApplication = await prisma.application.findUnique({
      where: { id: applicationId },
      include: { documents: true }
    })

    if (!currentApplication) {
      throw new Error(`Application with ID ${applicationId} not found`)
    }

    // Get all existing document paths to delete them
    const existingDocumentPaths = currentApplication.documents.map(doc => doc.documentPath)

    // Delete all existing document files from disk
    for (const docPath of existingDocumentPaths) {
      console.log('doc path extracted from db:', docPath)

      if (existsSync(docPath)) {
        try {
          await fs.unlink(docPath) // Delete the file from the local disk
          await fs.rm(docPath, { force: true })
          console.log('delete the doc locally now')
        } catch (error) {
          console.error('Failed to remove file locally:', error)
        }
      }
    }

    // Upload all new documents
    let newDocumentPaths: string[] = []

    // Get all documents from the form
    const newDocuments = formData.getAll('documents') as File[]

    // Only upload if new documents are provided
    if (newDocuments.length > 0) {
      newDocumentPaths = await uploadDocuments(formData)
      console.log(newDocumentPaths)
    }

    // Update the application record with the new documents
    const updatedApplication = await prisma.application.update({
      where: { id: applicationId },
      data: {
        title: rawFormData.researchTitle as string,
        question: rawFormData.researchQuestion as string,
        institution: rawFormData.institution as string,
        expectedStartDate: new Date(rawFormData.expectedStartDate as string),
        expectedEndDate: new Date(rawFormData.expectedEndDate as string),
        summary: rawFormData.summary as string,
        documents: {
          // Delete all existing documents
          deleteMany: {},
          // Create new document records
          create: newDocumentPaths.map(docPath => ({
            documentPath: docPath
          }))
        },
        demographicDataAccess: rawFormData.demographicDataAccess,
        questionnaireAccess: rawFormData.questionnaireAccess,
        userId: userId
      },
      include: {
        documents: true
      }
    })

    console.log('Application updated:', updatedApplication)
    revalidatePath(`/my-profile/study-application/${applicationId}`)

    return true
  } catch (error) {
    console.error('Failed to update application:', error)
    return false
  }
}
