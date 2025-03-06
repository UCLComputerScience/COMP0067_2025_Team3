//The date of birth shows current date and not actual date from the database 
// save doesnt work for date of birth as well because of that

// Form validation

// whats wrong with passworddddd typing
// test changing passwords and new password + add validation???


// share data and delete clinician functionalities
// select clinician - theme colors not working 
// invite clinician functionality
// avoid saving clinician if the relationship already exists
// refresh the clinicians table better when new clinician added
// move functions to components

// *Could have* --> requirements changing to green as they are satisfied 
// *Could have* --> invited clinicians saved in the database



'use client'

import { Box, Button, Card, CardContent, TextField, Typography, List, ListItem, ListItemText, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Switch, Chip, FormControlLabel, FormGroup, Dialog, DialogTitle, DialogContent, DialogActions, Select, MenuItem, FormControl, InputLabel} from '@mui/material'
import Grid from '@mui/material/Grid2'
import React, { useState, useEffect} from 'react'
import { ClinicianData, UserData, AllClinicians } from '@/app/(dashboard)/patient-settings/page'
import {saveUserProfile, resetUserProfile, changeUserPassword, saveResearch, saveNewClinician} from '@/actions/userActions'
import InputAdornment from '@mui/material/InputAdornment'
import IconButton from '@mui/material/IconButton'
// import { useSession } from 'next-auth/react'
// const { data: session } = useSession()



interface Props {
    initialData: UserData;
    clinicians: ClinicianData [];
    cliniciansList: AllClinicians [];
}

