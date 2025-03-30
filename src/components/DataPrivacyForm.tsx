'use client'

import { useEffect, useState } from 'react'

import { useSession } from 'next-auth/react'
import { Card, FormGroup, FormControlLabel, Switch, Button, CardContent, CardHeader, CardActions } from '@mui/material'
import { toast } from 'react-toastify'

import { getPatientAgreedToResearch, updatePatientAgreedToResearch } from '@/actions/patient/consentActions'

const DataPrivacyForm = () => {
  const { data: session } = useSession()
  const [loading, setLoading] = useState(false)
  const [agreedForResearch, setAgreedForResearch] = useState<boolean | null>(null)
  const [originalConsent, setOriginalConsent] = useState<boolean | null>(null)

  useEffect(() => {
    const fetchConsent = async () => {
      if (session?.user?.id) {
        try {
          const consent = await getPatientAgreedToResearch(session.user.id)

          setAgreedForResearch(consent)
          setOriginalConsent(consent)
        } catch (error) {
          console.error('Error fetching research consent:', error)
          toast.error('Could not load your current consent settings')
        }
      }
    }

    fetchConsent()
  }, [session?.user?.id]) // Only re-run when user ID changes

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      setLoading(true)

      if (!session?.user?.id) {
        toast.error('You must be logged in to update your data privacy settings')
        
return
      }

      if (agreedForResearch === originalConsent) {
        setLoading(false)
        
return
      }

      const result = await updatePatientAgreedToResearch(session.user.id, !!agreedForResearch)

      if (result.success) {
        toast.success(result.message || 'Research consent updated successfully!')
        setOriginalConsent(agreedForResearch)

        window.location.reload()
      } else {
        toast.error(result.message || 'Failed to update research consent')
        setAgreedForResearch(originalConsent)
      }
    } catch (error) {
      console.error('Error updating research consent:', error)
      toast.error('An error occurred while updating your research consent. Please try again later.')
      setAgreedForResearch(originalConsent)
    } finally {
      setLoading(false)
    }
  }

  if (agreedForResearch === null) {
    return (
      <Card className='w-full'>
        <CardHeader title='Data Privacy' subheader='Loading your current settings...' />
        <CardContent>Loading...</CardContent>
      </Card>
    )
  }

  return (
    <Card className='w-full'>
      <form onSubmit={handleSubmit}>
        <CardHeader
          title='Data Privacy'
          subheader='Enable this option to see a list of studies and their details, and determine if you want your data to be used in their studies.'
        />
        <CardContent>
          <FormGroup>
            <FormControlLabel
              control={
                <Switch
                  checked={!!agreedForResearch}
                  color='success'
                  onChange={e => setAgreedForResearch(e.target.checked)}
                  disabled={loading}
                />
              }
              label='I consent to being contacted about researchers accessing my data for medical research.'
            />
          </FormGroup>
        </CardContent>
        <CardActions>
          <Button
            type='submit'
            variant='contained'
            color='primary'
            disabled={loading || agreedForResearch === originalConsent}
          >
            Save Changes
          </Button>
        </CardActions>
      </form>
    </Card>
  )
}

export default DataPrivacyForm
