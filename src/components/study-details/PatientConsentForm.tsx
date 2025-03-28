'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { Card, CardContent, CardHeader, CardActions, FormControlLabel, Switch, Button, Typography } from '@mui/material'
import { toast } from 'react-toastify'
import DialogsAlert from '../DialogsAlert'

import { updatePatientStudyConsent, getPatientConsentStatus } from '@/actions/patient/consentActions'

interface PatientConsentFormProps {
  studyId: number
}

const PatientConsentForm = ({ studyId }: PatientConsentFormProps) => {
  const { data: session } = useSession()
  const [loading, setLoading] = useState(false)
  const [initializing, setInitializing] = useState(true)
  const [hasConsented, setHasConsented] = useState(false)
  const [originalConsent, setOriginalConsent] = useState(false)
  const [isDirty, setIsDirty] = useState(false)

  useEffect(() => {
    const fetchConsentStatus = async () => {
      if (!session?.user?.id) return

      try {
        setInitializing(true)
        const status = await getPatientConsentStatus(session.user.id, studyId)
        setHasConsented(status.hasConsented)
        setOriginalConsent(status.hasConsented)
      } catch (error) {
        console.error('Error fetching consent status:', error)
        toast.error('Could not retrieve your current consent status')
      } finally {
        setInitializing(false)
      }
    }

    fetchConsentStatus()
  }, [session, studyId])

  const handleToggleConsent = () => {
    setHasConsented(!hasConsented)
    setIsDirty(true)
  }

  const handleReset = () => {
    setHasConsented(originalConsent)
    setIsDirty(false)
  }

  const handleSave = async () => {
    if (!session?.user?.id) {
      toast.error('You must be logged in to update consent')
      return
    }

    setLoading(true)
    try {
      const result = await updatePatientStudyConsent(session.user.id, studyId, hasConsented)

      if (result.success) {
        setOriginalConsent(hasConsented)

        toast.success(
          hasConsented
            ? 'You have successfully consented to participate in this study'
            : 'You have withdrawn your consent from this study'
        )
        setIsDirty(false)
      } else {
        throw new Error('Failed to update consent')
      }
    } catch (error) {
      console.error('Error updating consent:', error)
      toast.error('An error occurred while updating your consent')

      setHasConsented(originalConsent)
    } finally {
      setLoading(false)
    }
  }

  if (!session) {
    return (
      <Card>
        <CardHeader title='Research Participation' />
        <CardContent>
          <Typography>You need to be logged in to manage your research participation.</Typography>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader
        title='Research Participation'
        subheader='Use the switch below to allow researchers to use your data in this study'
      />
      <CardContent>
        {initializing ? (
          <Typography>Loading your consent status...</Typography>
        ) : (
          <>
            <FormControlLabel
              control={<Switch checked={hasConsented} onChange={handleToggleConsent} disabled={loading} />}
              label={hasConsented ? 'I consent to participate' : 'I do not consent to participate'}
            />
            {isDirty && (
              <Typography variant='caption' color='text.secondary' sx={{ display: 'block', mt: 1 }}>
                You have unsaved changes
              </Typography>
            )}
          </>
        )}
      </CardContent>
      <CardActions>
        <Button variant='contained' onClick={handleSave} disabled={loading || !isDirty || initializing}>
          {loading ? 'Saving...' : 'Save'}
        </Button>
        <DialogsAlert
          triggerButtonLabel='Reset'
          dialogTitle='Confirm Reset'
          dialogText='Are you sure you want to reset your consent choice?'
          confirmButtonLabel='Yes, Reset'
          cancelButtonLabel='Cancel'
          onConfirm={handleReset}
        />
      </CardActions>
    </Card>
  )
}

export default PatientConsentForm
