'use server'

import fs from 'fs/promises'
import { join } from 'path'

import { prisma } from '@/prisma/client'

export async function createApplication(formData: FormData) {
  try {
    const rawFormData = {
      researchTitle: formData.get('researchTitle'),
      researchQuestion: formData.get('researchQuestion'),
      institution: formData.get('institution'),
      expectedStartDate: formData.get('expectedStartDate'),
      expectedEndDate: formData.get('expectedEndDate'),
      summary: formData.get('summary'),
      documents: [] as string[] | null,
      demographicDataAccess: formData.getAll('demographicDataAccess'),
      questionnaireAccess: formData.getAll('questionnaireAccess')
    }

    rawFormData.documents = await uploadDocuments(formData)

    // save the documents first

    // save the application

    console.log('Submitting Form Data:', rawFormData)
  } catch (error) {
    console.error('Form submission failed:', error)
  }
}

export async function uploadDocuments(formData: FormData) {
  const documents = formData.getAll('documents') as File[]
  const documentPaths = await Promise.all(
    documents.map(async (document, i) => {
      const bytes = await document.arrayBuffer()
      const buffer = Buffer.from(bytes)
      const fileName = `${Date.now()}-${document.name}`
      const path = join(process.cwd(), '../../public', fileName)
      await fs.writeFile(path, buffer)
      return path
    })
  )
  return documentPaths
}
