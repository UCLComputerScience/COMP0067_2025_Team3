import { Typography, IconButton } from '@mui/material'
import Grid from '@mui/material/Grid2'

import type { DocumentType } from '.'
import { extractFileName } from '@/utils/DocumentUtils'

const DocumentsGridRow = ({ documents }: { documents: DocumentType[] }) => {
  // Function to check if the file is an image
  const isImageFile = (filePath: string) => {
    console.log(filePath, /\.(jpeg|jpg|png)$/i.test(filePath))

    return /\.(jpeg|jpg|png)$/i.test(filePath) // Check if the file has a .jpeg, .jpg, or .png extension
  }

  // Function to determine the correct icon for non-image files
  const getDocumentIcon = (filePath: string) => {
    if (filePath.endsWith('.pdf')) {
      return '/images/icons/pdf-document.png' // PDF icon
    } else if (filePath.endsWith('.doc') || filePath.endsWith('.docx')) {
      return '/images/icons/doc.png' // DOC icon
    } else {
      return '/images/icons/unknown-document.png' // Fallback for unknown document types
    }
  }

  return (
    <>
      <Grid size={4}>
        <Typography className='font-medium'>Documents</Typography>
      </Grid>
      <Grid size={8}>
        {documents.map((document, key) => (
          <div className='flex items-center gap-2.5 is-fit bg-actionHover rounded plb-[5px] pli-2.5 mt-2' key={key}>
            {/* Conditional Rendering: */}
            {isImageFile(document.documentPath) ? (
              // For image files (JPEG, JPG, PNG) - show image
              <i className='ri-file-image-line' />
            ) : document.documentPath.endsWith('.pdf') ||
              document.documentPath.endsWith('.doc') ||
              document.documentPath.endsWith('.docx') ? (
              // For document files (PDF, DOC, DOCX) - show document icon
              <img
                height={20}
                alt={`${extractFileName(document.documentPath)} icon`}
                src={getDocumentIcon(document.documentPath)}
              />
            ) : (
              // For unknown file types - show a default text icon
              <i className='ri-file-text-line' />
            )}

            <Typography className='font-medium' color='text.primary'>
              {extractFileName(document.documentPath)}
            </Typography>

            <IconButton size='small' edge='end' onClick={() => console.log(document.documentPath)}>
              <i className='ri-eye-line' />
            </IconButton>
          </div>
        ))}
      </Grid>
    </>
  )
}

export default DocumentsGridRow
