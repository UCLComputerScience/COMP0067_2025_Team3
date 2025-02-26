//The data of birth shows current date and not actual date from the database 
// save doesnt work for date of birth as well because of that

// have not checked edge cases (no information on profile etc) and validation

// address phone num and hospital num missing from the database


// bigger break above pass requirements
// bullet points instead of '-'
// *Could have* --> requirements changing to green as they are satisfied 

// fix backend and test changing passwords and new password meeting the requirements 

// Add clinician button and backend 
// Clinician table --> icon color=warning and add organisation

// Add data sharing research consent  (fetch data for the button)

// change use of grid to grid2

'use client'

import { Box, Button, Card, CardContent, Grid, TextField, Typography, List, ListItem, ListItemText, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Switch, Chip, FormControlLabel, FormGroup} from '@mui/material'
import React, { useState, useEffect} from 'react'
import { UserData } from '@/app/(dashboard)/patient-settings/page'
import {saveUserProfile, resetUserProfile, changeUserPassword} from '@/actions/userActions'


// HARDCODED CLINICIAN DATA 
interface Clinician {
    name: string;
    organisation: string;
    email: string;
    profession: string;
    status: "Connected" | "Pending" | "Invited"; // Restrict possible values
    shareData: boolean;
  }
  const clinicians: Clinician[] = [
    { name: "Jordan Stevenson", organisation:"UCL", email: "Jacinthe_Blick@hotmail.com", profession: "Doctor", status: "Connected", shareData: true },
    { name: "Dorothy Lockman", organisation:"UCL", email: "dorothy_lockman@hotmail.com", profession: "Physician", status: "Connected", shareData: true },
    { name: "Wiki Hannah", organisation:"UCL", email: "wiki@hotmail.com", profession: "Physician", status: "Pending", shareData: false },
    { name: "Hannah Wiki", organisation:"UCL", email: "hannah@hotmail.com", profession: "Doctor", status: "Invited", shareData: false }
  ];


interface Props {
    initialData: UserData
  }

  const UserProfile = ({ initialData }: Props) => {
    const [formData, setFormData] = useState <UserData | null>(initialData)
    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      })

    const [passwordError, setPasswordError] = useState<string | null>(null)

    useEffect(() => {
        setFormData(initialData)
      }, [initialData])
    
      if (!formData) {
        return <div>Loading...</div> // Render loading until user data is available
      }
  
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setFormData({ ...formData, [e.target.name]: e.target.value })
    }
  
    const handleToggle = (e: React.ChangeEvent<HTMLInputElement>) => {
      setFormData({ ...formData, [e.target.name]: e.target.checked })
    }

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPasswordData({ ...passwordData, [e.target.name]: e.target.value })
      }
  
    const handleSave = async () => {
        await saveUserProfile(formData);
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
  
    return (
        <>
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
            <Card sx={{ width: 1132, p: 3 }}>
            <Typography variant="h5" gutterBottom>
                Account Settings
            </Typography>
            <CardContent>
                <Grid container spacing={2}>
                <Grid item xs={6}>
                    <TextField fullWidth label="First Name" name="firstName" value={formData.firstName} onChange={handleChange} />
                </Grid>
                <Grid item xs={6}>
                    <TextField fullWidth label="Last Name" name="lastName" value={formData.lastName} onChange={handleChange} />
                </Grid>
                <Grid item xs={6}>
                    <TextField fullWidth label="Email" name="email" value={formData.email} onChange={handleChange} />
                </Grid>
                <Grid item xs={6}>
                    <TextField fullWidth label="Phone Number" name="phoneNumber" value='' onChange={handleChange} />
                </Grid>
                <Grid item xs={6}>
                    <TextField fullWidth label="Address" name="address" value='' onChange={handleChange} />
                </Grid>
                <Grid item xs={6}>
                    <TextField fullWidth label="Date of Birth" name="dateOfBirth" type="date" value={formData.dateOfBirth} onChange={handleChange} InputLabelProps={{ shrink: true }} />
                </Grid>
                <Grid item xs={6}>
                    <TextField fullWidth label="Hospital Number" name="hospitalNumber" value='' onChange={handleChange} />
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
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Current Password"
                  name="currentPassword"
                  type="password"
                  value={passwordData.currentPassword}
                  onChange={handlePasswordChange}
                />
              </Grid>
            </Grid>

            {/* New Password and Confirm Password */}
            <Grid container spacing={2} sx={{ mt: 2 }}>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="New Password"
                  name="newPassword"
                  type="password"
                  value={passwordData.newPassword}
                  onChange={handlePasswordChange}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Confirm New Password"
                  name="confirmPassword"
                  type="password"
                  value={passwordData.confirmPassword}
                  onChange={handlePasswordChange}
                />
              </Grid>
            </Grid>

            {/* Password Requirements */}
            <Typography variant="h6" sx={{ fontWeight: 'bold', mt: 2 }}>
                Password Requirements:
            </Typography>
            <Box sx={{ mt: 2 }}>
                <List>
                    <ListItem>
                        <ListItemText primary="- Minimum 8 characters long." />
                    </ListItem>
                    <ListItem>
                        <ListItemText primary="- At least one lower-case character." />
                    </ListItem>
                    <ListItem>
                        <ListItemText primary="- At least one number, symbol, or whitespace character." />
                    </ListItem>
                </List>
            </Box>

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
                <TableRow sx={{ backgroundColor: "#f6f7fb" }}>
                  <TableCell>USER</TableCell>
                  <TableCell>EMAIL</TableCell>
                  <TableCell>PROFESSION</TableCell>
                  <TableCell>STATUS</TableCell>
                  <TableCell>ACTION</TableCell>
                  <TableCell>SHARE DATA</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {clinicians.map((clinician, index) => (
                  <TableRow key={index}>
                    <TableCell>
                        <div>
                            <i className='ri-hospital-line' style={{ color: 'orange' }}></i> 
                            <Typography variant="body1">{clinician.name}</Typography>
                        </div>
                        <Typography variant="body2" color="textSecondary">
                            {clinician.organisation}
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
                        <Button color='secondary' startIcon={<i className='ri-delete-bin-7-line' />}>
                        </Button>
                    </TableCell>
                    <TableCell>
                      <Switch color = 'success' checked={clinician.shareData} />
                    </TableCell>
                  </TableRow>
                ))}
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
            <FormControlLabel control={<Switch color = 'success' />} label="I consent to be contacted about my data being used for research" />
          </FormGroup>
            {/* Save Data Privacy Settings Button */}
            <Box sx={{ display: 'flex', justifyContent: 'flex-start', gap: 2, mt: 3 }}>
                    <Button variant="contained" color="primary"> 
                        Save Changes
                    </Button>
            </Box>
        </Card>
      </Box>
    </>
  )
}

  export default UserProfile
