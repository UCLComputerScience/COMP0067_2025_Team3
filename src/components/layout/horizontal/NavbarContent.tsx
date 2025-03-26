'use client'

// Third-party Imports
import Image from 'next/image'

import { usePathname } from 'next/navigation'

import classnames from 'classnames'

import MenuItem from '@mui/material/MenuItem'

import { signOut, useSession } from 'next-auth/react'

import { Role } from '@prisma/client'

import Link from '@/components/Link'

// Component Imports

import NavToggle from './NavToggle'
import ModeDropdown from '@components/layout/shared/ModeDropdown'
import SpiderLogo from '@components/layout/horizontal/spider_logo_1.png'

// Hook Imports
import useHorizontalNav from '@menu/hooks/useHorizontalNav'

// Util Imports
import { horizontalLayoutClasses } from '@layouts/utils/layoutClasses'

const NavbarContent = () => {
  // Hooks
  const { data: session } = useSession()
  const { isBreakpointReached } = useHorizontalNav()
  const pathname = usePathname()

  const userRole = session?.user?.role || 'GUEST'

  const menuItems = [
    ...(userRole === 'GUEST'
      ? [
          { label: 'Home', href: '/home' },
          { label: 'The Spider', href: '/questionnaire' }
        ]
      : userRole === Role.RESEARCHER
        ? [
            { label: 'Home', href: '/home' },
            { label: 'Download', href: '/download' },
            { label: 'My Profile', href: '/my-profile' }
          ]
        : userRole === Role.CLINICIAN
          ? [
              { label: 'Home', href: '/home' },
              { label: 'All Patients', href: '/all-patients' },
              { label: 'My Profile', href: '/my-profile' }
            ]
          : userRole === Role.PATIENT
            ? [
                { label: 'Home', href: '/home' },
                { label: 'The Spider', href: '/my-questionnaire' },
                { label: 'My Records', href: '/my-records' },
                { label: 'My Profile', href: '/my-profile' }
              ]
            : userRole === Role.ADMIN
              ? [
                  { label: 'Home', href: '/home' },
                  { label: 'All Users', href: '/all-users' },
                  { label: 'My Profile', href: '/my-profile' }
                ]
              : [])
  ]

  // debug
  // useEffect(() => {
  //   console.log(session)
  //   console.log(pathname)
  // }, [])

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
          <MenuItem
            key={item.href}
            component={Link}
            href={item.href}
            className={classnames('font-small plb-3 pli-1.5 mr-2 hover:text-primary', {
              'text-primary': pathname.includes(item.href),
              'font-medium': pathname.includes(item.href)
            })}
          >
            {item.label}
          </MenuItem>
        ))}
        {session ? (
          <MenuItem
            onClick={() => signOut({ callbackUrl: '/home', redirect: true })}
            className={classnames('font-small plb-3 pli-1.5 mr-2 hover:text-primary')}
            style={{ cursor: 'pointer' }}
          >
            Log Out
          </MenuItem>
        ) : (
          <MenuItem
            component={Link}
            href='/login'
            className={classnames('font-small plb-3 pli-1.5 mr-2 hover:text-primary')}
          >
            Log In
          </MenuItem>
        )}
        <ModeDropdown />
      </div>
    </div>
  )
}

export default NavbarContent
