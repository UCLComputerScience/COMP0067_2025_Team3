'use client'

// React Imports
import { useState, useEffect } from 'react'

// Next.js Imports
import { useParams } from 'next/navigation'

// Actions / API Calls
import { getApplicationById } from '@/actions/researcher/applicationAction'

// MUI (Material-UI) Imports
import { Card, CardHeader, CardContent, Typography, CardActions, Chip, Button } from '@mui/material'
import Grid from '@mui/material/Grid2'

// Utility Functions
import { FormValues } from '@/components/DataAccessApplicationForm'

// Component Imports
import DataAccessApplicationForm from '@/components/DataAccessApplicationForm'
import GridRow from './GridRow'
import DocumentsGridRow from './DocumentsGrid'
import { reverseMapDataAccessFields } from '@/libs/mappers'

export interface DocumentType {
  applicationId: number
  createdAt: Date
  documentPath: string
}

interface StudyDetailsType {
  id: number
  institution: string | null
  createdAt: Date
  status: string
  updatedAt: Date
  userId: string
  title: string
  question: string
  expectedStartDate: Date
  expectedEndDate: Date
  summary: string
  documents: DocumentType[]
  demographicDataAccess: string[]
  questionnaireAccess: string[]
}

const studyDetailsTypeToFormType = (studyDetails: StudyDetailsType): FormValues => {
  return {
    applicationId: studyDetails.id,
    researchTitle: studyDetails.title,
    researchQuestion: studyDetails.question,
    institution: studyDetails.institution || '',
    summary: studyDetails.summary,
    documents: studyDetails.documents.map(document => {
      const filePath = document.documentPath
      return new File([filePath], extractFileName(filePath))
    }),
    demographicDataAccess: reverseMapDataAccessFields(studyDetails.demographicDataAccess, 'demographic'),
    questionnaireAccess: reverseMapDataAccessFields(studyDetails.questionnaireAccess, 'questionnaire'),
    dateRange: {
      expectedStartDate: studyDetails.expectedStartDate,
      expectedEndDate: studyDetails.expectedEndDate
    }
  }
}

// temp open file helper functions
// Extract file name from path
export const extractFileName = (filePath: string) => {
  return filePath.split('\\').pop() || '' // Extracts the last part of the path
}

const StudyDetails = () => {
  const { studyId } = useParams()
  const [study, setStudy] = useState<StudyDetailsType | null>(null)
  const [isEditting, setIsEditting] = useState<boolean>(false)

  useEffect(() => {
    const fetchStudy = async (id: number) => {
      try {
        const res = await getApplicationById(id)
        console.log(res.documents)
        setStudy(res)
      } catch (error) {
        console.error('Error fetching study details:', error)
      }
    }

    if (studyId) {
      fetchStudy(Number(studyId))
    }
  }, [studyId])

  if (!study) {
    return <Typography variant='h6'>Study does not exist</Typography>
  }

  const studyFields = [
    { label: 'Data access application status', value: study.status },
    { label: 'Research title', value: study.title },
    { label: 'Research question', value: study.question },
    { label: 'Institution', value: study.institution || 'N/A' },
    {
      label: 'Expected start date to end date',
      value:
        study.expectedStartDate && study.expectedEndDate
          ? `${new Date(study.expectedStartDate).toDateString()} - ${new Date(study.expectedEndDate).toDateString()}`
          : 'N/A'
    },
    { label: 'Summary', value: study.summary }
  ]

  return isEditting ? (
    <DataAccessApplicationForm
      formValues={studyDetailsTypeToFormType(study)}
      title='Edit Data Access Application'
      subheader='Your approved data access wont change.'
      onCancel={() => {
        setIsEditting(false)
      }}
      submitTypes='update'
    />
  ) : (
    <Card>
      <CardHeader title='Study Details' className='pbe-4' />
      <CardContent className='flex flex-col gap-6'>
        <Grid container rowSpacing={6} columnSpacing={{ xs: 2, sm: 2, md: 3 }}>
          {studyFields.map((field, index) => (
            <GridRow {...field} key={index} />
          ))}
          <DocumentsGridRow documents={study.documents} />
        </Grid>

        <CardActions sx={{ ml: -5 }}>
          <Button variant='outlined' color='primary' onClick={() => setIsEditting(true)}>
            Edit
          </Button>
        </CardActions>
      </CardContent>
    </Card>
  )
}

export default StudyDetails
