'use client'

// MUI Imports
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Chip from '@mui/material/Chip'
import { Button, CardActions } from '@mui/material'
import React from 'react'
import { useRouter } from 'next/navigation'

interface StudyListType {
  title: string
  instituion: string
  startDate: string
  endDate: string
  applicationStatus: string
  createdAt: string
  lastUpdated: string
}

const studyList: StudyListType[] = [
  {
    title: 'Study 1',
    instituion: 'UCL',
    startDate: '28 Apr 2021, 18:20 GTM+4:10',
    endDate: '28 Apr 2021, 18:20 GTM+4:10',
    applicationStatus: 'Pending',
    createdAt: '28 Apr 2021, 18:20 GTM+4:10',
    lastUpdated: '28 Apr 2021, 18:20 GTM+4:10'
  },
  {
    title: 'Study 2',
    instituion: 'UCL',
    startDate: '28 Apr 2021, 18:20 GTM+4:10',
    endDate: '28 Apr 2021, 18:20 GTM+4:10',
    applicationStatus: 'Pending',
    createdAt: '28 Apr 2021, 18:20 GTM+4:10',
    lastUpdated: '28 Apr 2021, 18:20 GTM+4:10'
  },
  {
    title: 'Study 3',
    instituion: 'UCL',
    startDate: '28 Apr 2021, 18:20 GTM+4:10',
    endDate: '28 Apr 2021, 18:20 GTM+4:10',
    applicationStatus: 'Pending',
    createdAt: '28 Apr 2021, 18:20 GTM+4:10',
    lastUpdated: '28 Apr 2021, 18:20 GTM+4:10'
  }
]

// TO-DO: changed it to grid
const StudyItem = (item: StudyListType) => {
  return (
    <div className='flex flex-row gap-2 p-4 rounded bg-actionHover'>
      <div className='flex flex-col gap-2 p-4'>
        <div className='flex items-center gap-3'>
          <Typography variant='h6'>{item.title}</Typography>
          <Chip variant='tonal' color='primary' label={item.applicationStatus} size='small' />
        </div>
        <div className='flex items-center gap-3'>
          <Typography className='font-medium'>Institution: {item.instituion}</Typography>
        </div>
        <div className='flex flex-col gap-1'>
          <Typography>Start Date: {item.startDate}</Typography>
          <Typography>End Date: {item.endDate}</Typography>
        </div>
        <div className='flex flex-col gap-1'>
          <Typography color='text.disabled'>{`Created on ${item.createdAt}`}</Typography>
          <Typography color='text.disabled'>{`Last Updated on ${item.lastUpdated}`}</Typography>
        </div>
      </div>

      <div className='flex items-start gap-2'>
        <Button variant='outlined' color='primary'>
          View
        </Button>
        <Button variant='outlined' color='primary'>
          Edit
        </Button>
        <Button variant='outlined' color='error'>
          Delete
        </Button>
      </div>
    </div>
  )
}

const StudyList = () => {
  const router = useRouter()
  return (
    <Card>
      <CardHeader title='My Studies' className='pbe-4' />
      <CardContent className='flex flex-col gap-6'>
        <Typography>
          Please provide details about your current studies and relevant information, including relevant documents such
          as ethics approvals, protocols, or other supporting materials. Your data access, based on your currently
          approved studies, will remain valid until 30/01/2024. Access beyond this date will require an updated
          application.
        </Typography>
        {studyList.map((item, index) => (
          <StudyItem {...item} key={index} />
        ))}

        <CardActions sx={{ ml: -5 }}>
          <Button variant='contained' color='primary' onClick={() => router.push('/my-profile/study-application')}>
            + Add New Study and Apply for Data Access
          </Button>
        </CardActions>
      </CardContent>
    </Card>
  )
}

export default StudyList
