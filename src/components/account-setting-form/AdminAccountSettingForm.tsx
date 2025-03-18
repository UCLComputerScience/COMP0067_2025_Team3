'use client'

// React imports
import { useState, useEffect } from 'react'

import { useSession } from 'next-auth/react'

// MUI imports
import Card from '@mui/material/Card'
import Button from '@mui/material/Button'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import CardActions from '@mui/material/CardActions'
import Grid from '@mui/material/Grid2'
import TextField from '@mui/material/TextField'

// Components
import { toast } from 'react-toastify'

// Form validation
import { useForm, Controller } from 'react-hook-form'
import { object, string, pipe, nonEmpty, email } from 'valibot'
import { valibotResolver } from '@hookform/resolvers/valibot'

// User actions
import { Role } from '@prisma/client'

import { updateUserProfile, getUserProfile } from '@/actions/all-users/userAction'
import DialogsAlert from '../DialogsAlert'

// Define type for admin form values
export type AdminFormValues = {
  firstName: string
  lastName: string
  email: string
}

// Define schema for admin users
const adminUserSchema = object({
  firstName: pipe(string(), nonEmpty('First name is required')),
  lastName: pipe(string(), nonEmpty('Last name is required')),
  email: pipe(string(), nonEmpty('Email is required'), email('Please enter a valid email address'))
})

// Initial default values
const defaultFormValues: AdminFormValues = {
  firstName: '',
  lastName: '',
  email: ''
}

const AdminAccountSettingForm = () => {
  const { data: session } = useSession()
  const [loading, setLoading] = useState(true)

  const {
    control,
    reset,
    handleSubmit,
    formState: { errors, isValid, isDirty }
  } = useForm<AdminFormValues>({
    resolver: valibotResolver(adminUserSchema),
    defaultValues: defaultFormValues
  })

  useEffect(() => {
    const loadUserProfile = async () => {
      if (session?.user?.id) {
        setLoading(true)

        try {
          const userData = await getUserProfile(session.user.id)

          if (userData) {
            // Reset form with user data
            reset({
              firstName: userData.firstName || '',
              lastName: userData.lastName || '',
              email: userData.email || ''
            })
          }
        } catch (error) {
          console.error('Error loading profile:', error)
          toast.error('Failed to load your profile')
        } finally {
          setLoading(false)
        }
      }
    }

    loadUserProfile()
  }, [session, reset])

  const onSubmit = async (data: AdminFormValues) => {
    if (!session?.user?.id) {
      toast.error('You must be logged in to update your profile')
      
return
    }

    try {
      // Map form fields to API fields
      const apiData = {
        id: session.user.id,
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        role: Role.ADMIN
      }

      const result = await updateUserProfile(apiData)

      if (result.success) {
        toast.success('Your profile has been updated successfully!')

        // Refresh the form with the latest data
        const updatedData = await getUserProfile(session.user.id)

        if (updatedData) {
          reset(
            {
              firstName: updatedData.firstName || '',
              lastName: updatedData.lastName || '',
              email: updatedData.email || ''
            },
            {
              keepDirty: false
            }
          )
        }
      } else {
        toast.error(result.message || 'Failed to update profile')
      }
    } catch (error) {
      console.error('Error updating profile:', error)
      toast.error('An error occurred while updating your profile')
    }
  }

  return (
    <Card className='w-full'>
      <form
        onSubmit={e => {
          e.preventDefault()

          if (!isValid) {
            toast.error('Please check the form for errors')
          }

          handleSubmit(onSubmit)()
        }}
      >
        <CardHeader title='Admin Account Settings' subheader='Manage your administrator information' />

        <CardContent>
          <Grid container spacing={6}>
            {/* Admin fields */}
            <Grid size={{ xs: 12, sm: 6 }}>
              <Controller
                name='firstName'
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label='First Name'
                    disabled={loading}
                    error={!!errors.firstName}
                    helperText={errors.firstName?.message}
                  />
                )}
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <Controller
                name='lastName'
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label='Last Name'
                    disabled={loading}
                    error={!!errors.lastName}
                    helperText={errors.lastName?.message}
                  />
                )}
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <Controller
                name='email'
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label='Email'
                    disabled={loading}
                    error={!!errors.email}
                    helperText={errors.email?.message}
                  />
                )}
              />
            </Grid>
          </Grid>
        </CardContent>

        <CardActions>
          <Button type='submit' variant='contained' disabled={loading || !isDirty} className='mie-2'>
            Save Changes
          </Button>

          <DialogsAlert
            triggerButtonLabel='Reset'
            dialogTitle='Confirm Form Reset'
            dialogText='Resetting the form will revert all changes. Continue?'
            confirmButtonLabel='Yes, Reset'
            cancelButtonLabel='Cancel'
            onConfirm={() => {
              // Re-fetch user data to reset the form
              if (session?.user?.id) {
                getUserProfile(session.user.id).then(userData => {
                  if (userData) {
                    reset({
                      firstName: userData.firstName || '',
                      lastName: userData.lastName || '',
                      email: userData.email || ''
                    })
                  }
                })
              }
            }}
          />
        </CardActions>
      </form>
    </Card>
  )
}

export default AdminAccountSettingForm
