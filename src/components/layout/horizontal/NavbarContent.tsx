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

const NavbarContent = () => {
  // Hooks
  const { isBreakpointReached } = useHorizontalNav()

  return (
    <div
      className={classnames(horizontalLayoutClasses.navbarContent, 'flex items-center justify-between gap-4 is-full')}
    >
      <div className='flex items-center gap-4'>
        <NavToggle />
        {/* Hide Logo on Smaller screens */}
        {!isBreakpointReached && <Image src={SpiderLogo} alt='Spider Logo' objectFit='cover' width={200} height={50} />}
      </div>
      <div className='flex items-center'>
        <MenuItem component={Link} href='/'>
          Home
        </MenuItem>
        <MenuItem component={Link} href='/questionnaire'>
          The Spider
        </MenuItem>
        <MenuItem component={Link} href='/login'>
          Log In
        </MenuItem>
        <ModeDropdown />
      </div>
    </div>
  )
}

export default NavbarContent
