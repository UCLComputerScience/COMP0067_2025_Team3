// select clinician - theme colors not working 
// --> send email

// *Could have* personalised invitation message + personalised link
// *Could have* dont display already linked clinicians

'use client';

import { useState, useEffect, useRef} from 'react';
import { useRouter } from 'next/navigation';
import { Box, Button, Card, CardContent, Typography, TextField, List, ListItem, ListItemText, Select, MenuItem, FormControl, InputLabel, Dialog, DialogTitle, DialogContent, DialogActions, IconButton} from '@mui/material';
import Grid from '@mui/material/Grid2'
import { saveNewClinician, sendInvitation } from '@/actions/patientSettings/userActions';
import { AllClinicians, PatientId } from '@/app/(dashboard)/my-profile/patient-settings/add-clinician/page'

interface Props {
    id: string;
    cliniciansList: AllClinicians [];
}

const ClinicianLinkPage = ({ id, cliniciansList }: Props) => {
  const router = useRouter();
  const [selectedClinician, setSelectedClinician] = useState<AllClinicians | null>(null);
  const [filteredClinicians, setFilteredClinicians] = useState(cliniciansList);
  const [hasSearched, setHasSearched] = useState(false);

  const clinicianListRef = useRef<HTMLDivElement>(null); // Ref to detect clicks outside the clinician list
  const saveButtonRef = useRef<HTMLButtonElement | null>(null);
  const [openModal, setOpenModal] = useState(false);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchCriteria({ ...searchCriteria, [e.target.name]: e.target.value });
  };

  const handleSearch = () => {
    setHasSearched(true);
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

    const handleReset = () => {
        setSearchCriteria({
        firstName: '',
        lastName: '',
        organization: '',
        email: ''
        });
        setFilteredClinicians(cliniciansList); // Reset the filtered list to the original list
        setHasSearched(false); // Reset search state
    };

    const handleClinicianSelect = (clinician: AllClinicians) => {
        setSelectedClinician(clinician);
        console.log ('Selected clinicians id:', clinician.id)
        };

      // Handle unselecting clinician when clicking outside of the list
    const handleClickOutside = (event: MouseEvent) => {
        if (clinicianListRef.current && !clinicianListRef.current.contains(event.target as Node)) {
      // Prevent unselecting if the "Save" button is clicked
        if (event.target !== saveButtonRef.current) {
        setSelectedClinician(null);
      }
    }
  };

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);
 
    const handleClinicianSave = async () => {
    if (selectedClinician) {
        try{
        const save = await saveNewClinician(selectedClinician.id, id);
        if (!save.success) {
            throw new Error ('This clinician is already linked to your account.');
        }
        alert ('Clinician added successfully')
        router.push('/my-profile/patient-settings')
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

   const showSearchButtons = Object.values(searchCriteria).some(term => term.trim() !== '');

    // Open the modal
    const handleOpenModal = () => {
    setOpenModal(true);
    };

    // Close the modal
    const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedClinician(null);
    };

    const [message, setMessage] = useState({
        email: '',
        message: 'Dear clinician,\n\nYour patient would like to share their symptom data with you on our platform.\nRegister your account to view their spider-grams track their data.\n\nKind regards,\nThe Spider team'
    });
 
    const handleMessageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setMessage({ ...message, [e.target.name]: e.target.value });
        console.log("Invitation:", message);
      };

    const handleSendInvitation = async () => {
    if (message.email) {
        try{
        const invite = await sendInvitation(message.email, message.message);
        if (!invite.success) {
            throw new Error ('Failed to send the invitation');
        }
        alert ('Invitation sent successfully')
        handleCloseModal()
        console.log("Invitation:", message);
        } catch (error) {
        console.error('Failed to send invitation:', error);
        alert('Failed to send the invitation.');
        }
    } else {
        console.log("Please enter you clinician's email before sending the message.");
    }
    };

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
      <Card sx={{ width: 1132, p: 3 }}>
      <Typography variant="h5" gutterBottom>Link a Clinician</Typography>
      <Typography color = 'secondary' variant="body2" sx={{alignItems: "center"}}>
         Link your clinicians to share your data with them
      </Typography>

      {/* Search Grid */}
      <CardContent>
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid size={{ xs: 6 }}>
          <TextField label="First Name" name="firstName" fullWidth value={searchCriteria.firstName} onChange={handleSearchChange} />
        </Grid>
        <Grid size={{ xs: 6 }}>
          <TextField label="Last Name" name="lastName" fullWidth value={searchCriteria.lastName} onChange={handleSearchChange} />
        </Grid>
        <Grid size={{ xs: 6 }}>
          <FormControl fullWidth>
            <InputLabel>Organization</InputLabel>
            <Select name="organization" value={searchCriteria.organization} onChange={e => setSearchCriteria({ ...searchCriteria, organization: e.target.value })}>
              <MenuItem value="">Select Organization</MenuItem>
              {Array.from(new Set(cliniciansList.map(c => c.institution).filter(Boolean))).map((org, index) => (
                <MenuItem key={index} value={String(org)}>{org}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid size={{ xs: 6 }}>
          <TextField label="Email" name="email" fullWidth value={searchCriteria.email} onChange={handleSearchChange} />
        </Grid>

      {/* Search Button */}
      {showSearchButtons && (
        <Grid size={{ xs: 6 }}>
          <Box sx={{ display: 'flex', justifyContent: 'flex-start', gap: 2, mt: 3 }}>
           <Button variant="contained" onClick={handleSearch} startIcon={<i className='ri-search-line' />}>
             Search
           </Button>
           <Button variant="outlined" color="secondary"  onClick={handleReset}>
             Reset
           </Button>
           </Box>
        </Grid>
        )}
      </Grid>

      {/* Clinician List */}
      {hasSearched && (
        <>
      <Typography variant="h6" sx={{ mt: 3 }}>{filteredClinicians.length} Results</Typography>
      <List sx={{ maxHeight: 300, overflowY: "auto", border: '1px solid #ccc', borderRadius: 1, p: 1 }} ref={clinicianListRef} component="div">
        {filteredClinicians.map(clinician => (
          <ListItem key={clinician.id} onClick={() => handleClinicianSelect(clinician)} 
            sx={{ cursor: "pointer", backgroundColor: selectedClinician?.id === clinician.id ? "#A379FF" : "transparent", borderRadius: 1, "&:hover": { backgroundColor: "#A379FF" } }}>
            <i className='ri-hospital-line' style={{ color: 'orange' }}></i>
            <ListItemText primary={`${clinician.firstName} ${clinician.lastName}`} secondary={`${clinician.institution} - ${clinician.email}`} />
          </ListItem>
        ))}
      </List>

      {/* Invite */}
      <Grid size={{ xs: 6 }}>
            <Typography sx={{ flexGrow: 1, textAlign: "center" }}>
                Cannot find your clinician?{" "}
                <Button
                variant="text"
                color="primary"
                sx={{ textTransform: "none", fontWeight: 600, p: 0, minWidth: "auto" }}
                onClick={handleOpenModal}
                >
                Invite them to create an account
                </Button>
                <Dialog open={openModal} onClose={handleCloseModal} maxWidth="md" fullWidth>
                <DialogTitle>
                    Invite Clinician
                   <IconButton 
                        color="secondary"
                        onClick={handleCloseModal}
                        sx={{ position: 'absolute', right: 8, top: 8 }}
                        >
                        <i className="ri-close-line" />
                    </IconButton>
                    <Typography color = 'secondary' variant="body2" sx={{alignItems: "center"}}>
                        Invite your clinician to the platform to share your data with them.
                    </Typography>
                </DialogTitle>
                <DialogContent>
                {/* Text Fields */}
                    <Box display="grid" gridTemplateColumns="repeat(2, 1fr)" gap={2} sx={{ mt: 3 }}>
                    <TextField label="First Name" name="firstName" fullWidth value={searchCriteria.firstName} onChange={handleSearchChange} />
                    <TextField label="Last Name" name="lastName" fullWidth value={searchCriteria.lastName} onChange={handleSearchChange}/>
                    </Box>
                    <Box display="grid" gridTemplateColumns="repeat(1, 1fr)" gap={2} sx={{ mt: 3 }} >
                    <TextField label="Email" name="email" fullWidth value={message.email} onChange={handleMessageChange}/>
                    <TextField label="Message" name="message" fullWidth multiline maxRows={10} value={message.message} onChange={handleMessageChange}/>
                    </Box>
                </DialogContent>
                <DialogActions sx={{ justifyContent: "flex-start", px: 3, pb: 3, mt: 3 }}>
                    {/* Save and Cancel Buttons */}
                    <Button variant="contained" color="primary" onClick={handleSendInvitation}>Send Invitation</Button>
                    <Button variant="outlined" color="secondary" onClick={handleCloseModal}>Cancel</Button>
                </DialogActions>
                </Dialog>
            </Typography>
        </Grid>

      </>
      )}


      {/* Save and Cancel Buttons */}
      <Box sx={{ display: 'flex', justifyContent: 'flex-start', gap: 2, mt: 3 }}>
        <Button variant="contained" color="primary" onClick={handleClinicianSave} ref={saveButtonRef}>Save</Button>
        <Button variant="outlined" color="secondary" onClick={() => router.push('/my-profile/patient-settings')}>Cancel</Button>
      </Box>
      </CardContent>
      </Card>
    </Box>

  );
};

export default ClinicianLinkPage;


