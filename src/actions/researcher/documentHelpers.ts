'use server'

import { existsSync } from 'fs'
import { mkdir, unlink, writeFile } from 'fs/promises'

import { join } from 'path'

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

      await writeFile(filePath, buffer)

      return filePath
    })
  )

  return documentPaths
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
