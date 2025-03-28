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
import { useEffect, useState } from 'react'
import { getPatientAgreedToResearch } from '@/actions/patient/consentActions'

const NavbarContent = () => {
  // Hooks
  const { data: session } = useSession()
  const { isBreakpointReached } = useHorizontalNav()
  const [agreedToResearch, setAgreedToResearch] = useState(false)
  const pathname = usePathname()

  const userRole = session?.user?.role || 'GUEST'
  const userId = session?.user?.id

  useEffect(() => {
    const fetchResearchConsent = async () => {
      if (userRole === Role.PATIENT && userId) {
        const consent = await getPatientAgreedToResearch(userId)
        setAgreedToResearch(consent)
      }
    }

    fetchResearchConsent()
  }, [userRole, userId])

  const getMenuItems = () => {
    if (userRole === 'GUEST') {
      return [
        { label: 'Home', href: '/home' },
        { label: 'The Spider', href: '/questionnaire' }
      ]
    } else if (userRole === Role.RESEARCHER) {
      return [
        { label: 'Home', href: '/home' },
        { label: 'Download', href: '/download' },
        { label: 'My Profile', href: '/my-profile' }
      ]
    } else if (userRole === Role.CLINICIAN) {
      return [
        { label: 'Home', href: '/home' },
        { label: 'All Patients', href: '/all-patients' },
        { label: 'My Profile', href: '/my-profile' }
      ]
    } else if (userRole === Role.PATIENT) {
      const patientItems = [
        { label: 'Home', href: '/home' },
        { label: 'The Spider', href: '/my-questionnaire' },
        { label: 'My Records', href: '/my-records' },
        { label: 'My Profile', href: '/my-profile' }
      ]

      // Only add the Studies link if they've agreed to research
      if (agreedToResearch) {
        patientItems.splice(3, 0, { label: 'Studies', href: '/studies' })
      }

      return patientItems
    } else if (userRole === Role.ADMIN) {
      return [
        { label: 'Home', href: '/home' },
        { label: 'All Users', href: '/all-users' },
        { label: 'Studies', href: '/studies' },
        { label: 'My Profile', href: '/my-profile' }
      ]
    }

    return []
  }

  const menuItems = getMenuItems()
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