const UserProfile = ({ initialData, clinicians =[], cliniciansList = []}: Props) => {
    const [formData, setFormData] = useState <UserData | null>(initialData)
    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      })

    const [passwordError, setPasswordError] = useState<string | null>(null)
    const [agreedForResearch, setAgreedForResearch] = useState(!!formData?.agreedForResearch);
    const [openModal, setOpenModal] = useState(false);
    const [selectedClinician, setSelectedClinician] = useState<string | null>(null);


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
  
    // const handleToggle = (e: React.ChangeEvent<HTMLInputElement>) => {
    //   setFormData({ ...agreedForResearch, [e.target.name]: e.target.checked })
    // }
  

  
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

      // Open the modal
    const handleOpenModal = () => {
      setOpenModal(true);
    };

    // Close the modal
    const handleCloseModal = () => {
      setOpenModal(false);
      setSelectedClinician(null);
    };


    const handleClinicianSelect = (clinician: AllClinicians) => {
      setSelectedClinician(clinician.id);
      console.log ('Selected clinicians id:', clinician.id)
    };

    const handleClinicianSave = async () => {
      if (selectedClinician) {
        try{
          const save = await saveNewClinician(selectedClinician, initialData.id);
          if (!save.success) {
            throw new Error ('Failed to save changes');
          }
          alert ('Clinician added successfully')
          window.location.reload();
          console.log("Selected Clinician:", selectedClinician);
        } catch (error) {
          console.error('Failed to save changes:', error);
          alert('Error saving changes.');
        }
      } else {
        console.log("No clinician selected");
      }
    };

    // New state for search
    const [searchCriteria, setSearchCriteria] = useState({
      firstName: '',
      lastName: '',
      organization: '',
      email: ''
  });

  // Filtered clinicians based on search
  const [filteredClinicians, setFilteredClinicians] = useState(cliniciansList);

    useEffect(() => {
      // Filter clinicians based on search criteria
      const filtered = cliniciansList.filter(clinician => {
          return (
              clinician.firstName.toLowerCase().includes(searchCriteria.firstName.toLowerCase()) &&
              clinician.lastName.toLowerCase().includes(searchCriteria.lastName.toLowerCase()) &&
              clinician.institution?.toLowerCase().includes(searchCriteria.organization.toLowerCase()) &&
              clinician.email.toLowerCase().includes(searchCriteria.email.toLowerCase())
          );
      });
      setFilteredClinicians(filtered);
  }, [searchCriteria, cliniciansList]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      setSearchCriteria(prevState => ({
          ...prevState,
          [name]: value
      }));
  };

  const handleSearch = () => {
      // Trigger the search/filter logic manually
      setFilteredClinicians(
          cliniciansList.filter(clinician => {
              return (
                  clinician.firstName.toLowerCase().includes(searchCriteria.firstName.toLowerCase()) &&
                  clinician.lastName.toLowerCase().includes(searchCriteria.lastName.toLowerCase()) &&
                  clinician.institution?.toLowerCase().includes(searchCriteria.organization.toLowerCase()) &&
                  clinician.email.toLowerCase().includes(searchCriteria.email.toLowerCase())
              );
          })
      );
  };

  const organizationsList = Array.from(
    new Set(cliniciansList.map(clinician => clinician.institution).filter(Boolean)))
  

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
                        <Typography variant="body2" color="secondary">
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
                        <Switch color='success' checked={!!clinician.agreedToShareData} />
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
                    <Button variant="contained" color="primary" onClick={handleOpenModal}> 
                        Add Clinician
                    </Button>
                    {/* Add Clinician Popup Modal */}
                    <Dialog open={openModal} onClose={handleCloseModal} maxWidth="md" fullWidth>
                      <DialogTitle>
                        Link Clinician
                        <IconButton 
                          color="secondary"
                          onClick={handleCloseModal}
                          sx={{ position: 'absolute', right: 8, top: 8 }}
                        >
                          <i className="ri-close-line" />
                        </IconButton>
                        <Typography color = 'secondary' variant="body2" sx={{alignItems: "center"}}>
                          Link your clinician to share data with
                      </Typography>
                      </DialogTitle>
                      <DialogContent>
                        {/* Search Fields */}
                      <Box display="grid" gridTemplateColumns="repeat(1, 1fr)" gap={2} sx={{ mt: 3 }}>
                        <TextField label="First Name" name="firstName" fullWidth value={searchCriteria.firstName} onChange={handleSearchChange}/>
                        <TextField label="Last Name" name="lastName" fullWidth value={searchCriteria.lastName} onChange={handleSearchChange} />
                        <FormControl fullWidth>
                        <InputLabel id='demo-basic-select-outlined-label'>Organization</InputLabel>
                        <Select label = "Organization" name="organization" defaultValue='' id='demo-basic-select-outlined' value={searchCriteria.organization} >
                        <MenuItem value="">Select Organization</MenuItem>
                        {organizationsList.map((organization, index) => (
                          <MenuItem key={index} value={String(organization)}>
                              {organization}
                          </MenuItem> ))}
                        </Select>
                        </FormControl>
                        <TextField label="Email" name="email" fullWidth value={searchCriteria.email} onChange={handleSearchChange} />
                      </Box>
                       {/* Search Button */}
                      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mt: 3}}>
                        <Button variant="contained" onClick={handleSearch} startIcon={<i className='ri-search-line' />}>
                          Search
                        </Button>

                        {/* Invite Text with Button */}
                        <Typography >
                          Cannot find your clinician?{" "}
                          <Button
                            variant="text"
                            color="primary"
                            sx={{ textTransform: "none", fontWeight: 600, p: 0, minWidth: "auto" }}
                            // onClick={handleInviteClick}
                          >
                            Invite them to create an account
                          </Button>
                        </Typography>

                      </Box>
                      {/* Results Clinician List */}
                        <Typography variant="subtitle2" sx={{ mt: 3, mb: 1, fontWeight: 600 }}>
                          {filteredClinicians.length} Results
                        </Typography>
                        <List sx={{ maxHeight: 300, overflowY: "auto", borderRadius: 1 }}>
                          {filteredClinicians.map((clinician) => (
                            <ListItem
                              key={clinician.id}
                              onClick={() => handleClinicianSelect(clinician)}
                              sx={{
                                 cursor: "pointer",
                                 backgroundColor: selectedClinician === clinician.id ? "#A379FF" : "primary",
                                 borderRadius: 1,
                                 "&:hover": { backgroundColor: "#A379FF" },
                              }}
                            >
                              <i className='ri-hospital-line' style={{ color: 'orange' }}></i>
                              <ListItemText
                                primary={
                                  <Typography>
                                    {clinician.firstName} {clinician.lastName}
                                  </Typography>
                                }
                                secondary={
                                  <>
                                    <Typography variant="body2" color='secondary'>
                                      {clinician.institution}
                                    </Typography>
                                    <Typography variant="body2" color='secondary'>
                                      {clinician.email}
                                    </Typography>
                                  </>
                                }
                              />
                            </ListItem>
                          ))}
                        </List>
                      </DialogContent>
                     {/* Save Button */}
                        <DialogActions sx={{ justifyContent: "flex-start", px: 3, pb: 3, mt: 3 }}>
                          <Button variant="contained" color="primary" onClick={handleClinicianSave} >
                            Save
                          </Button>
                        </DialogActions>
                    </Dialog>
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
              label="I consent to being contacted about researchers accessing my data for medical research"
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


