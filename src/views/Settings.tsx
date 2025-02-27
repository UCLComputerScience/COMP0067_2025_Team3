//The date of birth shows current date and not actual date from the database 
// save doesnt work for date of birth as well because of that

// have not checked edge cases (no information on profile etc) and validation

// *Could have* --> requirements changing to green as they are satisfied 

// fix backend and test changing passwords and new password meeting the requirements 

// Add clinician button and backend 


'use client'

import { Box, Button, Card, CardContent, TextField, Typography, List, ListItem, ListItemText, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Switch, Chip, FormControlLabel, FormGroup} from '@mui/material'
import Grid from '@mui/material/Grid2'
import React, { useState, useEffect} from 'react'
import { ClinicianData, UserData } from '@/app/(dashboard)/patient-settings/page'
import {saveUserProfile, resetUserProfile, changeUserPassword, saveResearch} from '@/actions/userActions'


import InputAdornment from '@mui/material/InputAdornment'
import IconButton from '@mui/material/IconButton'

// // HARDCODED CLINICIAN DATA 
// interface Clinician {
//     name: string;
//     organisation: string;
//     email: string;
//     profession: string;
//     status: "Connected" | "Pending" | "Invited"; // Restrict possible values
//     shareData: boolean;
//   }
//   const clinicians: Clinician[] = [
//     { name: "Jordan Stevenson", organisation:"UCL", email: "Jacinthe_Blick@hotmail.com", profession: "Doctor", status: "Connected", shareData: true },
//     { name: "Dorothy Lockman", organisation:"UCL", email: "dorothy_lockman@hotmail.com", profession: "Physician", status: "Connected", shareData: true },
//     { name: "Wiki Hannah", organisation:"UCL", email: "wiki@hotmail.com", profession: "Physician", status: "Pending", shareData: false },
//     { name: "Hannah Wiki", organisation:"UCL", email: "hannah@hotmail.com", profession: "Doctor", status: "Invited", shareData: false }
//   ];


