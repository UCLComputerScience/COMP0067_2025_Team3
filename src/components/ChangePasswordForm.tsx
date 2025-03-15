'use client'

// React imports
import { useState } from 'react'

import { useSession } from 'next-auth/react'

// User actions

// MUI imports
import Card from '@mui/material/Card'
import Button from '@mui/material/Button'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import CardActions from '@mui/material/CardActions'
import Grid from '@mui/material/Grid2'
import TextField from '@mui/material/TextField'
import InputAdornment from '@mui/material/InputAdornment'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'

// Components
import { toast } from 'react-toastify'

// Form validation
import { useForm, Controller } from 'react-hook-form'
import type { InferInput } from 'valibot'
import { object, string, pipe, nonEmpty, minLength, regex } from 'valibot'
import { valibotResolver } from '@hookform/resolvers/valibot'

import DialogsAlert from './DialogsAlert'
import { updateUserPassword } from '@/actions/all-users/userAction'

export type FormValues = InferInput<typeof passwordSchema>

const passwordSchema = object({
  currentPassword: pipe(string(), nonEmpty('Please enter your current password.')),
  newPassword: pipe(
    string(),
    nonEmpty('Please enter your new password.'),
    minLength(8, 'New password must be at least 8 characters long'),
    regex(/[a-z]/, 'Must contain at least one lowercase letter'),
    regex(/[A-Z]/, 'Must contain at least one uppercase letter'),
    regex(/[0-9!@#$%^&*]/, 'Must contain at least one number or symbol')
  ),
  confirmPassword: pipe(string(), nonEmpty('Please confirm your new password.'))
})

interface Props {
  title?: string
  subheader?: string
  className?: string
}

const emptyFormDefaultValue = {
  currentPassword: '',
  newPassword: '',
  confirmPassword: ''
}

const ChangePasswordForm = ({
  title = 'Change Password',
  subheader = 'Update your account password',
  className = ''
}: Props) => {
  const [loading, setLoading] = useState(false)

  // Password visibility states
  const [isCurrentPasswordShown, setIsCurrentPasswordShown] = useState(false)
  const [isNewPasswordShown, setIsNewPasswordShown] = useState(false)
  const [isConfirmPasswordShown, setIsConfirmPasswordShown] = useState(false)

  const {
    control,
    reset,
    handleSubmit,
    formState: { errors, isValid, isDirty }
  } = useForm<FormValues>({
    resolver: valibotResolver(passwordSchema),
    defaultValues: emptyFormDefaultValue
  })

  const { data: session } = useSession()

  const onSubmit = async (data: FormValues) => {
    try {
      setLoading(true)

      if (!session?.user?.id) {
        toast.error('You must be logged in to change your password')

        return
      }

      // Check if passwords match
      if (data.newPassword !== data.confirmPassword) {
        toast.error('New password and confirmation do not match')

        return
      }

      const result = await updateUserPassword(session.user.id, {
        currentPassword: data.currentPassword,
        newPassword: data.newPassword
      })

      if (result.success) {
        toast.success(result.message || 'Password updated successfully!')
        reset()
      } else {
        toast.error(result.message || 'Failed to change password')
      }
    } catch (error) {
      console.error('Error changing password:', error)
      toast.error('An error occurred while changing your password. Please try again later.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className={`w-full ${className}`}>
      <form
        className='w-full'
        onSubmit={e => {
          e.preventDefault()

          if (!isValid) {
            toast.error('Oops! Some fields need attention. Please check your input and try again.')
          }

          handleSubmit(onSubmit)()
        }}
      >
        <CardHeader title={title} subheader={subheader} />

        <CardContent>
          <Grid container spacing={6} className='w-full'>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Controller
                name='currentPassword'
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label='Current Password'
                    type={isCurrentPasswordShown ? 'text' : 'password'}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position='end'>
                          <IconButton
                            size='small'
                            edge='end'
                            onClick={() => setIsCurrentPasswordShown(!isCurrentPasswordShown)}
                          >
                            <i className={isCurrentPasswordShown ? 'ri-eye-off-line' : 'ri-eye-line'} />
                          </IconButton>
                        </InputAdornment>
                      )
                    }}
                    error={!!errors.currentPassword}
                    helperText={errors.currentPassword?.message}
                    disabled={loading}
                  />
                )}
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <Controller
                name='newPassword'
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label='New Password'
                    type={isNewPasswordShown ? 'text' : 'password'}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position='end'>
                          <IconButton
                            size='small'
                            edge='end'
                            onClick={() => setIsNewPasswordShown(!isNewPasswordShown)}
                          >
                            <i className={isNewPasswordShown ? 'ri-eye-off-line' : 'ri-eye-line'} />
                          </IconButton>
                        </InputAdornment>
                      )
                    }}
                    error={!!errors.newPassword}
                    helperText={errors.newPassword?.message}
                    disabled={loading}
                  />
                )}
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <Controller
                name='confirmPassword'
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label='Confirm New Password'
                    type={isConfirmPasswordShown ? 'text' : 'password'}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position='end'>
                          <IconButton
                            size='small'
                            edge='end'
                            onClick={() => setIsConfirmPasswordShown(!isConfirmPasswordShown)}
                          >
                            <i className={isConfirmPasswordShown ? 'ri-eye-off-line' : 'ri-eye-line'} />
                          </IconButton>
                        </InputAdornment>
                      )
                    }}
                    error={!!errors.confirmPassword}
                    helperText={errors.confirmPassword?.message}
                    disabled={loading}
                  />
                )}
              />
            </Grid>

            <Grid size={{ xs: 12 }} className='flex flex-col gap-4'>
              <Typography variant='h6' color='text.secondary'>
                Password Requirements:
              </Typography>
              <div className='flex flex-col gap-4'>
                <div className='flex items-center gap-2.5 text-textSecondary'>
                  <i className='ri-checkbox-blank-circle-fill text-[8px]' />
                  Minimum 8 characters long - the more, the better
                </div>
                <div className='flex items-center gap-2.5 text-textSecondary'>
                  <i className='ri-checkbox-blank-circle-fill text-[8px]' />
                  At least one lowercase & one uppercase character
                </div>
                <div className='flex items-center gap-2.5 text-textSecondary'>
                  <i className='ri-checkbox-blank-circle-fill text-[8px]' />
                  At least one number, symbol, or whitespace character
                </div>
              </div>
            </Grid>
          </Grid>
        </CardContent>

        <CardActions>
          <Button type='submit' variant='contained' className='mie-2' disabled={!isDirty || loading}>
            Save Changes
          </Button>
          <DialogsAlert
            triggerButtonLabel='Reset'
            dialogTitle='Confirm Form Reset'
            dialogText='Resetting the form will erase all entered data and cannot be undone.'
            confirmButtonLabel='Yes, Reset'
            cancelButtonLabel='Cancel'
            onConfirm={() => reset()}
          />
        </CardActions>
      </form>
    </Card>
  )
}

export default ChangePasswordForm
