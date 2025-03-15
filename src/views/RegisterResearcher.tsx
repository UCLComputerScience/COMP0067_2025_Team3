'use client'

import { useForm } from 'react-hook-form'
import { useRouter } from 'next/navigation'
import { AccountDetailsForm } from './RegisterUser'
import React, { useState, useEffect } from 'react'
import { valibotResolver } from '@hookform/resolvers/valibot'
import { registerUser, completeRegistration } from '@/actions/register/registerActions'
import { createApplication } from '@/actions/researcher/applicationAction'
import DataAccessApplicationContent from '@/components/DataAccessApplicationContent'
import { object, minLength, string, pipe, nonEmpty, array, file, date, InferInput } from 'valibot'
import {
  Box,
  Typography,
  Button,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Card,
  CardContent,
  CircularProgress
} from '@mui/material'

interface RegisterResearcherProps {
  onBack: () => void
  accountType: string
  userId: string | null
  formData: AccountDetailsForm
}

// Form schema definition (from DataAccessApplicationForm)
export type FormValues = InferInput<typeof schema>

const schema = object({
  researchTitle: pipe(
    string(),
    nonEmpty('This field is required'),
    minLength(3, 'Research Title must be at least 3 characters long')
  ),
  researchQuestion: pipe(
    string(),
    nonEmpty('This field is required'),
    minLength(3, 'Research Question must be at least 3 characters long')
  ),
  institution: pipe(string(), nonEmpty('This field is required')),
  summary: pipe(
    string(),
    nonEmpty('This field is required'),
    minLength(8, 'Summary must be at least 8 characters long')
  ),
  documents: pipe(array(file()), nonEmpty('This field is required')),
  demographicDataAccess: pipe(array(string())),
  questionnaireAccess: pipe(array(string())),
  dateRange: object({
    expectedStartDate: pipe(date('This field is required')),
    expectedEndDate: pipe(date('This field is required'))
  })
})

