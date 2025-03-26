'use client'

// MUI Imports
import React from 'react'

import { useRouter } from 'next/navigation'

import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import { Button, CardActions } from '@mui/material'

import { ApplicationStatus } from '@prisma/client'

import { useSession } from 'next-auth/react'

import { toast } from 'react-toastify'

import { deleteApplicationById, getApplications } from '@/actions/researcher/applicationAction'

import StudyItem from './StudyItem'

export interface StudyListType {
  id: number
  title: string
  institution: string
  startDate: string
  endDate: string
  applicationStatus: string
  createdAt: string
  lastUpdated: string
}

export const getChipColor = (status: string) => {
  if (status === ApplicationStatus.PENDING) return 'warning'
  if (status === ApplicationStatus.APPROVED) return 'success'
  if (status === ApplicationStatus.REJECTED) return 'error'

  return 'default'
}

interface Props {
  researcherId?: string
  view?: 'admin' | 'researcher'
}

const StudyList = ({ researcherId, view = 'researcher' }: Props) => {
  const { data: session } = useSession()
  const router = useRouter()
  const [studies, setStudies] = React.useState<StudyListType[]>([])

  const handleDelete = async (id: number) => {
    await deleteApplicationById(id)

    setStudies(prevStudies => prevStudies.filter(study => study.id !== id))
    toast.success('You have deleted the study successfully!')
  }

  React.useEffect(() => {
    const fetchStudies = async () => {
      try {
        const userId = researcherId ? researcherId : (session?.user.id as string)
        const fetchedStudies = await getApplications(userId)

        const mappedData: StudyListType[] = fetchedStudies.map(item => ({
          id: item.id,
          title: item.title,
          institution: item.institution || '',
          startDate: item.expectedStartDate.toISOString(),
          endDate: item.expectedEndDate.toISOString(),
          applicationStatus: item.status,
          createdAt: item.createdAt.toISOString(),
          lastUpdated: item.updatedAt.toISOString()
        }))

        setStudies(mappedData)
      } catch (error) {
        console.error('Error fetching studies:', error)
      }
    }

    fetchStudies()
  }, [session?.user.id, researcherId])

  return (
    <Card className='w-full'>
      <CardHeader title={view === 'admin' ? 'Studies' : 'My Studies'} className='pbe-4' />
      <CardContent className='flex flex-col gap-6'>
        {view === 'admin' ? (
          <Typography>
            {studies.length !== 0
              ? 'Please review the details of the following study(ies) to grant the researcher access to the requested data.'
              : 'This researcher has not applied for data access yet.'}
          </Typography>
        ) : (
          <Typography>
            Please provide details about your current studies and any relevant information, including supporting
            documents such as ethics approvals, protocols, or other materials.
            {studies.length !== 0
              ? ' Access beyond your date access granted date will require an updated application.'
              : null}
          </Typography>
        )}

        {studies.length !== 0 ? (
          studies.map((item, index) => (
            <StudyItem key={index} item={item} handleDelete={handleDelete} researcherId={researcherId as string} />
          ))
        ) : (

          // make it looks better
          <Typography className='flex md:flex-row md:justify-between gap-4 p-4 rounded bg-actionHover'>
            No studies found. Please add a study to proceed.
          </Typography>
        )}

        {view === 'researcher' && studies.length === 0 && (
          <CardActions sx={{ ml: -5 }}>
            <Button
              variant='contained'
              color='primary'
              onClick={() => router.push('/my-profile/new-study-application')}
            >
              + Add New Study and Apply for Data Access
            </Button>
          </CardActions>
        )}
      </CardContent>
    </Card>
  )
}

export default StudyList
