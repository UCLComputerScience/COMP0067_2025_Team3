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

const StudyList = () => {
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
        const fetchedStudies = await getApplications(session?.user.id as string)

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
  }, [session?.user.id])

  return (
    <Card>
      <CardHeader title='My Studies' className='pbe-4' />
      <CardContent className='flex flex-col gap-6'>
        <Typography>
          Please provide details about your current studies and any relevant information, including supporting documents
          such as ethics approvals, protocols, or other materials.
          {studies.length !== 0
            ? ' Your data access, based on your currently approved studies, will remain valid until 30/01/2024. Access beyond this date will require an updated application.'
            : null}
        </Typography>
        {studies.length !== 0 ? (
          studies.map((item, index) => <StudyItem key={index} item={item} handleDelete={handleDelete} />)
        ) : (

          // make it looks better
          <Typography className='flex md:flex-row md:justify-between gap-4 p-4 rounded bg-actionHover'>
            No studies found. Please add a study to proceed.
          </Typography>
        )}

        <CardActions sx={{ ml: -5 }}>
          <Button variant='contained' color='primary' onClick={() => router.push('/my-profile/new-study-application')}>
            + Add New Study and Apply for Data Access
          </Button>
        </CardActions>
      </CardContent>
    </Card>
  )
}

export default StudyList
