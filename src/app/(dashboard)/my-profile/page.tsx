import StudyList from '@/components/StudyList'
import { Role } from '@prisma/client'

import { getServerSession } from 'next-auth'
import { authOptions } from '@/libs/auth'
import { redirect } from 'next/navigation';

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
  if (role === Role.CLINICIAN) {
    redirect('/my-profile/clinician-settings')
  }

  return (
    <>
      {role === Role.RESEARCHER && <StudyList />}
      {/* {role === Role.PATIENT && <h2>Patient Profile / Setting </h2>}
      {role === Role.CLINICIAN && <h2>Clinician Profile / Setting </h2>} */}
      {role === Role.ADMIN && <h2>Admin Profile / Setting </h2>}
    </>
  )
}

export default Page
