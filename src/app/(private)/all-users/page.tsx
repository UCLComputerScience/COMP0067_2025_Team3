import { Button } from '@mui/material'

import Link from '@/components/Link'
import { prisma } from '@/prisma/client'

const fakeGetAllUsers = async () => {
  const users = await prisma.user.findMany({
    select: {
      firstName: true,
      lastName: true,
      id: true
    }
  })

  return users
}

const Page = async () => {
  const users = await fakeGetAllUsers()

  return (
    <>
      {users.map((u, k) => {
        return (
          <div key={k}>
            <Link href={`/all-users/${u.id}`}>
              <Button>
                {u.firstName} {u.lastName}
              </Button>
            </Link>
          </div>
        )
      })}
    </>
  )
}

export default Page
