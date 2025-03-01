'use client'

// React Imports
import { useEffect, useState } from 'react'

// MUI Imports
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import Typography from '@mui/material/Typography'
import { styled } from '@mui/material/styles'
import type { BoxProps } from '@mui/material/Box'

// Third-party Imports
import { useDropzone } from 'react-dropzone'

// Component Imports
import CustomAvatar from '@core/components/mui/Avatar'

// Styled Component Imports
import AppReactDropzone from '@/libs/styles/AppReactDropzone'

type FileProp = {
  name: string
  type: string
  size: number
}

interface Props {
  files?: File[] // Controlled files array
  onChange?: (files: File[]) => void // Called when files are changed
}

// Styled Dropzone Component
const Dropzone = styled(AppReactDropzone)<BoxProps>(({ theme }) => ({
  '& .dropzone': {
    minHeight: 'unset',
    padding: theme.spacing(12),
    [theme.breakpoints.down('sm')]: {
      paddingInline: theme.spacing(5)
    },
    '&+.MuiList-root .MuiListItem-root .file-name': {
      fontWeight: theme.typography.body1.fontWeight
    }
  }
}))

const FileUpload = ({ files: propFiles, onChange }: Props) => {
  // States
  const [files, setFiles] = useState<File[]>(propFiles || [])

  useEffect(() => {
    if (propFiles) {
      setFiles(propFiles)
    }
  }, [propFiles])

  // Hooks
  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg'],
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx']
    },
    onDrop: (acceptedFiles: File[]) => {
      const updatedFiles = [...files, ...acceptedFiles]
      setFiles(updatedFiles)
      if (onChange) onChange(updatedFiles) // Notify parent of file change
    }
  })

  const renderFilePreview = (file: FileProp) => {
    if (file.type.startsWith('image')) {
      return <img width={38} height={38} alt={file.name} src={URL.createObjectURL(file as any)} />
    } else {
      return <i className='ri-file-text-line' />
    }
  }

  const handleRemoveFile = (file: FileProp) => {
    const updatedFiles = files.filter(f => f.name !== file.name)
    setFiles(updatedFiles)
    if (onChange) onChange(updatedFiles) // Notify parent of file change
  }

  const fileList = files.map((file: FileProp) => (
    <ListItem key={file.name} className='pis-4 plb-3'>
      <div className='file-details'>
        <div className='file-preview'>{renderFilePreview(file)}</div>
        <div>
          <Typography className='file-name font-medium' color='text.primary'>
            {file.name}
          </Typography>
          <Typography className='file-size' variant='body2'>
            {Math.round(file.size / 100) / 10 > 1000
              ? `${(Math.round(file.size / 100) / 10000).toFixed(1)} mb`
              : `${(Math.round(file.size / 100) / 10).toFixed(1)} kb`}
          </Typography>
        </div>
      </div>
      <IconButton onClick={() => handleRemoveFile(file)}>
        <i className='ri-close-line text-xl' />
      </IconButton>
    </ListItem>
  ))

  const handleRemoveAllFiles = () => {
    setFiles([])
    if (onChange) onChange([])
  }

  return (
    <Dropzone>
      <div {...getRootProps({ className: 'dropzone' })}>
        <input {...getInputProps()} />
        <div className='flex items-center flex-col gap-2 text-center'>
          <CustomAvatar variant='rounded' skin='light' color='secondary'>
            <i className='ri-upload-2-line' />
          </CustomAvatar>
          <Typography variant='h5'>Drag and Drop Your File Here.</Typography>
          <Typography color='text.secondary'>Allowed *.jpeg, *.jpg, *.png, *.doc, *.docx, *.pdf</Typography>
          <Typography color='text.disabled'>or</Typography>
          <Button variant='outlined' size='small'>
            Browse Desktop
          </Button>
        </div>
      </div>
      {files.length ? (
        <>
          <List>{fileList}</List>
          <div className='buttons'>
            <Button color='error' variant='outlined' onClick={handleRemoveAllFiles}>
              Remove All
            </Button>
            {/* <Button variant='contained'>Upload Files</Button> */}
          </div>
        </>
      ) : null}
    </Dropzone>
  )
}

export default FileUpload
