'use client'

import React, { useState, useEffect } from 'react'

import { useRouter } from 'next/navigation'

import {
  Box,
  Typography,
  Button,
  CircularProgress,
  Card,
  CardContent,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material'

import type { AccountDetailsForm } from './RegisterUser'
import type { RegisterResult , registerUser, completeRegistration } from '@/actions/register/registerActions'


// Define the props interface
interface RegisterClinicianProps {
  onBack: () => void
  accountType: string
  userId: string | null
  formData: AccountDetailsForm
}

export const ClinicianRegister: React.FC<RegisterClinicianProps> = ({ onBack, accountType, userId, formData }) => {
  const router = useRouter()

  // UI state
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [openSuccessDialog, setOpenSuccessDialog] = useState(false)
  const [openErrorDialog, setOpenErrorDialog] = useState(false)

  // Effect to clean up on unmount
  useEffect(() => {
    setSuccess(null)

    
return () => {
      setSuccess(null)
      setError(null)
    }
  }, [])

  // Handle form submission
  const handleSubmit = async () => {
    try {
      setIsLoading(true)
      setError(null)

      if (!userId) {
        const fullPhoneNumber = formData.phoneNumber || ''

        const registerResult: RegisterResult = await registerUser({
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
          accountType
        })

        if (!registerResult.success) {
          throw new Error(registerResult.error || 'Failed to register user')
        }

        if (!registerResult.userId) {
          throw new Error('User ID is missing after successful registration')
        }

        const newUserId: string = registerResult.userId

        const completionResult = await completeRegistration(
          newUserId,
          { researchConsent: false, clinicianAccess: false, selectedClinicians: [] },
          accountType
        )

        if (!completionResult.success) {
          throw new Error(completionResult.error || 'Failed to complete registration')
        }
      } else {
        const completionResult = await completeRegistration(
          userId,
          { researchConsent: false, clinicianAccess: false, selectedClinicians: [] },
          accountType
        )

        if (!completionResult.success) {
          throw new Error(completionResult.error || 'Failed to complete registration')
        }
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
    <Box sx={{ maxWidth: '600px', marginX: 'auto' }}>
      {/* Error dialog */}
      <Dialog open={openErrorDialog} onClose={() => setOpenErrorDialog(false)} aria-labelledby='error-dialog-title'>
        <DialogTitle id='error-dialog-title'>Error</DialogTitle>
        <DialogContent>
          {' '}
          <Typography variant='body1'>{error}</Typography>
        </DialogContent>
        <DialogActions>
          {' '}
          <Button
            onClick={onBack}
            variant='contained'
            sx={{ bgcolor: 'primary', color: 'white', '&:hover': { bgcolor: 'primary' }, borderRadius: '8px' }}
          >
            Back to Register
          </Button>
        </DialogActions>
      </Dialog>

      {/* Success dialog */}
      <Dialog
        open={openSuccessDialog}
        onClose={() => setOpenSuccessDialog(false)}
        aria-labelledby='success-dialog-title'
      >
        <DialogTitle id='success-dialog-title'>Success</DialogTitle>
        <DialogContent>
          {' '}
          <Typography variant='body1'>{success}</Typography>{' '}
        </DialogContent>
        <DialogActions>
          {' '}
          <Button
            onClick={handleGoToLogin}
            variant='contained'
            sx={{ bgcolor: 'primary', color: 'white', '&:hover': { bgcolor: 'primary' }, borderRadius: '8px' }}
          >
            {' '}
            Go to Login
          </Button>{' '}
        </DialogActions>
      </Dialog>

      {/* Clinician registration confirmation */}
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Typography variant='h4' fontWeight='bold' sx={{ marginBottom: 2 }}>
            {' '}
            Complete Registration{' '}
          </Typography>
          <Typography variant='body1' sx={{ mb: 4 }}>
            {' '}
            You have successfully provided all the necessary information to register as aclinician. Click submit to
            complete your registration.
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
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
            <Button
              variant='contained'
              onClick={handleSubmit}
              disabled={isLoading}
              sx={{
                borderRadius: '8px',
                backgroundColor: 'primary',
                '&:hover': { backgroundColor: '#5835b5' },
                '&.Mui-disabled': { backgroundColor: '#ded5f7', color: '#ffffff' }
              }}
            >
              {isLoading ? <CircularProgress size={24} color='inherit' /> : 'Submit ✓'}
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  )
}
