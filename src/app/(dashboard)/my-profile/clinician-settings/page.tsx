import { prisma } from '@/prisma/client'
import UserProfile from '@/views/ClinicianSettings'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/libs/auth'


export interface UserData {
    id: string
    firstName: string
    lastName: string
    email: string
    phoneNumber?: string | null
    address?: string | null
    institution?: string | null
    registrationNumber?: string | null
    profession?: string | null
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
        institution: true,
        registrationNumber: true,
        profession: true
      }
    })
    // Log the fetched user data to the console
    console.log("User Profile fetched from DB:", userProfile)

    return {
        id: userProfile?.id ?? '',
        firstName: userProfile?.firstName ?? '',
        lastName: userProfile?.lastName ?? '',
        email: userProfile?.email ?? '',
        registrationNumber: userProfile?.registrationNumber ?? null,
        profession: userProfile?.profession ?? null,  
        phoneNumber: userProfile?.phoneNumber ?? null,
        address: userProfile?.address ?? null,
        institution: userProfile?.institution ?? null,
    }
}

const ProfilePage = async () => {
    const session = await getServerSession(authOptions)
    console.log(session)
    if (!session?.user?.id) {
      return <p>Unauthorized</p>
  }
    const userData = await getUserProfile(session.user.id)
    
 
    return (
      // Pass user data to the client component
      <UserProfile initialData={userData}/>
    )
  }
  
  export default ProfilePage