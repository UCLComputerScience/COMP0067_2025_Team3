// next
import { redirect } from 'next/navigation'

// auth
import { getServerSession } from 'next-auth'
import { authOptions } from '@/libs/auth'

// prisma
import { prisma } from '@/prisma/client'

// component
import Studies from '@/views/Studies'

const Page = async () => {
  const session = await getServerSession(authOptions)

  if (!session?.user) {
    redirect('/login')
  }

  const user = await prisma.user.findUnique({
    where: {
      id: session.user.id
    },
    select: {
      agreedForResearch: true
    }
  })

  if (!user?.agreedForResearch) {
    redirect('/home')
  }
  return <Studies />
}

export default Page