interface Props {
    initialData: UserData;
    clinicians: ClinicianData [];
  }

  const UserProfile = ({ initialData, clinicians =[]}: Props) => {
    const [formData, setFormData] = useState <UserData | null>(initialData)
    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      })

    const [passwordError, setPasswordError] = useState<string | null>(null)
    const [agreedForResearch, setAgreedForResearch] = useState(!!formData?.agreedForResearch);

    useEffect(() => {
        setFormData(initialData);
      }, [initialData])
    
      if (!formData) {
        return <div>Loading...</div> // Render loading until user data is available
      }

    useEffect(() => {
      setAgreedForResearch(!!formData?.agreedForResearch);
    }, [formData])
  
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setFormData({ ...formData, [e.target.name]: e.target.value })
    }
  
    // const handleToggle = (e: React.ChangeEvent<HTMLInputElement>) => {
    //   setFormData({ ...agreedForResearch, [e.target.name]: e.target.checked })
    // }
  const [isCurrentPasswordShown, setIsCurrentPasswordShown] = useState(false)
  const [isConfirmPasswordShown, setIsConfirmPasswordShown] = useState(false)
  const [isNewPasswordShown, setIsNewPasswordShown] = useState(false)

  const handleClickShowCurrentPassword = () => {
    setIsCurrentPasswordShown(!isCurrentPasswordShown)
  }

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setPasswordData({ ...passwordData, [e.target.name]: e.target.value })
    }
  
  const handleSave = async () => {
    try {
      const response = await saveUserProfile(formData);
      if (!response.success) {
        throw new Error('Failed to update profile');
      }
      alert('Profile changed saved successfully!');
    } catch (error) {
      console.error('Failed to update profile:', error);
      alert('Error saving profile changes.');
    }

  };

  const handleReset = async () => {
      const resetData = await resetUserProfile(formData.id);
      if (resetData) setFormData(resetData);
  };

  const handleChangePassword = async () => {
      if (passwordData.newPassword !== passwordData.confirmPassword) {
        setPasswordError('Passwords do not match.') //make that red
        return
      }
      setPasswordError(null)
      const success = await changeUserPassword(formData.id, passwordData)
      if (success) {
        alert('Password changed successfully!')
        setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' })
      } else {
        alert('Error changing password.') 
      }
    }


  const handlePasswordChangeReset = async () => {
      // Reset the password fields when the function is called
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
  };

    
  const getStatusColor = (status: string) => {
      switch (status) {
        case "Connected": return 'success';
        case "Pending": return 'warning';
        case "Invited": return 'primary' ;
        default: return 'primary';
      }
    };
    
    const handleSaveResearch = async () => {
      try {
        const response = await saveResearch(
          { agreedForResearch }, // data to be saved
          { id: formData.id } // user ID
        );
    
        if (!response.success) {
          throw new Error('Failed to update research consent');
        }
    
        alert('Research consent saved successfully!');
      } catch (error) {
        console.error('Failed to update research consent:', error);
        alert('Error saving research consent.');
      }
    };

    return (
        <>
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
            <Card sx={{ width: 1132, p: 3 }}>
            <Typography variant="h5" gutterBottom>
                Account Settings
            </Typography>
            <CardContent>
                <Grid container spacing={2}>
                <Grid size={{ xs: 6 }}>
                    <TextField fullWidth label="First Name" name="firstName" value={formData.firstName} onChange={handleChange} />
                </Grid>
                <Grid size={{ xs: 6 }}>
                    <TextField fullWidth label="Last Name" name="lastName" value={formData.lastName} onChange={handleChange} />
                </Grid>
                <Grid size={{ xs: 6 }}>
                    <TextField fullWidth label="Email" name="email" value={formData.email} onChange={handleChange} />
                </Grid>
                <Grid size={{ xs: 6 }}>
                    <TextField fullWidth label="Phone Number" name="phoneNumber" value={formData.phoneNumber || ""} onChange={handleChange} />
                </Grid>
                <Grid size={{ xs: 6 }}>
                    <TextField fullWidth label="Address" name="address" value={formData.address || ""} onChange={handleChange} />
                </Grid>
                <Grid size={{ xs: 6 }}>
                    <TextField fullWidth label="Date of Birth" name="dateOfBirth" type="date" value={formData.dateOfBirth || ""} onChange={handleChange} InputLabelProps={{ shrink: true }} />
                </Grid>
                <Grid size={{ xs: 6 }}>
                    <TextField fullWidth label="Hospital Number" name="hospitalNumber" value={formData.hospitalNumber || ""} onChange={handleChange} />
                </Grid>
                </Grid>
                <Box sx={{ display: 'flex', justifyContent: 'flex-start', gap: 2, mt: 3 }}>
                    <Button variant="contained" color="primary" onClick={handleSave}>
                        Save Changes
                    </Button>
                    <Button variant="outlined" color="secondary" onClick={handleReset}>
                        Reset
                    </Button>
                </Box>
            </CardContent>
            </Card>
        </Box>
        {/* Change Password Card */}
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <Card sx={{ width: 1132, p: 3 }}>
          <Typography variant="h5" gutterBottom>
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
                value={passwordData.currentPassword}
                onChange={handlePasswordChange}
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
                value={passwordData.newPassword}
                onChange={handlePasswordChange}
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
                onChange={handlePasswordChange}
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
              <div className='flex flex-col gap-4'>
                <div className='flex items-center gap-2.5 text-textSecondary'>
                  <i className='ri-checkbox-blank-circle-fill text-[8px]' />
                  Minimum 8 characters long - the more, the better
                </div>
                <div className='flex items-center gap-2.5 text-textSecondary'>
                  <i className='ri-checkbox-blank-circle-fill text-[8px]' />
                  At least one lowercase & one uppercase character
                </div>
                <div className='flex items-center gap-2.5 text-textSecondary'>
                  <i className='ri-checkbox-blank-circle-fill text-[8px]' />
                  At least one number, symbol, or whitespace character
                </div>
              </div>
            </Grid>
            {/* Password Error */}
            {passwordError && <Typography color="error" sx={{ mt: 1 }}>{passwordError}</Typography>}

            {/* Change Password and Reset buttons */}
            <Box sx={{ display: 'flex', justifyContent: 'flex-start', gap: 2, mt: 3 }}>
                    <Button variant="contained" color="primary" onClick={handleChangePassword}>
                        Save Changes
                    </Button>
                    <Button variant="outlined" color="secondary" onClick={handlePasswordChangeReset}>
                        Reset
                    </Button>
                </Box>
          </CardContent>
        </Card>
      </Box>
       {/* Linked Clinicians Card*/}
       <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <Card sx={{ width: 1132, p: 3 }}>
          <Typography variant="h5" gutterBottom>
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
                      You don't have clinicians linked yet. Please add a clinician below.
                    </TableCell>
                  </TableRow>
                ) : (
                  clinicians.map((clinician, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        <div>
                          <i className='ri-hospital-line' style={{ color: 'orange' }}></i> 
                          <Typography variant="body1">{clinician.firstName}</Typography>
                        </div>
                        <Typography variant="body2" color="textSecondary">
                          {clinician.institution}
                        </Typography>
                      </TableCell>
                      <TableCell>{clinician.email}</TableCell>
                      <TableCell>{clinician.profession}</TableCell>
                      <TableCell>
                        <Chip 
                          label={clinician.status} variant='tonal' color={getStatusColor(clinician.status)}
                        />
                      </TableCell>
                      <TableCell>
                        <Switch color='success' checked={clinician.agreedToShareData} />
                      </TableCell>
                      <TableCell>
                        <Button color='secondary' startIcon={<i className='ri-delete-bin-7-line' />}>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>

            </Table>
           </TableContainer>
            {/* Add Clinician Button */}
            <Box sx={{ display: 'flex', justifyContent: 'flex-start', gap: 2, mt: 3 }}>
                    <Button variant="contained" color="primary"> 
                        Add Clinician
                    </Button>
            </Box>
          </CardContent>
        </Card>
      </Box>
      {/* Data Sharing Consent*/}
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <Card sx={{ width: 1132, p: 3 }}>
          <Typography variant="h5" gutterBottom>
            Data Privacy
          </Typography>
          <FormGroup>
            <FormControlLabel
              control={
                <Switch
                  checked={!!agreedForResearch}
                  color="success"
                  onChange={(e) => setAgreedForResearch(e.target.checked)} 
                />
              }
              label="I consent to be contacted about my data being used for research"
            />
          </FormGroup>

          {/* Save Data Privacy Settings Button */}
          <Box sx={{ display: 'flex', justifyContent: 'flex-start', gap: 2, mt: 3 }}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleSaveResearch} 
            >
              Save Changes
            </Button>
          </Box>
        </Card>
      </Box>
    </>
  )
}

  export default UserProfile


