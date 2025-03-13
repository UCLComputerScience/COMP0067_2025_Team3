'use client'

import React, { useState, useEffect} from 'react'

import Grid from '@mui/material/Grid2'
import { Box, Button, Card, CardContent, TextField, Typography} from '@mui/material'

import InputAdornment from '@mui/material/InputAdornment'
import IconButton from '@mui/material/IconButton'
import Alert from '@mui/material/Alert'
import { safeParse } from 'valibot';

import type {UserData } from '@/app/(dashboard)/my-profile/clinician-settings/page'
import {saveUserProfile, resetUserProfile, changeUserPassword} from '@/actions/clinicianSettings/userActions'
import { userProfileSchema, passwordSchema } from '@/actions/formValidation';



interface Props {
    initialData: UserData;
}

const UserProfile = ({ initialData}: Props) => {
    const [formData, setFormData] = useState <UserData | null>(initialData)

    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      })

    const [passwordError, setPasswordError] = useState<string | null>(null);
    const [passwordSuccess, setPasswordSuccess] = useState<string | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
  

    useEffect(() => {
        setFormData(initialData);
      }, [initialData])
    
      if (!formData) {
        return <div>Loading...</div> // Render loading until user data is available
      }

  
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      console.log(e.target.name, e.target.value);
      setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    const [isCurrentPasswordShown, setIsCurrentPasswordShown] = useState(false)
    const [isConfirmPasswordShown, setIsConfirmPasswordShown] = useState(false)
    const [isNewPasswordShown, setIsNewPasswordShown] = useState(false)

    const handleClickShowCurrentPassword = () => {
      setIsCurrentPasswordShown(!isCurrentPasswordShown)
    }

    const handlePasswordFieldChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;

      setPasswordData(prevState => ({
          ...prevState,
          [name]: value,
      }));
  };
  

  const handleSave = async () => {
    setErrorMessage(null); 
    setSuccessMessage(null);
    const result = safeParse(userProfileSchema, formData);

    if (!result.success) {
      setErrorMessage(result.issues.map(issue => issue.message).join('\n'));
      
return;
    }

    try {
      const response = await saveUserProfile(formData);

      if (!response.success) {
        setErrorMessage('Failed to update profile');
      }

      setSuccessMessage('Profile changes saved successfully!');
    } catch (error) {
      console.error('Failed to update profile:', error);
      setErrorMessage('Error saving profile changes.');
    }
};

  const handleReset = async () => {
      setErrorMessage(null); 
      setSuccessMessage(null);
      const resetData = await resetUserProfile(formData.id);

      if (resetData) setFormData(resetData);
  };


  const handleChangePassword = async () => {
    const result = safeParse(passwordSchema, passwordData);
    
    if (!result.success) {
      setPasswordError(result.issues.map(issue => issue.message).join('\n'));
      
return;
    }

    if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
        // console.error("Error: One or more password fields are empty");
        setPasswordError("All fields are required.");
        
return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
        // console.error("Error: Passwords do not match");
        setPasswordError("Passwords do not match.");
        
return;
    }

    setPasswordError(null);
    
    try {
        const response = await changeUserPassword(formData.id, passwordData);

        // console.log("Change password success:", response.success);

        if (response.success) {
            setPasswordSuccess("Password changed successfully!");
            setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
        } else {
            // console.error("Error changing password.");
            setPasswordError(response.message);
        }
    } catch (error) {
        // console.error("Unexpected error while changing password:", error);
        setPasswordError("An error occurred while changing the password.");
    }
};


  const handlePasswordChangeReset = async () => {
      // Reset the password fields when the function is called
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      setPasswordError(null);
      setPasswordSuccess(null)

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
                    <TextField fullWidth label="Organization" name="institution" value={formData.institution || ""} onChange={handleChange}/>
                </Grid>
                <Grid size={{ xs: 6 }}>
                    <TextField fullWidth label="Phone Number" name="phoneNumber" value={formData.phoneNumber || ""} onChange={handleChange} />
                </Grid>
                <Grid size={{ xs: 6 }}>
                    <TextField fullWidth label="Address" name="address" value={formData.address || ""} onChange={handleChange} />
                </Grid>
                <Grid size={{ xs: 6 }}>
                    <TextField fullWidth label="Registration Number" name="registrationNumber" value={formData.registrationNumber || ""} onChange={handleChange}/>
                </Grid>
                <Grid size={{ xs: 6 }}>
                    <TextField fullWidth label="Profession" name="profession" value={formData.profession || ""} onChange={handleChange} />
                </Grid>
                </Grid>
                {/* Error */}
                {errorMessage && (
                  <Alert severity="error">
                    {errorMessage.split('\n').map((msg, index) => (
                      <div key={index}>{msg}</div>
                    ))}
                  </Alert>
                  )}
                {/* Success */}
                {successMessage && <Alert severity="success">{successMessage}</Alert>}
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
                name="currentPassword"
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
                name="newPassword"
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
                name="confirmPassword"
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
            {passwordError && (
              <Alert severity="error">
                {passwordError.split('\n').map((msg, index) => (
                  <div key={index}>{msg}</div>
                ))}
              </Alert>
            )}
            {/* Success */}
            {passwordSuccess && <Alert severity="success">{passwordSuccess}</Alert>}

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
    </>
  )
}

  export default UserProfile
