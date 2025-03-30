import { redirect } from 'next/navigation'

import { Role } from '@prisma/client'

import { getServerSession } from 'next-auth'

import { authOptions } from '@/libs/auth'
import ResearcherSettings from '@/views/ResearcherSettings'
import ClincianSettings from '@/views/ClinicianSettings'
import AdminSettings from '@/views/AdminSettings'
import PatientSetting from '@/views/PatientSetting'

const Page = async () => {
  const session = await getServerSession(authOptions)

  if (!session) {
    console.log('Unauthorised access')
  }

  const { role } = session ? session.user : { role: 'GUEST' }

  return (
    <>
      {role === Role.RESEARCHER && <ResearcherSettings />}
      {role === Role.PATIENT && <PatientSetting />}
      {role === Role.CLINICIAN && <ClincianSettings />}
      {role === Role.ADMIN && <AdminSettings />}
    </>
  )
}

export default Page
