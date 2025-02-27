import { prisma } from '@/prisma/client'
import { Role } from '@prisma/client'
import UserProfile from '@/views/Settings'

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
