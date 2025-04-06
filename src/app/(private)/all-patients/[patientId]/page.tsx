// next
import { redirect } from 'next/navigation'

import { getServerSession } from 'next-auth'

// prisma
import { Role } from '@prisma/client'

// auth
import Grid from '@mui/material/Grid2'

import { authOptions } from '@/libs/auth'

// actions
import { getResponseDataByUser } from '@/actions/records/recordAction'

// component
import Records from '@/views/Records'

// MUI
import DemographyCard from '@/components/DemographyCard'
import { prisma } from '@/prisma/client'
import ViewMoreRecordsCard from '@/components/ViewMoreRecordsCard'

interface PageProps {
  params: Promise<{ patientId: string }>
}

const getPatientInfo = async (patientId: string) => {
  const patientInfo = await prisma.patientInfo.findFirst({
    where: {
      userId: patientId
    },
    include: {
      user: {
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          phoneNumber: true,
          address: true,
          dateOfBirth: true,
          hospitalNumber: true
        }
      }
    },
    orderBy: [
      {
        updatedAt: 'desc'
      }
    ]
  })

  return patientInfo
}

export default async function Page({ params }: PageProps) {
  const resolvedParams = await params
  const patientId = resolvedParams.patientId

  const session = await getServerSession(authOptions)

  if (!session?.user || session.user.role !== Role.CLINICIAN) {
    redirect('/not-found')
  }

  const data = await getResponseDataByUser(patientId)
  const patientInfo = await getPatientInfo(patientId)

  return (
    <Grid container spacing={4}>
      <Grid size={5}>
        <DemographyCard patientInfo={patientInfo} />
      </Grid>
      <Grid size={7}>
        <Records data={data} isShowRecordList={false} isTrendChartVertical={true} />
        <ViewMoreRecordsCard patientId={patientId} />
      </Grid>
    </Grid>
  )
}
