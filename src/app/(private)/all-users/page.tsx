import { prisma } from '@/prisma/client'
import { getServerSession } from 'next-auth'
import UsersList from '@/views/AllUsers'
import { authOptions } from '@/libs/auth'

export interface Users {
  id: string
  firstName: string
  lastName: string
  email: string
  role: string
  status: string
}

const getUsers = async (currentUserId: string): Promise<Users[]> =>{
  return await prisma.user.findMany({
    where: {
      NOT: {
        id: currentUserId, // Exclude the current user
      },
    },
    select: {
      id: true,
      firstName: true,
      lastName: true,
      email: true,
      role: true,
      status: true
    }
  });
};


const AllUsers = async () => {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    return <p>Unauthorized</p>
  }

  const userData = await getUsers(session.user.id);

  return <UsersList users={userData} />;
}

export default AllUsers;