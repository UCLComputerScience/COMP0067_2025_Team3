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
import { prisma } from '@/prisma/client'

const getDataAccessData = async (id: string) => {
  try {
    const dataAccess = await prisma.dataAccessPermission.findMany({
      where: {
        researcherId: id
      },
      select: {
        dataFields: true,
        hasAccess: true,
        createdAt: true,
        updatedAt: true,
        expiresAt: true
      }
    })

    if (!dataAccess) {
      console.log('No data access found for this user')
      
return null
    }

    return dataAccess[0]
  } catch (error) {
    console.error('get data access error:', error)
    
return null
  }
}

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
