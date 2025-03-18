import { notFound } from 'next/navigation'

import { Role } from '@prisma/client'

import Grid from '@mui/material/Grid2'

import { getUserProfile } from '@/actions/all-users/userAction'
import AccountSettingsCardAdminView from '@/components/AccountSettingsCardAdminView'
import DataAccessCard from '@/components/DataAccessCard'
import { prisma } from '@/prisma/client'

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
      {userRole === Role.RESEARCHER && <DataAccessCard data={dataAccess} />}
      {userRole === Role.RESEARCHER && <div>Study List</div>}
    </Grid>
  )
}

export default Page
