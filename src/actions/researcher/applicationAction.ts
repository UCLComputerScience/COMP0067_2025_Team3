'use server'

// node.js
import { existsSync } from 'fs'
import fs from 'fs/promises'

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
      newDocuments: [] as string[],
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

    // Get existing document paths from the database
    const existingDocuments = currentApplication.documents.map(doc => ({
      path: doc.documentPath,
      filename: doc.documentPath.split('/').pop() || ''
    }))

    // Get filenames from the form submission
    const newDocumentFiles = formData.getAll('documents') as File[]
    const newDocumentFilenames = newDocumentFiles.map(file => file.name)

    // Find documents to delete (documents in DB but not in the form)
    const documentsToDelete = existingDocuments.filter(doc => {
      // Extract the original filename without the timestamp prefix
      const originalFilename = doc.filename.split('-').slice(1).join('-')
      return !newDocumentFilenames.some(
        newFilename => newFilename === originalFilename || originalFilename.endsWith(newFilename)
      )
    })

    // Delete documents from Azure that are no longer needed
    for (const doc of documentsToDelete) {
      try {
        await deleteDocumentByPath(doc.path)
        console.log(`Deleted document from Azure: ${doc.path}`)
      } catch (error) {
        console.error(`Failed to delete document from Azure: ${doc.path}`, error)
      }
    }

    // Determine which documents need to be uploaded
    let documentPaths: string[] = []

    // Keep existing documents that are still needed
    existingDocuments.forEach(doc => {
      const originalFilename = doc.filename.split('-').slice(1).join('-')
      if (
        newDocumentFilenames.some(
          newFilename => newFilename === originalFilename || originalFilename.endsWith(newFilename)
        )
      ) {
        documentPaths.push(doc.path)
        console.log(`Keeping existing document: ${doc.path}`)
      }
    })

    // Upload new documents
    if (newDocumentFiles.length > 0) {
      // Create a new FormData containing only the new documents that need to be uploaded
      const newDocsFormData = new FormData()

      for (const file of newDocumentFiles) {
        const filename = file.name
        const isExistingFile = existingDocuments.some(doc => {
          const originalFilename = doc.filename.split('-').slice(1).join('-')
          return filename === originalFilename || originalFilename.endsWith(filename)
        })

        if (!isExistingFile) {
          newDocsFormData.append('documents', file)
        }
      }

      // Only upload if there are actually new files to upload
      if (newDocsFormData.getAll('documents').length > 0) {
        const uploadedPaths = await uploadDocuments(newDocsFormData)
        documentPaths = [...documentPaths, ...uploadedPaths]
        console.log(`Uploaded new documents: ${uploadedPaths.join(', ')}`)
      }
    }

    // Update the application record with all documents (existing + new)
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
          // Delete all existing document records
          deleteMany: {},

          // Create new document records for all paths we want to keep
          create: documentPaths.map(docPath => ({
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
