import { notFound } from 'next/navigation'

import { Role } from '@prisma/client'

import Grid from '@mui/material/Grid2'

import { getUserProfile } from '@/actions/all-users/userAction'
import AccountSettingsCardAdminView from '@/components/AdminResearcherAccountSettings'
import DataAccessCard from '@/components/DataAccessCard'
import { prisma } from '@/prisma/client'

const Page = async ({ params }: { params: { userId: string } }) => {
  const user = await getUserProfile(params.userId)

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
