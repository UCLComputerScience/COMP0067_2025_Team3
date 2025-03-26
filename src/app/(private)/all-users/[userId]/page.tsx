// MUI
import { notFound } from 'next/navigation'

import Grid from '@mui/material/Grid2'

// Prisma
import { Role } from '@prisma/client'

import { prisma } from '@/prisma/client'

// next

// user action
import { getUserProfile } from '@/actions/all-users/userAction'

// components
import AccountSettingsCardAdminView from '@/components/AccountSettingsCardAdminView'
import DataAccessCard from '@/components/DataAccessCard'
import StudyList from '@/components/study-list'

interface PageProps {
  params: Promise<{
    userId: string
  }>
}

const Page = async ({ params }: PageProps) => {
  const { userId } = await params
  const user = await getUserProfile(userId)

  if (!user) {
    notFound()
  }

  const userRole = user.role

  let dataAccess = null

  if (userRole === Role.RESEARCHER) {
    dataAccess = await prisma.dataAccessPermission.findFirst({
      where: {
        researcherId: user.id
      }
    })
  }

  return (
    <Grid container spacing={4}>
      <AccountSettingsCardAdminView user={user} />
      {userRole === Role.RESEARCHER && <StudyList researcherId={userId} view='admin' />}
      {userRole === Role.RESEARCHER && <DataAccessCard data={dataAccess} view='admin' />}
    </Grid>
  )
}

export default Page
