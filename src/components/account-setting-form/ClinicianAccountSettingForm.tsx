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
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import FormHelperText from '@mui/material/FormHelperText'

// Components
import { toast } from 'react-toastify'

// Form validation
import { useForm, Controller } from 'react-hook-form'
import { object, string, pipe, nonEmpty, email, optional } from 'valibot'
import { valibotResolver } from '@hookform/resolvers/valibot'

// User actions
import { Role } from '@prisma/client'

import { updateUserProfile, getUserProfile } from '@/actions/all-users/userAction'
import DialogsAlert from '../DialogsAlert'

// Constants for selections
const SPECIALIST_OPTIONS = [
  'Rheumatologist',
  'General Practitioner',
  'Geneticist',
  'Paediatrician',
  'Physiotherapist',
  'Orthopaedic Consultant',
  'Other'
] as const

const ORGANIZATIONS = [
  'University College London (UCL)',
  'Kings College London',
  'Imperial College London',
  'NHS England',
  'South London and Maudsley NHS Trust',
  'Other'
]

// Define type for clinician form values
export type ClinicianFormValues = {
  firstName: string
  lastName: string
  email: string
  phoneNumber?: string
  address?: string
  registrationNumber?: string
  profession?: string
  institution?: string
}

// Define schema for clinician users
const clinicianUserSchema = object({
  firstName: pipe(string(), nonEmpty('First name is required')),
  lastName: pipe(string(), nonEmpty('Last name is required')),
  email: pipe(string(), nonEmpty('Email is required'), email('Please enter a valid email address')),
  phoneNumber: pipe(optional(string(), '')),
  address: pipe(optional(string(), '')),
  registrationNumber: pipe(optional(string(), '')),
  profession: pipe(optional(string(), '')),
  institution: pipe(optional(string(), ''))
})

// Initial default values
const defaultFormValues: ClinicianFormValues = {
  firstName: '',
  lastName: '',
  email: '',
  phoneNumber: '',
  address: '',
  registrationNumber: '',
  profession: '',
  institution: ''
}

