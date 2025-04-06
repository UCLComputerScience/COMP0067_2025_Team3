// next
import { redirect } from 'next/navigation'

import { getServerSession } from 'next-auth'

// Component
import Records from '@/views/Records'

// Auth
import { authOptions } from '@/libs/auth'

// action
import { getResponseDataByUser } from '@/actions/records/recordAction'

const Page = async () => {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    redirect('/not-found')
  }

  const data = await getResponseDataByUser(session.user.id)

  return <Records data={data} />
}

export default Page
