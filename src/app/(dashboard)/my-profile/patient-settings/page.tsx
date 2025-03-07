import { prisma } from '@/prisma/client'
import { RelationshipStatus } from '@prisma/client';
import UserProfile from '@/views/Settings'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/libs/auth'


export interface UserData {
    id: string
    firstName: string
    lastName: string
    email: string
    phoneNumber?: string | null
    address?: string | null
    hospitalNumber?: string | null
    agreedForResearch?: boolean | null
    dateOfBirth?: Date | null
}


const getUserProfile = async (userId: string) => {   
    const userProfile = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        phoneNumber: true,
        address: true,
        hospitalNumber: true,
        agreedForResearch: true,
        dateOfBirth: true
      }
    })
    // Log the fetched user data to the console
    console.log("User Profile fetched from DB:", userProfile)

    return {
        id: userProfile?.id ?? '',
        firstName: userProfile?.firstName ?? '',
        lastName: userProfile?.lastName ?? '',
        email: userProfile?.email ?? '',
        agreedForResearch: userProfile?.agreedForResearch ?? null,
        dateOfBirth: userProfile?.dateOfBirth ?? null,  
        phoneNumber: userProfile?.phoneNumber ?? null,
        address: userProfile?.address ?? null,
        hospitalNumber: userProfile?.hospitalNumber ?? null,
    }
}

export interface ClinicianData {
  id: string
  firstName: string
  lastName: string
  email: string
  institution?: string | null
  profession?: string | null
  agreedToShareData: boolean
  status: RelationshipStatus
} 

const getClinicians = async (userId: string) => {
  const clinicians = await prisma.clinicianPatient.findMany({
      where: {
          patientId: userId,
      },
      select: {
          clinician: {
              select: {
                  id: true,
                  firstName: true,
                  lastName: true,
                  email: true,
                  institution: true,
                  profession: true
              }
          },
          agreedToShareData: true,
          status: true
      }
  });
  // Log the fetched user data to the console
  console.log("Clinician data fetched from DB:", clinicians)

  return clinicians.map(({ clinician, agreedToShareData, status }) => ({
      id: clinician.id,
      firstName: clinician.firstName,
      lastName: clinician.lastName,
      email: clinician.email,
      institution: clinician.institution ?? null,
      profession: clinician.profession ?? null,
      agreedToShareData: agreedToShareData,
      status: status
  }));
};


export interface AllClinicians {
  id: string
  email: string
  firstName: string
  lastName: string
  profession?: string | null
  institution?: string | null
} 


const ProfilePage = async () => {
    const session = await getServerSession(authOptions)
    console.log(session)
    if (!session?.user?.id) {
      return <p>Unauthorized</p>
  }
    const userData = await getUserProfile(session.user.id)
    const clinicianData = await getClinicians(session.user.id)
    
 
    return (
      // Pass user data to the client component
      <UserProfile initialData={userData} clinicians={clinicianData}/>
    )
  }
  
  export default ProfilePage