const ClinicianAccountSettingForm = () => {
  const { data: session } = useSession()
  const [loading, setLoading] = useState(true)
  const [showOtherProfession, setShowOtherProfession] = useState<boolean | undefined | ''>(false)
  const [otherProfession, setOtherProfession] = useState('')

  // For institution field
  const [showOtherInstitution, setShowOtherInstitution] = useState<boolean | undefined | ''>(false)
  const [otherInstitution, setOtherInstitution] = useState('')

  const {
    control,
    reset,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isValid, isDirty }
  } = useForm<ClinicianFormValues>({
    resolver: valibotResolver(clinicianUserSchema),
    defaultValues: defaultFormValues
  })

  // Watch fields to update "Other" states
  const professionValue = watch('profession')
  const institutionValue = watch('institution')

  useEffect(() => {
    // Check if current profession is "Other" or a custom value
    const isOtherProfession =
      professionValue === 'Other' || (professionValue && !SPECIALIST_OPTIONS.includes(professionValue as any))

    setShowOtherProfession(isOtherProfession)

    // If loading a custom profession, store it in otherProfession state
    if (isOtherProfession && professionValue !== 'Other') {
      setOtherProfession(professionValue || '')
    }

    // Check if current institution is "Other" or a custom value
    const isOtherInstitution =
      institutionValue === 'Other' || (institutionValue && !ORGANIZATIONS.includes(institutionValue))

    setShowOtherInstitution(isOtherInstitution)

    // If loading a custom institution, store it in otherInstitution state
    if (isOtherInstitution && institutionValue !== 'Other') {
      setOtherInstitution(institutionValue || '')
    }
  }, [professionValue, institutionValue])

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
              institution: userData.institution || '',
              registrationNumber: userData.registrationNumber || '',
              profession: userData.profession || ''
            })

            // Check if profession is a custom value
            if (userData.profession && !SPECIALIST_OPTIONS.includes(userData.profession as any)) {
              setOtherProfession(userData.profession)
              setShowOtherProfession(true)
            }

            // Check if institution is a custom value
            if (userData.institution && !ORGANIZATIONS.includes(userData.institution)) {
              setOtherInstitution(userData.institution)
              setShowOtherInstitution(true)
            }
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

  const onSubmit = async (data: ClinicianFormValues) => {
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
        institution: data.institution || '',
        registrationNumber: data.registrationNumber || '',
        profession: data.profession || '',
        role: Role.CLINICIAN
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
              institution: updatedData.institution || '',
              registrationNumber: updatedData.registrationNumber || '',
              profession: updatedData.profession || ''
            },
            {
              keepDirty: false
            }
          )

          // Update other field states
          if (updatedData.profession && !SPECIALIST_OPTIONS.includes(updatedData.profession as any)) {
            setOtherProfession(updatedData.profession)
          }

          if (updatedData.institution && !ORGANIZATIONS.includes(updatedData.institution)) {
            setOtherInstitution(updatedData.institution)
          }
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
        <CardHeader title='Clinician Account Settings' subheader='Manage your professional information' />

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

            {/* Clinician-specific fields */}
            <Grid size={{ xs: 12, sm: 6 }}>
              <Controller
                name='registrationNumber'
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    multiline
                    fullWidth
                    label='Registration Number'
                    disabled={loading}
                    error={!!errors.registrationNumber}
                    helperText={errors.registrationNumber?.message}
                  />
                )}
              />
            </Grid>

            {/* Profession field with "Other" option */}
            <Grid size={{ xs: 12, sm: 6 }}>
              <FormControl fullWidth error={!!errors.profession} disabled={loading}>
                <InputLabel>Profession</InputLabel>
                <Controller
                  name='profession'
                  control={control}
                  render={({ field }) => (
                    <Select
                      {...field}
                      label='Profession'
                      value={showOtherProfession && field.value !== 'Other' ? 'Other' : field.value || ''}
                      onChange={e => {
                        const value = e.target.value

                        if (value === 'Other') {
                          setShowOtherProfession(true)

                          // If we previously had a custom value, keep it
                          field.onChange(otherProfession || 'Other')
                        } else {
                          setShowOtherProfession(false)
                          field.onChange(value)
                        }
                      }}
                    >
                      {SPECIALIST_OPTIONS.map(prof => (
                        <MenuItem key={prof} value={prof}>
                          {prof}
                        </MenuItem>
                      ))}
                    </Select>
                  )}
                />
                {errors.profession && <FormHelperText>{errors.profession.message}</FormHelperText>}
              </FormControl>
            </Grid>

            {/* "Other" profession text field */}
            {showOtherProfession && (
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  label='Specify Profession'
                  placeholder='Please specify your profession'
                  disabled={loading}
                  value={otherProfession}
                  onChange={e => {
                    const value = e.target.value

                    setOtherProfession(value)

                    // Update the form value
                    setValue('profession', value || 'Other', { shouldDirty: true })
                  }}
                  error={!!errors.profession}
                  helperText={errors.profession?.message || 'Please specify your profession'}
                />
              </Grid>
            )}

            {/* Institution field with "Other" option */}
            <Grid size={{ xs: 12, sm: 6 }}>
              <FormControl fullWidth error={!!errors.institution} disabled={loading}>
                <InputLabel>Institution</InputLabel>
                <Controller
                  name='institution'
                  control={control}
                  render={({ field }) => (
                    <Select
                      {...field}
                      label='Institution'
                      value={showOtherInstitution && field.value !== 'Other' ? 'Other' : field.value || ''}
                      onChange={e => {
                        const value = e.target.value

                        if (value === 'Other') {
                          setShowOtherInstitution(true)
                          field.onChange(otherInstitution || 'Other')
                        } else {
                          setShowOtherInstitution(false)
                          field.onChange(value)
                        }
                      }}
                    >
                      {ORGANIZATIONS.map(org => (
                        <MenuItem key={org} value={org}>
                          {org}
                        </MenuItem>
                      ))}
                    </Select>
                  )}
                />
                {errors.institution && <FormHelperText>{errors.institution.message}</FormHelperText>}
              </FormControl>
            </Grid>

            {/* "Other" institution text field */}
            {showOtherInstitution && (
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  label='Specify Institution'
                  placeholder='Please specify your institution'
                  disabled={loading}
                  value={otherInstitution}
                  onChange={e => {
                    const value = e.target.value

                    setOtherInstitution(value)

                    // Update the form value
                    setValue('institution', value || 'Other', { shouldDirty: true })
                  }}
                  error={!!errors.institution}
                  helperText={errors.institution?.message || 'Please specify your institution'}
                />
              </Grid>
            )}
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
                      institution: userData.institution || '',
                      registrationNumber: userData.registrationNumber || '',
                      profession: userData.profession || ''
                    })

                    // Reset custom field states
                    if (userData.profession && !SPECIALIST_OPTIONS.includes(userData.profession as any)) {
                      setOtherProfession(userData.profession)
                      setShowOtherProfession(true)
                    } else {
                      setOtherProfession('')
                      setShowOtherProfession(false)
                    }

                    if (userData.institution && !ORGANIZATIONS.includes(userData.institution)) {
                      setOtherInstitution(userData.institution)
                      setShowOtherInstitution(true)
                    } else {
                      setOtherInstitution('')
                      setShowOtherInstitution(false)
                    }
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

export default ClinicianAccountSettingForm
