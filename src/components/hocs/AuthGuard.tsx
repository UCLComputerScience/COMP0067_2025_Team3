'use client'

import { useEffect, useState } from 'react'

import { usePathname, useRouter } from 'next/navigation'

import { useSession } from 'next-auth/react'
import { Role } from '@prisma/client'

import type { ChildrenType } from '@core/types'
import AuthRedirect from '@/components/AuthRedirect'

export default function AuthGuard({ children }: ChildrenType) {
  const { data: session, status } = useSession()
  const router = useRouter()
  const pathName = usePathname()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (status === 'loading') return

    if (!session) {
      setIsLoading(false)
      
return
    }

    const userRole = session.user.role

    if (userRole !== Role.PATIENT && pathName.includes('my-records')) {
      router.push('/home')
      
return
    }

    if (userRole !== Role.RESEARCHER && pathName.includes('download')) {
      router.push('/home')
      
return
    }

    if (userRole !== Role.CLINICIAN && pathName.includes('all-patients')) {
      router.push('/home')
      
return
    }

    if (userRole !== Role.ADMIN && pathName.includes('all-users')) {
      router.push('/home')
      
return
    }

    setIsLoading(false)
  }, [session, status, pathName, router])

  // while the component is waiting for loading session data, it is still true
  if (status === 'loading' || isLoading) {
    return null
  }

  if (!session) {
    return <AuthRedirect />
  }

  return <>{children}</>
}
