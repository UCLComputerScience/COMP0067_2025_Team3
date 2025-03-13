'use server'

// node.js
import fs, { mkdir, unlink } from 'fs/promises'
import { existsSync } from 'fs'
import { join } from 'path'

// prisma
import { revalidatePath } from 'next/cache'

import { ApplicationStatus } from '@prisma/client'

import { prisma } from '@/prisma/client'

// utils
import { mapDataAccessFields } from '@/libs/mappers'


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

export async function uploadDocuments(formData: FormData) {
  /* saved in the local machine for now, later change it to the cloud server services we use */
  const documents = formData.getAll('documents') as File[]

  const uploadDir = join(process.cwd(), 'uploads')

  if (!existsSync(uploadDir)) {
    await mkdir(uploadDir, { recursive: true })
  }

  const documentPaths = await Promise.all(
    documents.map(async document => {
      const bytes = await document.arrayBuffer()
      const buffer = Buffer.from(bytes)

      const fileName = `${document.name}`
      const filePath = join(uploadDir, fileName)

      console.log(`Saving file: ${fileName}`)

      await fs.writeFile(filePath, buffer)

      return filePath
    })
  )

  return documentPaths
}

export async function getApplications(userId: string) {
  return await prisma.application.findMany({
    where: {
      userId: userId
    }

    // include: {
    //   documents: true
    // }
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

export async function deleteDocumentByPath(filePath: string) {
  try {
    console.log(`Deleting document at path: ${filePath}`)
    await unlink(filePath)
    console.log(`Successfully deleted document: ${filePath}`)
  } catch (error) {
    console.error(`Error deleting document at path ${filePath}:`, error)
    throw new Error(`Failed to delete document at path ${filePath}`)
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

    const existingDocumentPaths = currentApplication.documents.map(doc => doc.documentPath)

    // Get all documents from the form
    const newDocuments = formData.getAll('documents') as File[]

    // Compare existing documents with new ones to find out what has changed
    const documentsToAdd: File[] = []
    const documentsToDelete: string[] = []
    const documentsToReplace: { oldPath: string; newFile: File }[] = []

    newDocuments.forEach(newDoc => {
      const newDocPath = `${Date.now()}-${newDoc.name}`

      // Check if the document already exists or needs to be added
      if (!existingDocumentPaths.includes(newDocPath)) {
        documentsToAdd.push(newDoc) // New document to add
      }
    })

    // Check for removed or replaced documents
    existingDocumentPaths.forEach(existingDocPath => {
      const fileExistsInNewDocuments = newDocuments.some(newDoc => `${Date.now()}-${newDoc.name}` === existingDocPath)

      if (!fileExistsInNewDocuments) {
        documentsToDelete.push(existingDocPath) // Document removed
      } else {
        const newDoc = newDocuments.find(newDoc => `${Date.now()}-${newDoc.name}` === existingDocPath)

        if (newDoc) {
          documentsToReplace.push({ oldPath: existingDocPath, newFile: newDoc }) // Document replaced
        }
      }
    })

    // Upload new documents if there are any to add
    let newDocumentPaths: string[] = []

    if (documentsToAdd.length > 0) {
      newDocumentPaths = await uploadDocuments(formData)
    }

    // Handle deleted documents (remove from disk)
    for (const docPath of documentsToDelete) {
      const filePath = join(process.cwd(), docPath)

      if (existsSync(filePath)) {
        await fs.unlink(filePath) // Delete the file from the local disk
      }
    }

    // Handle replaced documents (remove old ones, upload new ones)
    for (const doc of documentsToReplace) {
      const filePath = join(process.cwd(), doc.oldPath)

      if (existsSync(filePath)) {
        await fs.unlink(filePath) // Delete the old file from the local disk
      }

      // Upload the new document
      const newFilePath = await uploadDocuments(formData)

      newDocumentPaths.push(newFilePath[0])
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
          deleteMany: {
            documentPath: { in: documentsToDelete } // Delete the old documents
          },
          create: [
            ...newDocumentPaths.map(docPath => ({
              documentPath: docPath
            }))
          ]
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
