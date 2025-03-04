'use client'

// Third-party Imports
import Image from 'next/image'

import Link from 'next/link'

import classnames from 'classnames'

// Component Imports
import MenuItem from '@mui/material/MenuItem'

import NavToggle from './NavToggle'
import ModeDropdown from '@components/layout/shared/ModeDropdown'
import SpiderLogo from '@components/layout/horizontal/spider_logo_1.png'

// Hook Imports
import useHorizontalNav from '@menu/hooks/useHorizontalNav'

// Util Imports
import { horizontalLayoutClasses } from '@layouts/utils/layoutClasses'
import { signOut, useSession } from 'next-auth/react'
import { useEffect } from 'react'
import { Role } from '@prisma/client'

const NavbarContent = () => {
  // Hooks
  const { data: session } = useSession()
  const { isBreakpointReached } = useHorizontalNav()

  const userRole = session?.user?.role || 'GUEST'
  const menuItems = [
    ...(userRole === 'GUEST'
      ? [
          { label: 'Home', href: '/' },
          { label: 'The Spider', href: '/about' }
        ]
      : userRole === Role.RESEARCHER
        ? [
            { label: 'Home', href: '/' },
            { label: 'Download', href: '/download' },
            { label: 'My Profile', href: '/my-profile' }
          ]
        : userRole === Role.CLINICIAN
          ? [
              { label: 'Home', href: '/' },
              { label: 'All Patients', href: '/all-patients' },
              { label: 'My Profile', href: '/my-profile' }
            ]
          : userRole === Role.PATIENT
            ? [
                { label: 'Home', href: '/' },
                { label: 'The Spider', href: '/about' },
                { label: 'My Records', href: '/my-records' },
                { label: 'My Profile', href: '/my-profile' }
              ]
            : userRole === Role.ADMIN
              ? [
                  { label: 'Home', href: '/' },
                  { label: 'All Users', href: '/all-users' },
                  { label: 'My Profile', href: '/my-profile' }
                ]
              : [])
  ]

  useEffect(() => {
    console.log(session)
  }, [])

  return (
    <div
      className={classnames(horizontalLayoutClasses.navbarContent, 'flex items-center justify-between gap-4 is-full')}
    >
      <div className='flex items-center gap-4'>
        <NavToggle />
        {!isBreakpointReached && <Image src={SpiderLogo} alt='Spider Logo' objectFit='cover' width={200} height={50} />}
      </div>
      <div className='flex items-center'>
        {menuItems.map(item => (
          <MenuItem key={item.href} component={Link} href={item.href}>
            {item.label}
          </MenuItem>
        ))}
        {session ? (
          <MenuItem onClick={() => signOut({ callbackUrl: '/home', redirect: true })} style={{ cursor: 'pointer' }}>
            Log Out
          </MenuItem>
        ) : (
          <MenuItem component={Link} href='/login'>
            Log In
          </MenuItem>
        )}
        <ModeDropdown />
      </div>
    </div>
  )
}

export default NavbarContent
