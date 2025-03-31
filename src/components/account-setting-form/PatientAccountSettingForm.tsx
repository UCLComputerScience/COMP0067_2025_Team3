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
import { object, string, pipe, nonEmpty, email, optional, date, regex } from 'valibot'
import { valibotResolver } from '@hookform/resolvers/valibot'

// User actions
import { Role } from '@prisma/client'

import { updateUserProfile, getUserProfile } from '@/actions/all-users/userAction'
import AppReactDatepicker from '@/libs/styles/AppReactDatepicker'
import DialogsAlert from '../DialogsAlert'

// Define type for patient form values
export type PatientFormValues = {
  firstName: string
  lastName: string
  email: string
  phoneNumber?: string
  address?: string
  dateOfBirth?: Date
  hospitalNumber?: string
}

// Define schema for patient users
const patientUserSchema = object({
  firstName: pipe(string(), nonEmpty('First name is required')),
  lastName: pipe(string(), nonEmpty('Last name is required')),
  email: pipe(string(), nonEmpty('Email is required'), email('Please enter a valid email address')),
  phoneNumber: optional(
    pipe(
      string(),
      regex(/^[+\d ]*$/, 'Invalid phone number. Only numbers, spaces, and "+" are allowed.')
    )
  ),
  address: pipe(optional(string(), '')),
  hospitalNumber: pipe(optional(string(), '')),
  dateOfBirth: optional(date())
})

// Initial default values
const defaultFormValues: PatientFormValues = {
  firstName: '',
  lastName: '',
  email: '',
  phoneNumber: '',
  address: '',
  dateOfBirth: undefined,
  hospitalNumber: ''
}

const PatientAccountSettingForm = () => {
  const { data: session } = useSession()
  const [loading, setLoading] = useState(true)

  const {
    control,
    reset,
    handleSubmit,
    formState: { errors, isValid, isDirty }
  } = useForm<PatientFormValues>({
    resolver: valibotResolver(patientUserSchema),
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
              email: userData.email || '',
              phoneNumber: userData.phoneNumber || '',
              address: userData.address || '',
              dateOfBirth: userData.dateOfBirth || undefined,
              hospitalNumber: userData.hospitalNumber || ''
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

  const onSubmit = async (data: PatientFormValues) => {
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
        phoneNumber: data.phoneNumber || '',
        address: data.address || '',
        dateOfBirth: data.dateOfBirth,
        hospitalNumber: data.hospitalNumber || '',
        role: Role.PATIENT
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
              email: updatedData.email || '',
              phoneNumber: updatedData.phoneNumber || '',
              address: updatedData.address || '',
              dateOfBirth: updatedData.dateOfBirth || undefined,
              hospitalNumber: updatedData.hospitalNumber || ''
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
        <CardHeader title='Patient Account Settings' subheader='Manage your personal information' />

        <CardContent>
          <Grid container spacing={6}>
            {/* Common fields */}
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

            <Grid size={{ xs: 12, sm: 6 }}>
              <Controller
                name='phoneNumber'
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label='Phone Number'
                    disabled={loading}
                    error={!!errors.phoneNumber}
                    helperText={errors.phoneNumber?.message}
                  />
                )}
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <Controller
                name='address'
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label='Address'
                    disabled={loading}
                    error={!!errors.address}
                    helperText={errors.address?.message}
                  />
                )}
              />
            </Grid>

            {/* Patient-specific fields */}
            <Grid size={{ xs: 12, sm: 6 }}>
              <Controller
                name='dateOfBirth'
                control={control}
                render={({ field }) => (
                  <AppReactDatepicker
                    selected={field.value}
                    onChange={date => field.onChange(date)}
                    showYearDropdown
                    showMonthDropdown
                    disabled={loading}
                    placeholderText='MM/DD/YYYY'
                    customInput={
                      <TextField
                        fullWidth
                        label='Date Of Birth'
                        error={!!errors.dateOfBirth}
                        helperText={errors.dateOfBirth?.message}
                      />
                    }
                  />
                )}
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <Controller
                name='hospitalNumber'
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label='Hospital Number'
                    disabled={loading}
                    error={!!errors.hospitalNumber}
                    helperText={errors.hospitalNumber?.message}
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
                      email: userData.email || '',
                      phoneNumber: userData.phoneNumber || '',
                      address: userData.address || '',
                      dateOfBirth: userData.dateOfBirth || undefined,
                      hospitalNumber: userData.hospitalNumber || ''
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

export default PatientAccountSettingForm
