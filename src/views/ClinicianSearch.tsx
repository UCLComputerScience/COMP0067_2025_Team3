
'use client'

import React, { useState, useRef, useEffect } from 'react'


import { 
  Box, 
  Typography, 
  TextField, 
  Button, 
  Link,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton
} from '@mui/material'

import { alpha } from '@mui/material/styles'

import { toast } from 'react-toastify'
 
import { searchClinicians } from '@/actions/register/registerActions'

import { sendInviteEmailDuringRegistration } from '@/actions/email/sendInvite';

export interface Clinician {
  id: string
  firstName: string
  lastName: string
  institution: string
  email: string
}

interface ClinicianSearchProps {
  onSaveClinician: (clinician: Clinician) => void
  savedClinicians: Clinician[]
}

export const ClinicianSearch = ({ onSaveClinician, savedClinicians }: ClinicianSearchProps) => {
  const [searchFirstName, setSearchFirstName] = useState('')
  const [searchLastName, setSearchLastName] = useState('')
  const [searchInstitution, setSearchInstitution] = useState('')
  const [searchEmail, setSearchEmail] = useState('')
  const [clinicianList, setClinicianList] = useState<Clinician[]>([])
  const [selectedClinician, setSelectedClinician] = useState<Clinician | null>(null)
  const [visibleCount, setVisibleCount] = useState(10)
  const observerRef = useRef(null)
  
  const [inviteModalOpen, setInviteModalOpen] = useState(false)
  const [inviteEmail, setInviteEmail] = useState('')

  const [inviteMessage, setInviteMessage] = useState(
    'Dear clinician,\n\nYour patient would like to share their symptom data with you on our platform.\nRegister your account to view their spider-grams track their data.\n\nKind regards,\nThe Spider team'
  )

  const loadMoreClinicians = () => {
    setVisibleCount(prev => prev + 10)
  }

  useEffect(() => {
    if (!observerRef.current) return

    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting) {
          loadMoreClinicians()
        }
      },
      { threshold: 1.0 }
    )

    observer.observe(observerRef.current)

    return () => observer.disconnect()
  }, [])

  const handleOpenInviteModal = () => {
    setInviteModalOpen(true)
  }

  const handleCloseInviteModal = () => {
    setInviteModalOpen(false)
  }

  const handleSendInvitation = async () => {
    if (!inviteEmail) {
      toast?.error("Please enter the clinician's email");
      
return;
    }
  
    try {
      const name = searchFirstName 
        ? `${searchFirstName} ${searchLastName || ''}`.trim() 
        : 'Clinician';
      
      const invitation = await sendInviteEmailDuringRegistration(name, inviteEmail);
  
      if (invitation.success) {
        toast?.success('Invitation sent successfully');
        handleCloseInviteModal();
        setInviteEmail('');
      } else {
        throw new Error(invitation.error || 'Failed to send the invitation');
      }
    } catch (error) {
      console.error('Failed to send invitation:', error);
      toast?.error((error as any).message || 'Failed to send the invitation');
    }
  }

  // Search for clinicians
  const handleSearchClinician = async () => {
  

    // Clear previous search results
    setClinicianList([])

    // Build search parameters, only include fields with values
    const searchParams: Record<string, string> = {}

    if (searchFirstName.trim()) searchParams.firstName = searchFirstName.trim()
    if (searchLastName.trim()) searchParams.lastName = searchLastName.trim()
    if (searchInstitution.trim()) searchParams.institution = searchInstitution.trim()
    if (searchEmail.trim()) searchParams.email = searchEmail.trim()

    console.log('Search params:', searchParams)

    // Check if at least one search parameter exists
    if (Object.keys(searchParams).length === 0) {
      console.log('Please enter at least one search parameter')
      
return
    }

    const response = await searchClinicians(searchParams)

    if (response && response.success) {
      setClinicianList(response.clinicians as Clinician[])
    } else {
      console.error('Clinician search failed:', response.error)
      setClinicianList([])
    }
  }

  // Select a clinician
  const handleSelectClinician = (clinician: Clinician) => {
    setSelectedClinician(clinician)
  }

  // Check if clinician is already saved
  const isClinicianAlreadySaved = (clinician: Clinician) => {
    return savedClinicians.some(
      saved =>
        saved.id === clinician.id ||
        (saved.firstName === clinician.firstName &&
          saved.lastName === clinician.lastName &&
          saved.email === clinician.email)
    )
  }

  // Save the selected clinician
  const handleSaveClinician = () => {
    if (!selectedClinician) {
      return
    }

    // Check if clinician is already saved
    if (isClinicianAlreadySaved(selectedClinician)) {
      return
    }

    // Add to saved clinicians list via callback
    onSaveClinician(selectedClinician)

    // Clear search area
    setSearchFirstName('')
    setSearchLastName('')
    setSearchInstitution('')
    setSearchEmail('')
    setClinicianList([])
    setSelectedClinician(null)
  }

  // Individual search results item
  const ResultItem = ({ clinician, index, isLast }: { clinician: Clinician; index: number; isLast: boolean }) => {
    const alreadySaved = isClinicianAlreadySaved(clinician)

    return (
      <Box
        key={index}
        sx={theme => ({
          padding: 1.5,
          cursor: alreadySaved ? 'default' : 'pointer',
          borderBottom: isLast ? 'none' : `1px solid ${theme.palette.divider}`,
          backgroundColor:
            selectedClinician?.id === clinician.id ? alpha(theme.palette.primary.main, 0.2) : 'transparent',
          '&:hover': { backgroundColor: alreadySaved ? 'transparent' : alpha(theme.palette.primary.main, 0.1) },
          display: 'flex',
          alignItems: 'center',
          borderRadius: '4px'
        })}
        onClick={() => !alreadySaved && handleSelectClinician(clinician)}
      >
        <i className='ri-hospital-line' style={{ color: 'orange', fontSize: '24px', marginRight: 8 }}></i>
        <Box sx={{ flexGrow: 1 }}>
          <Typography sx={theme => ({ fontWeight: 'bold', fontSize: '14px', color: theme.palette.text.primary })}>
            {clinician.firstName} {clinician.lastName}
          </Typography>
          <Typography variant='body2' sx={theme => ({ color: theme.palette.text.secondary, fontSize: '12px' })}>
            {clinician.institution || 'No Institution'}
          </Typography>
          <Typography variant='body2' sx={theme => ({ color: theme.palette.text.secondary, fontSize: '12px' })}>
            {clinician.email}
          </Typography>
        </Box>
        {alreadySaved && (
          <Typography
            variant='body2'
            sx={theme => ({ color: theme.palette.text.disabled, fontSize: '12px', fontStyle: 'italic' })}
          >
            Already saved
          </Typography>
        )}
      </Box>
    )
  }

  const shouldShowInvitePrompt = clinicianList.length === 0;

  return (
    <>
      <Typography variant='h6' sx={theme => ({ marginTop: 3, marginBottom: 2, color: theme.palette.text.primary })}>
        Search Clinician
      </Typography>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <TextField
          placeholder='First Name'
          fullWidth
          variant='outlined'
          value={searchFirstName}
          onChange={e => setSearchFirstName(e.target.value)}
          sx={theme => ({
            '& .MuiOutlinedInput-root': {
              bgcolor: alpha(theme.palette.background.paper, 0.05),
              borderRadius: '4px',
              '& fieldset': { borderColor: theme.palette.divider },
              '&:hover fieldset': { borderColor: theme.palette.divider },
              '&.Mui-focused fieldset': { borderColor: theme.palette.primary.main }
            },
            '& .MuiInputLabel-root': { color: theme.palette.text.secondary }
          })}
        />
        <TextField
          placeholder='Last Name'
          fullWidth
          variant='outlined'
          value={searchLastName}
          onChange={e => setSearchLastName(e.target.value)}
          sx={theme => ({
            '& .MuiOutlinedInput-root': {
              bgcolor: alpha(theme.palette.background.paper, 0.05),
              borderRadius: '4px',
              '& fieldset': { borderColor: theme.palette.divider },
              '&:hover fieldset': { borderColor: theme.palette.divider },
              '&.Mui-focused fieldset': { borderColor: theme.palette.primary.main }
            },
            '& .MuiInputLabel-root': { color: theme.palette.text.secondary }
          })}
        />
        <TextField
          placeholder='Organization'
          fullWidth
          variant='outlined'
          value={searchInstitution}
          onChange={e => setSearchInstitution(e.target.value)}
          sx={theme => ({
            '& .MuiOutlinedInput-root': {
              bgcolor: alpha(theme.palette.background.paper, 0.05),
              borderRadius: '4px',
              '& fieldset': { borderColor: theme.palette.divider },
              '&:hover fieldset': { borderColor: theme.palette.divider },
              '&.Mui-focused fieldset': { borderColor: theme.palette.primary.main }
            },
            '& .MuiInputLabel-root': { color: theme.palette.text.secondary }
          })}
        />
        <TextField
          placeholder='Email'
          fullWidth
          variant='outlined'
          value={searchEmail}
          onChange={e => setSearchEmail(e.target.value)}
          sx={theme => ({
            '& .MuiOutlinedInput-root': {
              bgcolor: alpha(theme.palette.background.paper, 0.05),
              borderRadius: '4px',
              '& fieldset': { borderColor: theme.palette.divider },
              '&:hover fieldset': { borderColor: theme.palette.divider },
              '&.Mui-focused fieldset': { borderColor: theme.palette.primary.main }
            },
            '& .MuiInputLabel-root': { color: theme.palette.text.secondary }
          })}
        />
      </Box>
      <Box sx={{ display: 'flex', justifyContent: 'flex-start', marginTop: 2 }}>
        <Button
          variant='contained'
          color='primary'
          onClick={handleSearchClinician}
          sx={{ borderRadius: '4px', padding: '8px 16px', textTransform: 'none' }}
        >
          Search
        </Button>
      </Box>

      {shouldShowInvitePrompt && (
        <Box sx={theme => ({ textAlign: 'center', marginTop: 2, color: theme.palette.text.secondary })}>
          <Typography variant='body2'>
            Cannot find your clinician?{' '}
            <Link 
              sx={theme => ({ 
                color: theme.palette.primary.light,
                cursor: 'pointer' 
              })}
              onClick={handleOpenInviteModal}
            >
              Invite them to create an account
            </Link>
          </Typography>
        </Box>
      )}

      {clinicianList.length > 0 && (
        <Box sx={theme => ({ marginTop: 2, color: theme.palette.text.secondary })}>
          <Typography variant='body2'>{clinicianList.length} Results</Typography>
        </Box>
      )}

      {clinicianList.length > 0 && (
        <Box
          sx={theme => ({
            marginTop: 2,
            maxHeight: '400px',
            overflowY: 'auto',
            '&::-webkit-scrollbar': { width: '8px' },
            '&::-webkit-scrollbar-track': { background: alpha(theme.palette.background.paper, 0.05) },
            '&::-webkit-scrollbar-thumb': {
              background: alpha(theme.palette.background.paper, 0.2),
              borderRadius: '4px'
            },
            '&::-webkit-scrollbar-thumb:hover': { background: alpha(theme.palette.background.paper, 0.3) }
          })}
        >
          {clinicianList.slice(0, visibleCount).map((clinician, index) => (
            <ResultItem
              key={clinician.id}
              clinician={clinician}
              index={index}
              isLast={index === clinicianList.length - 1}
            />
          ))}
          <div ref={observerRef}></div>
        </Box>
      )}

      {clinicianList.length > 0 && (
        <Box sx={{ display: 'flex', justifyContent: 'flex-start', margin: '20px 0' }}>
          <Button
            variant='contained'
            color='primary'
            onClick={handleSaveClinician}
            disabled={!selectedClinician || isClinicianAlreadySaved(selectedClinician)}
            sx={theme => ({
              borderRadius: '4px',
              padding: '8px 16px',
              textTransform: 'none',
              '&.Mui-disabled': {
                backgroundColor: alpha(theme.palette.primary.main, 0.3),
                color: alpha(theme.palette.common.white, 0.5)
              }
            })}
          >
            Save
          </Button>
        </Box>
      )}

      <Dialog open={inviteModalOpen} onClose={handleCloseInviteModal} maxWidth="md" fullWidth>
        <DialogTitle>
          Invite Clinician
          <IconButton
            color="secondary"
            onClick={handleCloseInviteModal}
            sx={{ position: 'absolute', right: 8, top: 8 }}
          >
            <i className="ri-close-line" />
          </IconButton>
          <Typography color="secondary" variant="body2" sx={{ alignItems: 'center' }}>
            Invite your clinician to the platform to share your data with them.
          </Typography>
        </DialogTitle>
        
        <DialogContent>
          <Box display="grid" gridTemplateColumns="repeat(2, 1fr)" gap={2} sx={{ mt: 3 }}>
            <TextField
              label="First Name"
              fullWidth
              value={searchFirstName}
              onChange={(e) => setSearchFirstName(e.target.value)}
            />
            <TextField
              label="Last Name"
              fullWidth
              value={searchLastName}
              onChange={(e) => setSearchLastName(e.target.value)}
            />
          </Box>
          
          <Box display="grid" gridTemplateColumns="repeat(1, 1fr)" gap={2} sx={{ mt: 3 }}>
            <TextField
              label="Email"
              fullWidth
              required
              value={inviteEmail}
              onChange={(e) => setInviteEmail(e.target.value)}
            />
            <TextField
              label="Message"
              fullWidth
              multiline
              rows={6}
              value={inviteMessage}
              onChange={(e) => setInviteMessage(e.target.value)}
            />
          </Box>
        </DialogContent>
        
        <DialogActions sx={{ justifyContent: 'flex-start', px: 3, pb: 3, mt: 3 }}>
          <Button 
            variant="contained" 
            color="primary" 
            onClick={handleSendInvitation}
          >
            Send Invitation
          </Button>
          <Button 
            variant="outlined" 
            color="secondary" 
            onClick={handleCloseInviteModal}
          >
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}





