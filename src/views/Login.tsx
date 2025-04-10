'use client'

// React Imports
import { useState, useEffect } from 'react'

// Next Imports
import { useRouter } from 'next/navigation'

// NextAuth Imports
import { signIn } from 'next-auth/react'

// MUI Imports
import Typography from '@mui/material/Typography'
import TextField from '@mui/material/TextField'
import IconButton from '@mui/material/IconButton'
import InputAdornment from '@mui/material/InputAdornment'
import Checkbox from '@mui/material/Checkbox'
import Button from '@mui/material/Button'
import FormControlLabel from '@mui/material/FormControlLabel'

// Component Imports
import Link from '@components/Link'
import Logo from '@components/layout/shared/Logo'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const LoginV2 = ({ mode }: { mode: string }) => {
  // States
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isPasswordShown, setIsPasswordShown] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [emailError, setEmailError] = useState<string | null>(null)
  const [rememberMe, setRememberMe] = useState(false)

  // Hooks
  const router = useRouter()

  // Email validation function
  const validateEmail = (email: string) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

    return regex.test(email)
  }

  // Load saved credentials on component mount
  useEffect(() => {
    const savedEmail = localStorage.getItem('userEmail')

    if (savedEmail) {
      setEmail(savedEmail)
    }

    const savedPassword = localStorage.getItem('userPassword')

    if (savedPassword) {
      setPassword(savedPassword)
      setRememberMe(true)
    }
  }, [])

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newEmail = e.target.value

    setEmail(newEmail)

    // Clear error when user starts typing
    if (emailError) setEmailError(null)
  }

  const handleClickShowPassword = () => setIsPasswordShown(show => !show)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    // Validate email before submission
    if (!validateEmail(email)) {
      setEmailError('Please enter a valid email address')

      return
    }

    const result = await signIn('credentials', { redirect: false, email, password })

    if (result?.error) {
      setError('Invalid email or password')
    } else {
      // Save email for future use
      localStorage.setItem('userEmail', email)

      // Save password only if remember me is checked
      if (rememberMe) {
        localStorage.setItem('userPassword', password)
      } else {
        localStorage.removeItem('userPassword')
      }

      router.push('/home')
    }
  }

  return (
    <div className='flex bs-full justify-center'>
      <div className='flex justify-center items-center bs-full bg-backgroundPaper !min-is-full p-6 md:!min-is-[unset] md:p-12 md:is-[480px]'>
      <Link href="/home" className='absolute block-start-5 sm:block-start-[38px] inline-start-6 sm:inline-start-[38px]'>
        <Logo />
      </Link>
        <div className='flex flex-col gap-5 is-full sm:is-auto md:is-full sm:max-is-[400px] md:max-is-[unset] border border-divider rounded-lg p-6 bg-backgroundPaper'>
          <Typography variant='h4' className='text-center'>{`Log in`}</Typography>
          <form onSubmit={handleLogin} className='flex flex-col gap-5'>
            <TextField
              autoFocus
              fullWidth
              label='Email'
              value={email}
              onChange={handleEmailChange}
              onBlur={() => {
                if (email && !validateEmail(email)) {
                  setEmailError('Please enter a valid email address')
                }
              }}
              error={!!emailError}
              helperText={emailError}
            />
            <TextField
              fullWidth
              label='Password'
              value={password}
              onChange={e => setPassword(e.target.value)}
              autoComplete='current-password'
              InputProps={{
                endAdornment: (
                  <InputAdornment position='end'>
                    {' '}
                    <IconButton size='small' edge='end' onClick={handleClickShowPassword}>
                      {' '}
                    </IconButton>{' '}
                  </InputAdornment>
                ),

                // Use inputProps (lowercase) to access the input element's props
                inputProps: {
                  // This prevents browser from showing the default password toggle
                  type: isPasswordShown ? 'text' : 'password'
                }
              }}
            />
            <div className='flex justify-between items-center flex-wrap gap-x-3 gap-y-1'>
              <FormControlLabel
                control={<Checkbox checked={rememberMe} onChange={e => setRememberMe(e.target.checked)} />}
                label='Remember me'
              />
              <Typography
                className='text-end'
                color='primary.main'
                component={Link}
                href='/forgotpassword'
                sx={{ textDecoration: 'underline' }}
              >
                {' '}
                Forgot password?
              </Typography>
            </div>
            <Button fullWidth variant='contained' type='submit'>
              Log In
            </Button>

            {error && (
            <Typography variant='caption' className='text-center mt-3' color='var(--mui-palette-error-main)'>
              {error}
            </Typography>
          )}

            <Typography className='text-center mt-4'>
              Don&apos;t have an account?
              <Link href='/register' className='text-primary underline ml-2'>
                Sign up instead
              </Link>
            </Typography>
          </form>
        </div>
      </div>
    </div>
  )
}

export default LoginV2


