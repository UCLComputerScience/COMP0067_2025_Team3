// next
import { redirect } from 'next/navigation'

import { getServerSession } from 'next-auth'

// prisma
import { Role } from '@prisma/client'

// auth
import { authOptions } from '@/libs/auth'

// actions
import { getResponseDataByUser } from '@/actions/records/recordAction'

// component
import Records from '@/views/Records'

interface PageProps {
  params: Promise<{ patientId: string }>
}

export default async function Page({ params }: PageProps) {
  const resolvedParams = await params
  const patientId = resolvedParams.patientId

  const session = await getServerSession(authOptions)

  if (!session?.user || session.user.role !== Role.CLINICIAN) {
    redirect('/not-found')
  }

  const data = await getResponseDataByUser(patientId)

  return <Records data={data} />
}
