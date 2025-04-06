'use client'

// React Imports
import { useState, useEffect } from 'react'

// Next.js Imports
import { useParams } from 'next/navigation'

import { useSession } from 'next-auth/react'

// MUI (Material-UI) Imports
import { Card, CardHeader, CardContent, Typography, CardActions, Button } from '@mui/material'
import Grid from '@mui/material/Grid2'

// Prisma
import { ApplicationStatus, Role } from '@prisma/client'

// Actions
import { getApplicationById } from '@/actions/researcher/applicationAction'

// Utility Functions
import type { FormValues } from '@/components/DataAccessApplicationForm'
import { extractFileName } from '../../utils/docUtils'
import { formatDate } from '@/utils/dateUtils'
import { reverseMapDataAccessFields } from '@/libs/mappers'

// Component Imports
import DataAccessApplicationForm from '@/components/DataAccessApplicationForm'
import GridRow from './GridRow'
import DocumentsGridRow from './DocumentsGrid'
import type { AdminStudyFormValues } from './AdminStudyProcessForm'
import AdminStudyProcessForm from './AdminStudyProcessForm'
import PatientConsentForm from './PatientConsentForm'

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
  adminMessage?: string
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

const adminFormTypeToAdminStudyFormValues = (studyDetails: StudyDetailsType): AdminStudyFormValues => {
  return {
    message: studyDetails.adminMessage,
    status: studyDetails.status,
    demographicDataAccess: reverseMapDataAccessFields(studyDetails.demographicDataAccess, 'demographic'),
    questionnaireAccess: reverseMapDataAccessFields(studyDetails.questionnaireAccess, 'questionnaire'),
    dateRange: {
      expectedStartDate: studyDetails.expectedStartDate,
      expectedEndDate: studyDetails.expectedEndDate
    }
  }
}

const StudyDetails = () => {
  const { data: session } = useSession()
  const { studyId } = useParams()
  const [study, setStudy] = useState<StudyDetailsType | null>(null)
  const [isEditting, setIsEditting] = useState<boolean>(false)

  useEffect(() => {
    const fetchStudy = async (id: number) => {
      try {
        const res = await getApplicationById(id)

        console.log(res)
        setStudy({
          ...res,
          adminMessage: res.adminMessage ?? undefined
        })
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

  const commonStudyFields = [
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
    { label: 'Summary', value: study.summary },
    {
      label: 'Requested demographic data access',
      value: reverseMapDataAccessFields(study.demographicDataAccess, 'demographic').join(', ')
    },
    {
      label: 'Requested questionnaire access',
      value: reverseMapDataAccessFields(study.questionnaireAccess, 'questionnaire').join(', ')
    }
  ]

  const userRole = session?.user?.role

  const researcherAndAdminFields = [{ label: 'Data access application status', value: study.status }]

  const adminFields = [
    { label: 'Application submitted date', value: formatDate(study.createdAt) },
    { label: 'Application last updated date', value: formatDate(study.updatedAt) }
  ]

  let studyFields = [...commonStudyFields]

  if (userRole === Role.RESEARCHER || userRole === Role.ADMIN) {
    studyFields = [...researcherAndAdminFields, ...commonStudyFields]
  } else if (userRole === Role.PATIENT) {
    studyFields = [...commonStudyFields]
  }

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
    <>
      <Card className='mb-4'>
        <CardHeader title='Study Details' className='pbe-4' />
        <CardContent className='flex flex-col gap-6'>
          <Grid container rowSpacing={6} columnSpacing={{ xs: 2, sm: 2, md: 3 }}>
            {studyFields.map((field, index) => (
              <GridRow {...field} key={index} />
            ))}
            <DocumentsGridRow documents={study.documents} />
            {session?.user.role === Role.ADMIN && adminFields.map((field, index) => <GridRow {...field} key={index} />)}
            {study.adminMessage && study.status === ApplicationStatus.REJECTED && (
              <GridRow label={'Admin Message'} value={study.adminMessage} color={'error.main'} />
            )}
          </Grid>

          {session?.user.role === Role.RESEARCHER && (
            <CardActions sx={{ ml: -5 }}>
              <Button variant='outlined' color='primary' onClick={() => setIsEditting(true)}>
                Edit
              </Button>
            </CardActions>
          )}
        </CardContent>
      </Card>
      {session?.user.role === Role.ADMIN && (
        <AdminStudyProcessForm
          formValues={adminFormTypeToAdminStudyFormValues(study)}
          researcherId={study.userId}
          applicationId={study.id}
        />
      )}
      {session?.user.role === Role.PATIENT && <PatientConsentForm studyId={study.id} />}
    </>
  )
}

export default StudyDetails

// export default StudyDetails
