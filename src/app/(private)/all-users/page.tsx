import { getServerSession } from 'next-auth'

import { Role } from '@prisma/client'

import { prisma } from '@/prisma/client'
import UsersList from '@/views/UsersList'
import { authOptions } from '@/libs/auth'

export interface Users {
  id: string
  firstName: string
  lastName: string
  email: string
  role: string
  status: string
}

const getAllUsersExceptAdmin = async (currentUserId: string): Promise<Users[]> => {
  return await prisma.user.findMany({
    where: {
      AND: [
        { id: { not: currentUserId } }, // Exclude the current user
        { role: { not: Role.ADMIN } } // Exclude users with the ADMIN role
      ]
    },
    select: {
      id: true,
      firstName: true,
      lastName: true,
      email: true,
      role: true,
      status: true
    }
  })
}

const Page = async () => {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    return <p>Unauthorized</p>
  }

  const userData = await getAllUsersExceptAdmin(session.user.id)

  return <UsersList users={userData} />
}

export default Page
