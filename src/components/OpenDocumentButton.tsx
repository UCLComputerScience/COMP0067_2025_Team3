'use client'

import React from 'react'

import { IconButton } from '@mui/material'

import { getDocumentAccessUrl } from '@/actions/researcher/documentHelpers'

interface OpenDocumentButtonProps {
  documentPath: string
}

const OpenDocumentButton: React.FC<OpenDocumentButtonProps> = ({ documentPath }) => {
  const handleOpenDocument = async () => {
    try {
      const url = await getDocumentAccessUrl(documentPath)

      window.open(url, '_blank')
    } catch (error) {
      console.error('Error opening document:', error)
      alert('Failed to open document. Please try again.')
    }
  }

  return (
    <IconButton size='small' edge='end' onClick={handleOpenDocument}>
      <i className='ri-eye-line' />
    </IconButton>
  )
}

export default OpenDocumentButton
