'use client'

// Next Imports
import { useEffect } from 'react'

import { redirect, usePathname } from 'next/navigation'

const AuthRedirect = () => {
  const pathname = usePathname()

  useEffect(() => {
    console.log('path name: ', pathname)
  }, [pathname])

  return redirect('/home')
}

export default AuthRedirect
