'use client'

// MUI Imports
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'

// Type Imports
import { signOut } from 'next-auth/react'

import type { Mode } from '@core/types'

// Component Imports
import Illustrations from '@components/Illustrations'

// Hook Imports
import { useImageVariant } from '@core/hooks/useImageVariant'

const AccountInactive = ({ mode }: { mode: Mode }) => {
  // Vars
  const darkImg = '/images/pages/misc-mask-dark.png'
  const lightImg = '/images/pages/misc-mask-light.png'

  // Hooks
  const miscBackground = useImageVariant(mode, lightImg, darkImg)

  return (
    <div className='flex items-center justify-center min-bs-[100dvh] relative p-6 overflow-x-hidden'>
      <div className='flex items-center flex-col text-center gap-10'>
        <div className='flex flex-col gap-2 is-[90vw] sm:is-[unset]'>
          <Typography variant='h4'>Account Inactive</Typography>
          <Typography>
            This account is currently inactive and cannot be accessed at the moment. Please contact support if you
            believe this is an error or need further assistance.
          </Typography>
        </div>
        <img
          alt='error-illustration'
          src='/images/illustrations/characters/6.png'
          className='object-cover bs-[400px] md:bs-[450px] lg:bs-[500px]'
        />
        <Button onClick={() => signOut({ callbackUrl: '/home', redirect: true })} variant='contained'>
          Sign out and Back to Home
        </Button>
      </div>
      <Illustrations maskImg={{ src: miscBackground }} />
    </div>
  )
}

export default AccountInactive
