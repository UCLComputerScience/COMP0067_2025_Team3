'use client'

import React, { useState, useEffect } from 'react'

import { useRouter } from 'next/navigation'

import {
  Box,
  Typography,
  Button,
  Switch,
  FormControlLabel,
  CircularProgress,
  Card,
  CardContent,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material'

import { ClinicianSearch } from './ClinicianSearch'
import { SavedClinicians } from './SavedClinicians'
import type { AccountDetailsForm } from './RegisterUser'

import type { Clinician, RegisterResult } from '@/actions/register/registerActions'
import { registerUser, completeRegistration } from '@/actions/register/registerActions'

interface RegisterPatientProps {
  onBack: () => void
  accountType: string
  userId: string | null
  formData: AccountDetailsForm
}

export const PatientRegister: React.FC<RegisterPatientProps> = ({ onBack, accountType, userId, formData }) => {
  const router = useRouter()

  const [consentToClinicians, setConsentToClinicians] = useState(false)
  const [consentToResearchers, setConsentToResearchers] = useState(true)
  const [savedClinicians, setSavedClinicians] = useState<Clinician[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [openSuccessDialog, setOpenSuccessDialog] = useState(false)
  const [openErrorDialog, setOpenErrorDialog] = useState(false)

  useEffect(() => {}, [userId, formData])

  // Add clinician to saved list
  const handleSaveClinician = (clinician: Clinician) => {
    if (!savedClinicians.some(saved => saved.id === clinician.id)) {
      setSavedClinicians(prev => [...prev, clinician])
    }
  }

  // Remove clinician from saved list
  const handleRemoveClinician = (clinicianId: string) => {
    setSavedClinicians(prev => prev.filter(clinician => clinician.id !== clinicianId))
  }

  // Handle form submission
  const handleSubmit = async () => {
    try {
      setIsLoading(true)
      setError(null)
      let finalUserId = userId

      if (!userId) {
        console.log('Form Data being sent to registerUser:', formData)
        const fullPhoneNumber = formData.phoneNumber || ''

        const registerResult: RegisterResult = await registerUser({
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          password: formData.password,
          dateOfBirth: formData.dateOfBirth || '',
          address: formData.address,
          phoneNumber: fullPhoneNumber,
          registrationNumber: '',
          profession: '',
          institution: '',
          accountType
        })

        console.log('Register Result:', registerResult)

        if (!registerResult.success) {
          throw new Error(registerResult.error || 'Failed to register user')
        }

        if (!registerResult.userId) {
          throw new Error('User ID is missing after successful registration')
        }

        finalUserId = registerResult.userId
      }

      // Complete registration with privacy settings
      const completionResult = await completeRegistration(
        finalUserId!,
        {
          researchConsent: consentToResearchers,
          clinicianAccess: consentToClinicians,
          selectedClinicians: savedClinicians
        },
        accountType
      )

      if (!completionResult.success) {
        throw new Error(completionResult.error || 'Failed to complete registration')
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

  // Handle navigation to login after success
  const handleGoToLogin = () => {
    setOpenSuccessDialog(false)
    router.push('/login')
  }

  return (
    <Box sx={{ maxWidth: '600px', marginX: 'auto' }}>
      {/* Error and Success dialog */}
      <Dialog open={openErrorDialog} onClose={() => setOpenErrorDialog(false)} aria-labelledby='error-dialog-title'>
        <DialogTitle id='error-dialog-title'>Error</DialogTitle>
        <DialogContent>
          <Typography variant='body1'>{error}</Typography>
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
          <Typography variant='body1'>{success}</Typography>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleGoToLogin}
            variant='contained'
            sx={{ bgcolor: 'primary', color: 'white', '&:hover': { bgcolor: '#5835b5' }, borderRadius: '8px' }}
          >
            Go to Login
          </Button>
        </DialogActions>
      </Dialog>

      {/* Data Privacy Section */}
      <Card sx={{ mb: 4 }}>
        <CardContent sx={{ p: 4 }}>
          <Typography variant='h4' fontWeight='bold' sx={{ marginBottom: 2 }}>
            Data Privacy
          </Typography>
          <Box sx={{ mb: 4 }}>
            <FormControlLabel
              control={
                <Switch
                  checked={consentToResearchers}
                  onChange={e => setConsentToResearchers(e.target.checked)}
                  disabled={isLoading}
                />
              }
              label={
                <Typography variant='body2'>
                  I consent to being contacted about researchers accessing my data for medical research
                </Typography>
              }
              sx={{ display: 'flex', mb: 2 }}
            />
            <FormControlLabel
              control={
                <Switch
                  checked={consentToClinicians}
                  onChange={e => setConsentToClinicians(e.target.checked)}
                  disabled={isLoading}
                />
              }
              label={
                <Typography variant='body2'>
                  {' '}
                  I consent to the clinicians I approve being able to access my data
                </Typography>
              }
              sx={{ display: 'flex', mb: 2 }}
            />
          </Box>

          {/* Clinician search section (conditionally rendered) */}
          {consentToClinicians && (
            <>
              {savedClinicians.length > 0 && (
                <Box sx={{ mb: 4 }}>
                  <Typography variant='h6' sx={{ mb: 2 }}>
                    Your Selected Clinicians
                  </Typography>
                  <SavedClinicians clinicians={savedClinicians} onRemoveClinician={handleRemoveClinician} />
                </Box>
              )}

              <ClinicianSearch onSaveClinician={handleSaveClinician} savedClinicians={savedClinicians} />
            </>
          )}

          {/* Navigation Buttons */}
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
