// MUI
import { redirect } from 'next/navigation'

import Grid from '@mui/material/Grid2'

// Components
import { getServerSession } from 'next-auth'

import ChangePasswordForm from '@/components/ChangePasswordForm'
import StudyList from '@/components/study-list'
import AccountSettingForm from '@/components/AccountSettingForm'
import DataAccessCard from '@/components/DataAccessCard'

// auth
import { authOptions } from '@/libs/auth'
import { getDataAccessData } from '@/actions/researcher/userAction'

const RearcherSettings = async () => {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    redirect('/not-found')
  }

  const data = await getDataAccessData(session?.user.id)

  console.log('data:', data)

  return (
    <Grid container spacing={4}>
      <AccountSettingForm />
      <ChangePasswordForm />
      <DataAccessCard data={data} />
      <StudyList />
    </Grid>
  )
}

export default RearcherSettings
