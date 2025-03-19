"use client"

// Third-party Imports
import Image from 'next/image'
import Link from 'next/link'
import classnames from 'classnames'
import { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import { Suspense } from 'react'

// Component Imports
import MenuItem from '@mui/material/MenuItem'
import NavToggle from './NavToggle'
import ModeDropdown from '@components/layout/shared/ModeDropdown'
import SpiderLogo from '@components/layout/horizontal/spider_logo_1.png'

// NextAuth Imports
import { useSession, signOut } from 'next-auth/react'

// Hook Imports
import useHorizontalNav from '@menu/hooks/useHorizontalNav'

// Util Imports
import { horizontalLayoutClasses } from '@layouts/utils/layoutClasses'
import { useRouter, usePathname } from 'next/navigation'

const NavbarContentInner = () => {
  // Hooks
  const { isBreakpointReached } = useHorizontalNav()
  const router = useRouter()
  const pathname = usePathname()
  
  // Use NextAuth session
  const { data: session, status } = useSession()
  const loading = status === 'loading'
  const user = session?.user

  // Logout
  const handleLogout = async () => {
    console.log("Logout button clicked")
    try {
      await signOut({ redirect: false })
      window.location.href = '/home'
    } catch (error) {
      console.error('Failed to logout:', error)
    }
  }

  // loading
  if (loading) { 
    return (
      <div className={classnames(horizontalLayoutClasses.navbarContent, 'flex items-center justify-between gap-4 is-full')}>
        <div className="p-4 text-gray-500">Loading...</div>
      </div>
    )
  }

  //Generate menu items based on user roles
  const renderRoleSpecificMenuItems = () => {
    if (!user) {
      //  unregistered users
      return (
        <>
          <MenuItem component={Link} href='/about'> The Spider</MenuItem>
          <MenuItem component={Link} href='/login'> Log In</MenuItem>
        </>
      )
    }

    const role = user.role?.toLowerCase() || ''

     // Returns specific menu items based on role
    switch (role) {
      case 'clinician':
        return (
          <>
            <MenuItem component={Link} href="/clinician-allpatients">All Patients</MenuItem>
            <MenuItem component={Link} href="/clinician-myprofile">My Profile</MenuItem>
            <MenuItem onClick={handleLogout}>Log Out</MenuItem>
          </>
        )
      case "researcher":
        return (
          <>
            <MenuItem component={Link} href="/researcher-download">Download Data</MenuItem>
            <MenuItem component={Link} href="/researcher-myprofile">My Profile</MenuItem>
            <MenuItem onClick={handleLogout}>Log Out</MenuItem>
          </>
        )
      case 'admin':
        return (
          <>
            <MenuItem component={Link} href="/admin-allusers">All Users</MenuItem>
            <MenuItem component={Link} href="/admin-myprofile">My Profile</MenuItem>
            <MenuItem onClick={handleLogout}>Log Out</MenuItem>
          </>
        )
      case 'patient':
        return (
          <>
            <MenuItem component={Link} href="/home">The Spider</MenuItem>
            <MenuItem component={Link} href="/my-records">My Records</MenuItem>
            <MenuItem component={Link} href="/patient-settings">My Profile</MenuItem>
            <MenuItem onClick={handleLogout}>Log Out</MenuItem>
          </>
        )
      default:
        return null
    }
  }

  return (
    <div
      className={classnames(horizontalLayoutClasses.navbarContent, 'flex items-center justify-between gap-4 is-full')}
    >
      <div className='flex items-center gap-4'>
        <NavToggle />
        {/* Hide Logo on Smaller screens */}
        {!isBreakpointReached && (
          <Link href="/">
            <Image src={SpiderLogo} alt='Spider Logo' objectFit='cover' width={200} height={50} />
          </Link>
        )}
      </div>
      <div className='flex items-center'>
          {!user && (
            <MenuItem component={Link} href='/'>
              Home
            </MenuItem>
          )}
          
          {/* Rendering role-based menu items */}
          {renderRoleSpecificMenuItems()}
          
          <ModeDropdown />
        </div>
    </div>
  )
}

// dynamic loading，dont use SSR
const DynamicNavbarContent = dynamic(() => Promise.resolve(NavbarContentInner), {
  ssr: false
})

const NavbarContent = () => {
  return (
    <Suspense fallback={
      <div className={classnames(horizontalLayoutClasses.navbarContent, 'flex items-center justify-between gap-4 is-full')}>
        <div className="p-4 text-gray-500">Loading navbar...</div>
      </div>
    }>
      <DynamicNavbarContent />
    </Suspense>
  )
}

export default NavbarContent
