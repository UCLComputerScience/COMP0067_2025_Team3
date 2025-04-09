'use client'

import { useEffect } from 'react'

import { useRouter } from 'next/navigation'

import { useSession } from 'next-auth/react'
import { AccountStatus } from '@prisma/client'

import type { ChildrenType } from '@core/types'

export default function StatusCheck({ children }: ChildrenType) {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === 'loading' || !session) return

    const userStatus = session.user.status

    if (userStatus === AccountStatus.INACTIVE) {
      router.push('/account-inactive')
    } else if (userStatus === AccountStatus.PENDING) {
      router.push('/account-pending')
    }
  }, [session, status, router])

  return <>{children}</>
}
