'use server'

import { DefaultAzureCredential } from '@azure/identity'
import { BlobSASPermissions, BlobServiceClient } from '@azure/storage-blob'

const accountName = process.env.AZURE_STORAGE_ACCOUNT_NAME as string
const containerName = process.env.AZURE_STORAGE_CONTAINER_NAME as string
const connectionString = process.env.AZURE_STORAGE_CONNECTION_STRING as string

let blobServiceClient: BlobServiceClient

if (connectionString) {
  blobServiceClient = BlobServiceClient.fromConnectionString(connectionString)
} else if (accountName) {
  blobServiceClient = new BlobServiceClient(
    `https://${accountName}.blob.core.windows.net`,
    new DefaultAzureCredential()
  )
} else {
  throw Error('Azure storage configuration not found')
}

const containerClient = blobServiceClient.getContainerClient(containerName)

/**
 * Upload documents to Azure Blob Storage
 */
export async function uploadDocuments(formData: FormData) {
  const documents = formData.getAll('documents') as File[]

  const uploadedFiles = await Promise.all(
    documents.map(async document => {
      const blobName = `${Date.now()}-${document.name}`
      const blockBlobClient = containerClient.getBlockBlobClient(blobName)
      console.log(`Uploading file: ${blobName} to Azure Blob Storage`)

      const bytes = await document.arrayBuffer()
      const buffer = Buffer.from(bytes)

      await blockBlobClient.uploadData(buffer, {
        blobHTTPHeaders: { blobContentType: document.type }
      })

      console.log(`Successfully uploaded ${blobName}`)

      return blockBlobClient.url
    })
  )

  return uploadedFiles
}

export async function deleteDocumentByPath(fileUrl: string) {
  try {
    const blobName = fileUrl.split('/').pop()
    if (!blobName) throw new Error(`Invalid file URL: ${fileUrl}`)

    const blockBlobClient = containerClient.getBlockBlobClient(blobName)
    console.log(`Deleting file: ${blobName} from Azure Block Storage`)
    await blockBlobClient.deleteIfExists()
    console.log(`Successfully deleted ${blobName}`)

    return {
      success: true,
      message: `Deleted ${blobName}`
    }
  } catch (error) {
    console.error(`Error deleting file: `, error)
    throw new Error(`Fail to delete file: ${fileUrl}`)
  }
}

/**
 * Generate a temporary URL with access to a blob
 * @param documentPath - The path or URL of the document
 * @returns A URL that can be used to access the document
 */
export async function getDocumentAccessUrl(documentPath: string) {
  try {
    const blobName = documentPath.includes('/') ? documentPath.split('/').pop() : documentPath

    if (!blobName) {
      throw new Error('Invalid document path')
    }

    const blockBlobClient = containerClient.getBlockBlobClient(blobName)

    // Generate a SAS token valid for 1 hour
    const now = new Date()
    const expiresOn = new Date(now)
    expiresOn.setMinutes(now.getMinutes() + 60)

    const sasToken = await blockBlobClient.generateSasUrl({
      expiresOn,
      permissions: BlobSASPermissions.from({ read: true })
    })

    return sasToken
  } catch (error) {
    console.error(`Error generating document URL: `, error)
    throw new Error(`Failed to get access URL for document: ${documentPath}`)
  }
}
