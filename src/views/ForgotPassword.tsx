'use client'

// React Imports
import { useState } from 'react'

import { toast } from 'react-toastify'

// MUI Imports
import Typography from '@mui/material/Typography'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'

import { sendPasswordReset } from '@/actions/email/sendReset'

// Component Imports
import Link from '@components/Link'
import Logo from '@components/layout/shared/Logo'

const ForgotPassword = () => {
  const [email, setEmail] = useState('')

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newEmail = e.target.value

    setEmail(newEmail)
  }

  const handleSubmit = async () => {
    const result = await sendPasswordReset(email)

    if (result?.success) {
      toast.success('Reset link sent successfully. Check your inbox.')
    } else {
      toast.error(`Failed to send: ${result?.error}`)
    }
  }

  return (
    <div className='flex bs-full justify-center'>
      <div className='flex justify-center items-center bs-full bg-backgroundPaper !min-is-full p-6 md:!min-is-[unset] md:p-12 md:is-[480px]'>
        <Link className='absolute block-start-5 sm:block-start-[38px] inline-start-6 sm:inline-start-[38px]'>
          {' '}
          <Logo />
        </Link>
        <div className='flex flex-col gap-5 is-full sm:is-auto md:is-full sm:max-is-[400px] md:max-is-[unset] border border-divider rounded-lg p-6 bg-backgroundPaper'>
          <Typography variant='h4' className='text-center'>{`Reset password`}</Typography>
          <form className='flex flex-col gap-5'>
            <TextField autoFocus fullWidth label='Email' value={email} onChange={handleEmailChange} />

            <Button fullWidth variant='contained' onClick={handleSubmit}>
              Request reset link
            </Button>
            <Typography className='text-center mt-4'>
              <Link href='/login' className='text-primary underline ml-2'>
                Back to login
              </Link>
            </Typography>
          </form>
        </div>
      </div>
    </div>
  )
}

export default ForgotPassword
