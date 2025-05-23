// select clinician - theme colors not working
// --> send email

// *Could have* personalised invitation message + personalised link
// *Could have* dont display already linked clinicians

'use client'

import { useState, useEffect, useRef } from 'react'

import { useRouter } from 'next/navigation'

import { toast } from 'react-toastify'

import {
  Box,
  Button,
  Card,
  CardContent,
  Typography,
  TextField,
  List,
  ListItem,
  ListItemText,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton
} from '@mui/material'
import Grid from '@mui/material/Grid2'

import { saveNewClinician } from '@/actions/patientSettings/userActions'
import type { AllClinicians, PatientId } from '@/app/(private)/my-profile/add-clinician/page'

import { sendInviteEmail } from '@/actions/email/sendInvite';

interface Props {
  id: PatientId
  cliniciansList: AllClinicians[]
}

const ClinicianLinkPage = ({ id, cliniciansList }: Props) => {
  const router = useRouter()
  const [selectedClinician, setSelectedClinician] = useState<AllClinicians | null>(null)
  const [filteredClinicians, setFilteredClinicians] = useState(cliniciansList)
  const [hasSearched, setHasSearched] = useState(false)

  const clinicianListRef = useRef<HTMLDivElement>(null) // Ref to detect clicks outside the clinician list
  const saveButtonRef = useRef<HTMLButtonElement | null>(null)
  const [openModal, setOpenModal] = useState(false)
  const [clinicianError, setClinicianError] = useState<string | null>(null)

 
  useEffect(() => {
    if (clinicianError) {
      toast.error(clinicianError)
    }
  }, [clinicianError])

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchCriteria({ ...searchCriteria, [e.target.name]: e.target.value })
  }

  const handleInviteChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInvite({ ...invite, [e.target.name]: e.target.value })
  }

  const handleSearch = () => {
    setHasSearched(true)

    // Trigger the search/filter logic manually
    setFilteredClinicians(
      cliniciansList.filter(clinician => {
        return (
          clinician.firstName.toLowerCase().includes(searchCriteria.firstName.toLowerCase()) &&
          clinician.lastName.toLowerCase().includes(searchCriteria.lastName.toLowerCase()) &&
          clinician.institution?.toLowerCase().includes(searchCriteria.organization.toLowerCase()) &&
          clinician.email.toLowerCase().includes(searchCriteria.email.toLowerCase())
        )
      })
    )
  }

  const handleReset = () => {
    setSearchCriteria({
      firstName: '',
      lastName: '',
      organization: '',
      email: ''
    })
    setFilteredClinicians(cliniciansList) // Reset the filtered list to the original list
    setHasSearched(false) // Reset search state
  }

  const handleClinicianSelect = (clinician: AllClinicians) => {
    setSelectedClinician(clinician)
    console.log('Selected clinicians id:', clinician.id)
  }

  // Handle unselecting clinician when clicking outside of the list
  const handleClickOutside = (event: MouseEvent) => {
    if (clinicianListRef.current && !clinicianListRef.current.contains(event.target as Node)) {
      // Prevent unselecting if the "Save" button is clicked
      if (event.target !== saveButtonRef.current) {
        setSelectedClinician(null)
      }
    }
  }

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside)

    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleClinicianSave = async () => {
    if (selectedClinician) {
      try {
        const save = await saveNewClinician(selectedClinician.id, id.id)

        if (save.success) {
          toast.success('Clinician added successfully')
          router.push('/my-profile/')
        } else {
          // console.error("Error changing password.");
          setClinicianError(save.message)
        }

        // console.log("Selected Clinician:", selectedClinician);
      } catch (error) {
        // console.error('Failed to save changes:', error);
        toast.error('Error saving changes.')
      }
    } else {
      console.log('No clinician selected')
    }
  }

  // New state for search
  const [searchCriteria, setSearchCriteria] = useState({
    firstName: '',
    lastName: '',
    organization: '',
    email: ''
  })

  // New state for invitation
  const [invite, setInvite] = useState({
    firstName: '',
    lastName: '',
    email: ''
  })


  // Open the modal
  const handleOpenModal = () => {
    setOpenModal(true)
  }

  // Close the modal
  const handleCloseModal = () => {
    setOpenModal(false)
    setSelectedClinician(null)
  }

  const handleSendInvitation = async () => {
    if (invite.email) {
      try {
        // Determine the name value based on invite.firstName
        const name = invite.firstName 
          ? `${invite.firstName} ${invite.lastName || ''}`.trim() 
          : 'Clinician';

        const invitation = await sendInviteEmail(name, invite.email, id.id)

        if (!invitation.success) {
          throw new Error('Failed to send the invitation')
        }

        toast.success('Invitation sent successfully')
        handleCloseModal()
      } catch (error) {
        console.error('Failed to send invitation:', error)
        toast.error('Failed to send the invitation.')
      }
    } else {
      console.log("Please enter you clinician's email before sending the message.")
      toast.error("Please enter you clinician's email before sending the message.")
    }
  }

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
      <Card sx={{ width: 2000, p: 3 }}>
        <IconButton color='secondary' onClick={() => router.push('/my-profile')}>
          <i className='ri-arrow-drop-left-line' />
        </IconButton>

        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
          <Typography variant='h5' gutterBottom>
            Link a Clinician
          </Typography>
          <Typography color='secondary' variant='body2'>
            Link your clinicians to share your data with them
          </Typography>
        </Box>

        {/* Search Grid */}
        <CardContent>
          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid size={{ xs: 6 }}>
              <TextField
                label='First Name'
                name='firstName'
                fullWidth
                value={searchCriteria.firstName}
                onChange={handleSearchChange}
              />
            </Grid>
            <Grid size={{ xs: 6 }}>
              <TextField
                label='Last Name'
                name='lastName'
                fullWidth
                value={searchCriteria.lastName}
                onChange={handleSearchChange}
              />
            </Grid>
            <Grid size={{ xs: 6 }}>
              <FormControl fullWidth>
                <InputLabel>Organization</InputLabel>
                <Select
                  name='organization'
                  label='Organization'
                  value={searchCriteria.organization}
                  onChange={e => setSearchCriteria({ ...searchCriteria, organization: e.target.value })}
                >
                  <MenuItem value=''>Select Organization</MenuItem>
                  {Array.from(new Set(cliniciansList.map(c => c.institution).filter(Boolean))).map((org, index) => (
                    <MenuItem key={index} value={String(org)}>
                      {org}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid size={{ xs: 6 }}>
              <TextField
                label='Email'
                name='email'
                fullWidth
                value={searchCriteria.email}
                onChange={handleSearchChange}
              />
            </Grid>

            {/* Search Button */}
            <Grid size={{ xs: 6 }}>
              <Box sx={{ display: 'flex', justifyContent: 'flex-start', gap: 2, mt: 3 }}>
                <Button variant='contained' onClick={handleSearch} startIcon={<i className='ri-search-line' />}>
                  Search
                </Button>
                <Button variant='outlined' color='secondary' onClick={handleReset}>
                  Reset
                </Button>
              </Box>
            </Grid>
          </Grid>

          {/* Clinician List */}
          {hasSearched && (
            <>
              <Typography variant='h6' sx={{ mt: 3 }}>
                {filteredClinicians.length} Results
              </Typography>
              <List
                sx={{ maxHeight: 300, overflowY: 'auto', border: '1px solid #ccc', borderRadius: 1, p: 1 }}
                ref={clinicianListRef}
                component='div'
              >
                {filteredClinicians.map(clinician => (
                  <ListItem
                    key={clinician.id}
                    onClick={() => handleClinicianSelect(clinician)}
                    sx={{
                      cursor: 'pointer',
                      backgroundColor: selectedClinician?.id === clinician.id ? '#A379FF' : 'transparent',
                      borderRadius: 1,
                      '&:hover': { backgroundColor: '#A379FF' }
                    }}
                  >
                    <i className='ri-hospital-line' style={{ color: 'orange' }}></i>
                    <ListItemText
                      primary={`${clinician.firstName} ${clinician.lastName}`}
                      secondary={`${clinician.institution} - ${clinician.email}`}
                    />
                  </ListItem>
                ))}
              </List>

              {/* Invite */}
              <Grid size={{ xs: 6 }}>
                <Typography sx={{ flexGrow: 1, textAlign: 'center' }}>
                  Cannot find your clinician?{' '}
                  <Button
                    variant='text'
                    color='primary'
                    sx={{ textTransform: 'none', fontWeight: 600, p: 0, minWidth: 'auto' }}
                    onClick={handleOpenModal}
                  >
                    Invite them to create an account
                  </Button>
                  <Dialog open={openModal} onClose={handleCloseModal} maxWidth='md' fullWidth>
                    <DialogTitle>
                      Invite Clinician
                      <IconButton
                        color='secondary'
                        onClick={handleCloseModal}
                        sx={{ position: 'absolute', right: 8, top: 8 }}
                      >
                        <i className='ri-close-line' />
                      </IconButton>
                      <Typography color='secondary' variant='body2' sx={{ alignItems: 'center' }}>
                        Invite your clinician to the platform to share your data with them.
                      </Typography>
                    </DialogTitle>
                    <DialogContent>
                      {/* Text Fields */}
                      <Box display='grid' gridTemplateColumns='repeat(2, 1fr)' gap={2} sx={{ mt: 3 }}>
                        <TextField
                          label='First Name'
                          name='firstName'
                          fullWidth
                          value={invite.firstName}
                          onChange={handleInviteChange}
                        />
                        <TextField
                          label='Last Name'
                          name='lastName'
                          fullWidth
                          value={invite.lastName}
                          onChange={handleInviteChange}
                        />
                      </Box>
                      <Box display='grid' gridTemplateColumns='repeat(1, 1fr)' gap={2} sx={{ mt: 3 }}>
                        <TextField
                          label='Email'
                          name='email'
                          fullWidth
                          value={invite.email}
                          onChange={handleInviteChange}
                        />
                      </Box>
                    </DialogContent>
                    <DialogActions sx={{ justifyContent: 'flex-start', px: 3, pb: 3, mt: 3 }}>
                      {/* Save and Cancel Buttons */}
                      <Button variant='contained' color='primary' onClick={handleSendInvitation}>
                        Send Invitation
                      </Button>
                      <Button variant='outlined' color='secondary' onClick={handleCloseModal}>
                        Cancel
                      </Button>
                    </DialogActions>
                  </Dialog>
                </Typography>
              </Grid>
              {/* Save and Cancel Buttons */}
              <Box sx={{ display: 'flex', justifyContent: 'flex-start', gap: 2, mt: 3 }}>
                <Button variant='contained' color='primary' onClick={handleClinicianSave} ref={saveButtonRef}>
                  Save
                </Button>
              </Box>
            </>
          )}
        </CardContent>
      </Card>
    </Box>
  )
}

export default ClinicianLinkPage