export const ResearcherRegister: React.FC<RegisterResearcherProps> = ({ onBack, accountType, userId, formData }) => {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [openSuccessDialog, setOpenSuccessDialog] = useState(false)
  const [openErrorDialog, setOpenErrorDialog] = useState(false)

  // Effect to control success message visibility
  useEffect(() => {
    setSuccess(null)
    return () => {
      setSuccess(null)
    }
  }, [])

  // Form handling with validation
  const {
    control,
    reset,
    handleSubmit,
    formState: { errors }
  } = useForm<FormValues>({
    resolver: valibotResolver(schema),
    defaultValues: {
      researchTitle: '',
      researchQuestion: '',
      institution: '',
      summary: '',
      documents: [],
      demographicDataAccess: [],
      questionnaireAccess: [],
      dateRange: { expectedStartDate: undefined, expectedEndDate: undefined }
    }
  })

  // Handle form submission
  const onSubmit = async (data: FormValues) => {
    try {
      setIsLoading(true)
      setError(null)
      let newUserId: string
      if (userId) {
        newUserId = userId
        console.log('Using existing userId:', userId)
      } else {
        const fullPhoneNumber = formData.phoneNumber || ''
        const registerResult = await registerUser({
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          password: formData.password,
          dateOfBirth: formData.dateOfBirth || '',
          address: formData.address,
          phoneNumber: fullPhoneNumber,
          registrationNumber: formData.registrationNumber,
          profession: formData.profession,
          institution: formData.institution,
          accountType: 'researcher'
        })
        if (!registerResult.success) {
          throw new Error(registerResult.error || 'Failed to register user')
        }
        if (!registerResult.userId) {
          throw new Error('User ID is missing after successful registration')
        }
        newUserId = registerResult.userId
      }

      const completionResult = await completeRegistration(
        newUserId,
        { researchConsent: false, clinicianAccess: false, selectedClinicians: [] },
        accountType
      )

      if (!completionResult.success) {
        throw new Error(completionResult.error || 'Failed to complete registration')
      }

      const formDataApp = new FormData()
      const { dateRange, ...rest } = data
      if (dateRange.expectedStartDate) {
        formDataApp.append('expectedStartDate', dateRange.expectedStartDate.toISOString())
      }
      if (dateRange.expectedEndDate) {
        formDataApp.append('expectedEndDate', dateRange.expectedEndDate.toISOString())
      }

      Object.entries(rest).forEach(([key, value]) => {
        if (Array.isArray(value)) {
          if (key === 'documents') {
            for (const file of value) {
              formDataApp.append(key, file)
            }
          } else {
            value.forEach(item => formDataApp.append(key, item))
          }
        } else if (value && typeof value === 'object') {
          Object.entries(value).forEach(([subKey, subValue]) => {
            if (subValue !== undefined) {
              formDataApp.append(`${key}[${subKey}]`, subValue as string | Blob)
            }
          })
        } else if (value !== undefined) {
          formDataApp.append(key, value as string | Blob)
        }
      })

      const applicationSuccess = await createApplication(formDataApp, newUserId)
      if (!applicationSuccess) {
        throw new Error('Application creation failed')
      }
      setSuccess('Congratulations! Your account has been created successfully!')
      setOpenSuccessDialog(true)
    } catch (err) {
      console.error('Registration error:', err)
      setError(err instanceof Error ? err.message : 'An unexpected error occurred')
      setOpenErrorDialog(true)
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoToLogin = () => {
    setOpenSuccessDialog(false)
    router.push('/login')
  }

  return (
    <Box sx={{ maxWidth: '800px', marginX: 'auto' }}>
      {/* Error and success notifications */}
      <Dialog open={openErrorDialog} onClose={() => setOpenErrorDialog(false)} aria-labelledby='error-dialog-title'>
        <DialogTitle id='error-dialog-title'>Error</DialogTitle>
        <DialogContent>
          {' '}
          <Typography variant='body1'> {error}</Typography>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setOpenErrorDialog(false)}
            variant='contained'
            sx={{ bgcolor: 'primary', color: 'white', '&:hover': { bgcolor: '#5835b5' }, borderRadius: '8px' }}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={openSuccessDialog}
        onClose={() => setOpenSuccessDialog(false)}
        aria-labelledby='success-dialog-title'
      >
        <DialogTitle id='success-dialog-title'>Success</DialogTitle>
        <DialogContent>
          {' '}
          <Typography variant='body1'> {success} </Typography>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleGoToLogin}
            variant='contained'
            sx={{ bgcolor: 'primary', color: 'white', '&:hover': { bgcolor: '#5835b5' }, borderRadius: '8px' }}
          >
            {' '}
            Go to Login
          </Button>
        </DialogActions>
      </Dialog>

      {/* Application Form */}
      <Box sx={{ mb: 4 }}>
        <Typography variant='h4' fontWeight='bold' sx={{ marginBottom: 2 }}>
          {' '}
          Research Application
        </Typography>
        <Typography variant='body1' color='textSecondary' sx={{ marginBottom: 4 }}>
          {' '}
          Please provide details about your research project to complete your registration.
        </Typography>
      </Box>

      <Card>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            {/* Data Access Application Content from the existing component */}
            <DataAccessApplicationContent control={control} errors={errors} />

            {/* Navigation Buttons */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', marginTop: 4 }}>
              <Button
                variant='outlined'
                onClick={onBack}
                disabled={isLoading}
                sx={{
                  borderRadius: '8px',
                  borderColor: 'primary',
                  color: 'primary',
                  '&:hover': { borderColor: '#5835b5', backgroundColor: 'rgba(110, 65, 226, 0.04)' }
                }}
              >
                {' '}
                ← Previous
              </Button>
              <Box>
                <Button
                  onClick={() => reset()}
                  disabled={isLoading}
                  sx={{ mr: 2, borderRadius: '8px', borderColor: 'primary', color: 'primary' }}
                >
                  Reset
                </Button>
                <Button
                  type='submit'
                  variant='contained'
                  disabled={isLoading}
                  sx={{ bgcolor: 'primary', color: 'white', '&:hover': { bgcolor: '#5835b5' }, borderRadius: '8px' }}
                >
                  {isLoading ? <CircularProgress size={24} sx={{ color: 'white' }} /> : 'Submit ✓'}
                </Button>
              </Box>
            </Box>
          </form>
        </CardContent>
      </Card>
    </Box>
  )
}
