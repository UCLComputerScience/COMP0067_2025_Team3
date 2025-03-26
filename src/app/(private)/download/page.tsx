import { redirect } from 'next/navigation'

import Grid from '@mui/material/Grid2'

import { getServerSession } from 'next-auth'

import { getEarlisetResponseDate } from '@/actions/researcher/downloadActions'
import { getDataAccessData } from '@/actions/researcher/userAction'
import type { DownloadFormValues } from '@/components/DownloadCard';
import DownloadCard from '@/components/DownloadCard'
import DownloadQuestionsCard from '@/components/DownloadQuestionsCard'
import { authOptions } from '@/libs/auth'


const Page = async () => {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    redirect('/not-found')
  }

  const dataAccessData = await getDataAccessData(session.user.id)
  const earliestDate = await getEarlisetResponseDate()

  const defaultFormValues: DownloadFormValues = {
    demographicDataAccess: [],
    questionnaireType: '',
    dateRange: {
      expectedStartDate: earliestDate ? earliestDate : new Date(), // default the earliset date in the database
      expectedEndDate: new Date() // default today
    },
    exportFormat: 'CSV'
  }

  return (
    <Grid container spacing={4}>
      <DownloadCard dataAccess={dataAccessData} defaultFormValues={defaultFormValues} />
      <DownloadQuestionsCard />
    </Grid>
  )
}

export default Page
