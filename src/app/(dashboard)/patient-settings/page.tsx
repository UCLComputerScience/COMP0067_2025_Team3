import { prisma } from '@/prisma/client'
import { Role } from '@prisma/client'
import UserProfile from '@/views/Settings'

export interface UserData {
    id: string
    firstName: string
    lastName: string
    email: string
    // phoneNumber: string
    // address: string
    // hospitalNumber: string
    // agreedForResearch: boolean
    dateOfBirth: Date | null
}

const getCurrentUserFake = async () => {
    const userId = await prisma.user.findFirst({
      where: {
        role: Role.PATIENT
      },
      select: {
        id: true
      }
    })
  
    return userId?.id ?? ''
  }


const getUserProfile = async (userId: string) => {   
    const userProfile = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        // phoneNumber: true,
        // address: true,
        // hospitalNumber: true,
        // agreedForResearch: true,
        dateOfBirth: true
      }
    })

    return {
        id: userProfile?.id ?? '',
        firstName: userProfile?.firstName ?? '',
        lastName: userProfile?.lastName ?? '',
        email: userProfile?.email ?? '',
        dateOfBirth: userProfile?.dateOfBirth ?? null,  // Fallback if dateOfBirth is null
    }
}

// const ProfilePage = async () => {
//     const userId = await getCurrentUserFake()
//     const userData = await getUserProfile(userId)
  
//     // State to hold user data (for client-side updates)
//     const [user, setUser] = useState<UserData | null>(null)
  
//     // Use effect to set the user data after fetching
//     useEffect(() => {
//       setUser(userData)
//     }, [userData])
  
//     // Wait until user data is loaded before rendering
//     if (!user) {
//       return <div>Loading...</div> // Render loading until user data is available
//     }
  
//     return <UserProfile initialData={user} />
//   }
  

// export default ProfilePage

const ProfilePage = async () => {
    const userId = await getCurrentUserFake()
    const userData = await getUserProfile(userId)
  
    return (
      // Pass user data to the client component
      <UserProfile initialData={userData} />
    )
  }
  
  export default ProfilePage
