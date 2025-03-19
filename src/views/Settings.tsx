// move to components? (could only move password box maybe)

// hydration error

// *Could have* --> requirements changing to green as they are satisfied
// *Could have* --> invited clinicians saved in the database
// *Could have* --> phone number validation

'use client'

import React, { useState, useEffect } from 'react'

import { useRouter } from 'next/navigation'

import {
  Box,
  Button,
  Card,
  CardContent,
  TextField,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Switch,
  Chip,
  FormControlLabel,
  FormGroup
} from '@mui/material'
import Grid from '@mui/material/Grid2'

import InputAdornment from '@mui/material/InputAdornment'
import IconButton from '@mui/material/IconButton'

import Alert from '@mui/material/Alert'
import { safeParse } from 'valibot'

import {
  saveUserProfile,
  resetUserProfile,
  changeUserPassword,
  saveResearch,
  saveShareData,
  deleteClinician
} from '@/actions/patientSettings/userActions'

// import type { ClinicianData, UserData } from '@/app/(dashboard)/(private)/my-profile/patient-settings/page'
import type { ClinicianData, UserData } from '@/app/(private)/my-profile/patient-settings/page'

import { userProfileSchema, passwordSchema } from '@/actions/formValidation'

interface Props {
  initialData: UserData
  clinicians: ClinicianData[]
}

