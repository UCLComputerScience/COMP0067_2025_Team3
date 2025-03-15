import { redirect } from 'next/navigation'

import { Role } from '@prisma/client'

import { getServerSession } from 'next-auth'

import { authOptions } from '@/libs/auth'
import ResearcherSettings from '@/views/ResearcherSettings'
import ClincianSettings from '@/views/ClinicianSettings'
import AdminSettings from '@/views/AdminSettings'

const Page = async () => {
  const session = await getServerSession(authOptions)

  if (!session) {
    console.log('Unauthorized access') // secure the page later
  }

  const { role } = session ? session.user : { role: 'GUEST' }

  // Handle redirection based on role ----- DOING IT LIKE THAT FOR NOW AS I CANT MAKE THE OTHER WAY WORK
  if (role === Role.PATIENT) {
    redirect('/my-profile/patient-settings')
  }

  return (
    <>
      {role === Role.RESEARCHER && <ResearcherSettings />}
      {/* {role === Role.PATIENT && <h2>Patient Profile / Setting </h2>} */}
      {role === Role.CLINICIAN && <ClincianSettings />}
      {role === Role.ADMIN && <AdminSettings />}
    </>
  )
}

export default Page
