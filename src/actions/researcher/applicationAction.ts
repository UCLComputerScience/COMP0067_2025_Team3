'use server'

// node.js
import fs, { mkdir } from 'fs/promises'
import { existsSync } from 'fs'
import { join } from 'path'

// prisma
import { prisma } from '@/prisma/client'
import { ApplicationStatus } from '@prisma/client'

// utils
import { mapDataAccessFields } from '@/libs/mappers'
import { revalidatePath } from 'next/cache'

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

      const fileName = `${Date.now()}-${document.name}`
      const filePath = join(uploadDir, fileName)

      console.log(`Saving file: ${fileName}`)

      await fs.writeFile(filePath, buffer)

      return filePath
    })
  )

  return documentPaths
}