const UserProfile = ({ initialData, clinicians = [] }: Props) => {
  const router = useRouter()
  const [formData, setFormData] = useState<UserData | null>(initialData)

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })

  const [passwordError, setPasswordError] = useState<string | null>(null)
  const [passwordSuccess, setPasswordSuccess] = useState<string | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [agreedForResearch, setAgreedForResearch] = useState(!!formData?.agreedForResearch)
  const [cliniciansData, setCliniciansData] = useState(clinicians)

  useEffect(() => {
    setFormData(initialData)
  }, [initialData])

  if (!formData) {
    return <div>Loading...</div> // Render loading until user data is available
  }

  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    setAgreedForResearch(!!formData?.agreedForResearch)
  }, [formData])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log(e.target.name, e.target.value)
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [isCurrentPasswordShown, setIsCurrentPasswordShown] = useState(false)
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [isConfirmPasswordShown, setIsConfirmPasswordShown] = useState(false)
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [isNewPasswordShown, setIsNewPasswordShown] = useState(false)

  const handleClickShowCurrentPassword = () => {
    setIsCurrentPasswordShown(!isCurrentPasswordShown)
  }

  const handlePasswordFieldChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target

    setPasswordData(prevState => ({
      ...prevState,
      [name]: value
    }))
  }

  const handleSave = async () => {
    setErrorMessage(null)
    setSuccessMessage(null)
    const result = safeParse(userProfileSchema, formData)

    if (!result.success) {
      setErrorMessage(result.issues.map(issue => issue.message).join('\n'))

      return
    }

    try {
      const updatedFormData = {
        ...formData,
        dateOfBirth: formData.dateOfBirth ? new Date(formData.dateOfBirth) : null // Convert back to Date
      }

      const response = await saveUserProfile(updatedFormData)

      if (!response.success) {
        setErrorMessage('Failed to update profile')
      }

      setSuccessMessage('Profile changes saved successfully!')
    } catch (error) {
      console.error('Failed to update profile:', error)
      setErrorMessage('Error saving profile changes.')
    }
  }

  const handleReset = async () => {
    setErrorMessage(null)
    setSuccessMessage(null)
    const resetData = await resetUserProfile(formData.id)

    if (resetData) setFormData(resetData)
  }

  const handleChangePassword = async () => {
    const result = safeParse(passwordSchema, passwordData)

    if (!result.success) {
      setPasswordError(result.issues.map(issue => issue.message).join('\n'))

      return
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      // console.error("Error: Passwords do not match");
      setPasswordError('Passwords do not match.')

      return
    }

    setPasswordError(null)

    try {
      const response = await changeUserPassword(formData.id, passwordData)

      // console.log("Change password success:", response.success);

      if (response.success) {
        setPasswordSuccess('Password changed successfully!')
        setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' })
      } else {
        // console.error("Error changing password.");
        setPasswordError(response.message)
      }
    } catch (error) {
      // console.error("Unexpected error while changing password:", error);
      setPasswordError('An error occurred while changing the password.')
    }
  }

  const handlePasswordChangeReset = async () => {
    // Reset the password fields when the function is called
    setPasswordData({
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    })
    setPasswordError(null)
    setPasswordSuccess(null)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Connected':
        return 'success'
      case 'Pending':
        return 'warning'
      case 'Invited':
        return 'primary'
      default:
        return 'primary'
    }
  }

  const handleSaveResearch = async () => {
    try {
      const response = await saveResearch(
        { agreedForResearch }, // data to be saved
        { id: formData.id } // user ID
      )

      if (!response.success) {
        throw new Error('Failed to update research consent')
      }

      alert('Research consent saved successfully!')
    } catch (error) {
      console.error('Failed to update research consent:', error)
      alert('Error saving research consent.')
    }
  }

  const handleClinicianSwitch = async (clinicianId: string, newValue: boolean, patientId: string) => {
    setCliniciansData(prevClinicians =>
      prevClinicians.map(clinician =>
        clinician.id === clinicianId ? { ...clinician, agreedToShareData: newValue } : clinician
      )
    )

    try {
      formData.id === patientId
      const result = await saveShareData(clinicianId, newValue, patientId)

      if (!result.success) {
        throw new Error('Failed to save clinician data share consent')
      }
    } catch (error) {
      console.error('Error saving clinician data consent:', error)
      setCliniciansData(prevClinicians =>
        prevClinicians.map(clinician =>
          clinician.id === clinicianId
            ? { ...clinician, agreedToShareData: !newValue } // Revert state if API fails
            : clinician
        )
      )
    }
  }

  const handleDelete = async (clinicianId: string, patientId: string) => {
    const prevClinicians = [...cliniciansData]

    setCliniciansData(prevClinicians.filter(clinician => clinician.id !== clinicianId))

    try {
      const result = await deleteClinician(clinicianId, patientId)

      if (!result.success) {
        throw new Error('Failed to delete clinician')
      }
    } catch (error) {
      console.error('Error deleting clinician:', error)
      setCliniciansData(prevClinicians)
    }
  }

  const confirmDelete = (clinicianId: string, patientId: string) => {
    if (window.confirm('Are you sure you want to delete this clinician?')) {
      handleDelete(clinicianId, patientId)
    }
  }

  return (
    <>
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <Card sx={{ width: 1132, p: 3 }}>
          <Typography variant='h5' gutterBottom>
            Account Settings
          </Typography>
          <CardContent>
            <Grid container spacing={2}>
              <Grid size={{ xs: 6 }}>
                <TextField
                  fullWidth
                  label='First Name'
                  name='firstName'
                  value={formData.firstName}
                  onChange={handleChange}
                />
              </Grid>
              <Grid size={{ xs: 6 }}>
                <TextField
                  fullWidth
                  label='Last Name'
                  name='lastName'
                  value={formData.lastName}
                  onChange={handleChange}
                />
              </Grid>
              <Grid size={{ xs: 6 }}>
                <TextField fullWidth label='Email' name='email' value={formData.email} onChange={handleChange} />
              </Grid>
              <Grid size={{ xs: 6 }}>
                <TextField
                  fullWidth
                  label='Phone Number'
                  name='phoneNumber'
                  value={formData.phoneNumber || ''}
                  onChange={handleChange}
                />
              </Grid>
              <Grid size={{ xs: 6 }}>
                <TextField
                  fullWidth
                  label='Address'
                  name='address'
                  value={formData.address || ''}
                  onChange={handleChange}
                />
              </Grid>
              <Grid size={{ xs: 6 }}>
                <TextField
                  fullWidth
                  label='Date of Birth'
                  name='dateOfBirth'
                  type='date'
                  value={formData.dateOfBirth ? new Date(formData.dateOfBirth).toISOString().split('T')[0] : ''}
                  onChange={handleChange}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid size={{ xs: 6 }}>
                <TextField
                  fullWidth
                  label='Hospital Number'
                  name='hospitalNumber'
                  value={formData.hospitalNumber || ''}
                  onChange={handleChange}
                />
              </Grid>
            </Grid>
            {/* Error */}
            {errorMessage && (
              <Alert severity='error'>
                {errorMessage.split('\n').map((msg, index) => (
                  <div key={index}>{msg}</div>
                ))}
              </Alert>
            )}
            {/* Success */}
            {successMessage && <Alert severity='success'>{successMessage}</Alert>}
            <Box sx={{ display: 'flex', justifyContent: 'flex-start', gap: 2, mt: 3 }}>
              <Button variant='contained' color='primary' onClick={handleSave}>
                Save Changes
              </Button>
              <Button variant='outlined' color='secondary' onClick={handleReset}>
                Reset
              </Button>
            </Box>
          </CardContent>
        </Card>
      </Box>
      {/* Change Password Card */}
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <Card sx={{ width: 1132, p: 3 }}>
          <Typography variant='h5' gutterBottom>
            Change Password
          </Typography>
          <CardContent>
            {/* Current Password */}
            <Grid container spacing={2}>
              <Grid size={{ xs: 6 }}>
                <TextField
                  fullWidth
                  label='Current Password'
                  type={isCurrentPasswordShown ? 'text' : 'password'}
                  name='currentPassword'
                  value={passwordData.currentPassword}
                  onChange={handlePasswordFieldChange}
                  slotProps={{
                    input: {
                      endAdornment: (
                        <InputAdornment position='end'>
                          <IconButton
                            size='small'
                            edge='end'
                            onClick={handleClickShowCurrentPassword}
                            onMouseDown={e => e.preventDefault()}
                          >
                            <i className={isCurrentPasswordShown ? 'ri-eye-off-line' : 'ri-eye-line'} />
                          </IconButton>
                        </InputAdornment>
                      )
                    }
                  }}
                />
              </Grid>
            </Grid>

            {/* New Password and Confirm Password */}
            <Grid container spacing={2} sx={{ mt: 2 }}>
              <Grid size={{ xs: 6 }}>
                <TextField
                  fullWidth
                  label='New Password'
                  type={isNewPasswordShown ? 'text' : 'password'}
                  name='newPassword'
                  value={passwordData.newPassword}
                  onChange={handlePasswordFieldChange}
                  slotProps={{
                    input: {
                      endAdornment: (
                        <InputAdornment position='end'>
                          <IconButton
                            size='small'
                            edge='end'
                            onClick={() => setIsNewPasswordShown(!isNewPasswordShown)}
                            onMouseDown={e => e.preventDefault()}
                          >
                            <i className={isNewPasswordShown ? 'ri-eye-off-line' : 'ri-eye-line'} />
                          </IconButton>
                        </InputAdornment>
                      )
                    }
                  }}
                />
              </Grid>
              <Grid size={{ xs: 6 }}>
                <TextField
                  fullWidth
                  label='Confirm New Password'
                  type={isConfirmPasswordShown ? 'text' : 'password'}
                  name='confirmPassword'
                  value={passwordData.confirmPassword}
                  onChange={handlePasswordFieldChange}
                  slotProps={{
                    input: {
                      endAdornment: (
                        <InputAdornment position='end'>
                          <IconButton
                            size='small'
                            edge='end'
                            onClick={() => setIsConfirmPasswordShown(!isConfirmPasswordShown)}
                            onMouseDown={e => e.preventDefault()}
                          >
                            <i className={isConfirmPasswordShown ? 'ri-eye-off-line' : 'ri-eye-line'} />
                          </IconButton>
                        </InputAdornment>
                      )
                    }
                  }}
                />
              </Grid>
            </Grid>

            {/* Password Requirements */}
            <Grid size={{ xs: 12 }} className='flex flex-col gap-4'>
              <Typography variant='h6' color='text.secondary'>
                Password Requirements:
              </Typography>
              <div className='flex items-center gap-2.5 text-textSecondary'>
                <i className='ri-checkbox-blank-circle-fill text-[8px]' />
                Minimum 8 characters long - the more, the better
              </div>
              <div className='flex items-center gap-2.5 text-textSecondary'>
                <i className='ri-checkbox-blank-circle-fill text-[8px]' />
                At least one lowercase &amp; one uppercase character
              </div>
              <div className='flex items-center gap-2.5 text-textSecondary'>
                <i className='ri-checkbox-blank-circle-fill text-[8px]' />
                At least one number, symbol, or whitespace character
              </div>
            </Grid>
            {/* Password Error */}
            {passwordError && (
              <Alert severity='error'>
                {passwordError.split('\n').map((msg, index) => (
                  <div key={index}>{msg}</div>
                ))}
              </Alert>
            )}
            {/* Success */}
            {passwordSuccess && <Alert severity='success'>{passwordSuccess}</Alert>}

            {/* Change Password and Reset buttons */}
            <Box sx={{ display: 'flex', justifyContent: 'flex-start', gap: 2, mt: 3 }}>
              <Button variant='contained' color='primary' onClick={handleChangePassword}>
                Save Changes
              </Button>
              <Button variant='outlined' color='secondary' onClick={handlePasswordChangeReset}>
                Reset
              </Button>
            </Box>
          </CardContent>
        </Card>
      </Box>
      {/* Linked Clinicians Card*/}
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <Card sx={{ width: 1132, p: 3 }}>
          <Typography variant='h5' gutterBottom>
            Linked Clinicians
          </Typography>
          <CardContent>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>USER</TableCell>
                    <TableCell>EMAIL</TableCell>
                    <TableCell>PROFESSION</TableCell>
                    <TableCell>STATUS</TableCell>
                    <TableCell>DATA ACCESS</TableCell>
                    <TableCell></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {clinicians.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} style={{ textAlign: 'center', padding: '20px' }}>
                        {/* eslint-disable-next-line react/no-unescaped-entities */}
                        You don&apos;t have clinicians linked yet. Please add a clinician below.
                      </TableCell>
                    </TableRow>
                  ) : (
                    cliniciansData.map((clinician, index) => (
                      <TableRow key={index}>
                        <TableCell>
                          <div>
                            <i className='ri-hospital-line' style={{ color: 'orange' }}></i>
                            <Typography variant='body1'>{clinician.firstName} {clinician.lastName}</Typography>
                          </div>
                          <Typography variant='body2' color='secondary'>
                            {clinician.institution}
                          </Typography>
                        </TableCell>
                        <TableCell>{clinician.email}</TableCell>
                        <TableCell>{clinician.profession}</TableCell>
                        <TableCell>
                          <Chip label={clinician.status} variant='tonal' color={getStatusColor(clinician.status)} />
                        </TableCell>
                        <TableCell>
                          <Switch
                            color='success'
                            checked={!!clinician.agreedToShareData}
                            onChange={e => handleClinicianSwitch(clinician.id, e.target.checked, formData.id)}
                          />
                        </TableCell>
                        <TableCell>
                          <Button
                            color='secondary'
                            startIcon={<i className='ri-delete-bin-7-line' />}
                            onClick={() => confirmDelete(clinician.id, formData.id)}
                          ></Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
            {/* Add Clinician Button */}
            <Box sx={{ display: 'flex', justifyContent: 'flex-start', gap: 2, mt: 3 }}>
              <Button
                variant='contained'
                color='primary'
                onClick={() => router.push('/my-profile/patient-settings/add-clinician')}
              >
                Add Clinician
              </Button>
            </Box>
          </CardContent>
        </Card>
      </Box>
      {/* Data Sharing Consent*/}
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <Card sx={{ width: 1132, p: 3 }}>
          <Typography variant='h5' gutterBottom>
            Data Privacy
          </Typography>
          <FormGroup>
            <FormControlLabel
              control={
                <Switch
                  checked={!!agreedForResearch}
                  color='success'
                  onChange={e => setAgreedForResearch(e.target.checked)}
                />
              }
              label='I consent to being contacted about researchers accessing my data for medical research'
            />
          </FormGroup>

          {/* Save Data Privacy Settings Button */}
          <Box sx={{ display: 'flex', justifyContent: 'flex-start', gap: 2, mt: 3 }}>
            <Button variant='contained' color='primary' onClick={handleSaveResearch}>
              Save Changes
            </Button>
          </Box>
        </Card>
      </Box>
    </>
  )
}

export default UserProfile
