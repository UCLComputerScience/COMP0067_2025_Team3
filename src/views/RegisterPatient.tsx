"use client";

import React, { useState } from "react";
import { 
  Box, Typography, TextField, Button, Checkbox, FormControlLabel, 
  Grid, Link, Switch, InputAdornment, IconButton
} from "@mui/material";
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import ClinicianSearch from "./ClinicianSearch";
import SavedClinicians from "./SavedClinicians";
import { Clinician } from "./ClinicianSearch";

// Define the props interface
interface RegisterPatientProps {
  onBack: () => void;
  accountType: string;
}

// Create the component as a regular function component
const RegisterPatient: React.FC<RegisterPatientProps> = ({ onBack, accountType }) => {
  console.log('Current account type:', accountType);
  const [step, setStep] = useState(0);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [consentToClinicians, setConsentToClinicians] = useState(false);
  const [consentToResearchers, setConsentToResearchers] = useState(true);

  // Account details form fields
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  
  // Password visibility
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  // Save list of selected clinicians
  const [savedClinicians, setSavedClinicians] = useState<Clinician[]>([]);

  // Toggle password visibility
  const handleTogglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  // Toggle confirm password visibility
  const handleToggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword((prev) => !prev);
  };

  // Add clinician to saved list
  const handleSaveClinician = (clinician: Clinician) => {
    setSavedClinicians(prev => [...prev, clinician]);
  };
  
  // Remove clinician from saved list
  const handleRemoveClinician = (clinicianId: string) => {
    setSavedClinicians(prev => prev.filter(clinician => clinician.id !== clinicianId));
  };

  return (
    <Box sx={{ maxWidth: "600px", marginX: "auto" }}>
      {/* Account Details */}
      {step === 0 && (
        <>
          <Typography variant="h4" fontWeight="bold" sx={{ marginBottom: 1 }}>
            Account Details
          </Typography>
          <Typography variant="body1" color="textSecondary" sx={{ marginBottom: 3 }}>
            Enter your account details below.
          </Typography>

          {/* Form fields */}
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <TextField 
                label="First name" 
                fullWidth 
                variant="outlined"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                sx={{ 
                  mb: 2,
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '8px',
                  }
                }}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField 
                label="Last name" 
                fullWidth 
                variant="outlined"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                sx={{ 
                  mb: 2,
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '8px',
                  }
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField 
                label="Email" 
                type="email"
                fullWidth 
                variant="outlined"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                sx={{ 
                  mb: 2,
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '8px',
                  }
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField 
                label="Password" 
                type={showPassword ? "text" : "password"}
                fullWidth 
                variant="outlined"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={handleTogglePasswordVisibility}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                      </IconButton>
                    </InputAdornment>
                  )
                }}
                sx={{ 
                  mb: 2,
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '8px',
                  }
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField 
                label="Confirm password" 
                type={showConfirmPassword ? "text" : "password"}
                fullWidth 
                variant="outlined"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={handleToggleConfirmPasswordVisibility}
                        edge="end"
                      >
                        {showConfirmPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                      </IconButton>
                    </InputAdornment>
                  )
                }}
                sx={{ 
                  mb: 2,
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '8px',
                  }
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField 
                label="Date of birth" 
                type="date"
                fullWidth 
                variant="outlined"
                value={dateOfBirth}
                onChange={(e) => setDateOfBirth(e.target.value)}
                InputLabelProps={{ 
                  shrink: true,
                }}
                sx={{ 
                  mb: 2,
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '8px',
                  }
                }}
              />
            </Grid>
          </Grid>

          <FormControlLabel
            control={
              <Checkbox 
                checked={agreeTerms} 
                onChange={(e) => setAgreeTerms(e.target.checked)}
                sx={{
                  color: '#6e41e2',
                  '&.Mui-checked': {
                    color: '#6e41e2',
                  },
                }}
              />
            }
            label={
              <Typography variant="body2">
                I agree to <Link href="#" sx={{ color: '#6e41e2' }}>privacy policy & terms</Link>
              </Typography>
            }
            sx={{ mb: 2 }}
          />

          {/* Buttons */}
          <Box sx={{ display: "flex", justifyContent: "space-between", marginTop: 3 }}>
            <Button 
              variant="outlined" 
              onClick={onBack}
              sx={{ 
                borderRadius: '8px',
                borderColor: '#6e41e2',
                color: '#6e41e2',
                '&:hover': {
                  borderColor: '#5835b5',
                  backgroundColor: 'rgba(110, 65, 226, 0.04)',
                },
              }}
            >
              ← Previous
            </Button>
            <Button 
              variant="contained"
              onClick={() => setStep(1)}
              disabled={!agreeTerms}
              sx={{ 
                borderRadius: '8px',
                backgroundColor: '#6e41e2',
                '&:hover': {
                  backgroundColor: '#5835b5',
                },
                '&.Mui-disabled': {
                  backgroundColor: '#ded5f7',
                  color: '#ffffff',
                }
              }}
            >
              Next →
            </Button>
          </Box>
        </>
      )}

      {/* Data Privacy */}
      {step === 1 && (
        <Box sx={{ bgcolor: '#2d2a43', p: 4, borderRadius: '8px', color: 'white' }}>
          <Typography variant="h4" fontWeight="bold" sx={{ marginBottom: 2, color: 'white' }}>
            Data Privacy
          </Typography>

          <Box sx={{ mb: 4 }}>
            <FormControlLabel 
              control={
                <Switch 
                  checked={consentToResearchers} 
                  onChange={(e) => setConsentToResearchers(e.target.checked)}
                  sx={{
                    '& .MuiSwitch-switchBase.Mui-checked': {
                      color: '#6e41e2',
                    },
                    '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                      backgroundColor: '#6e41e2',
                    },
                  }}
                />
              } 
              label={
                <Typography variant="body2" sx={{ color: 'white' }}>
                  I consent to being contacted about researchers accessing my data for medical research
                </Typography>
              }
              sx={{ display: 'flex', mb: 2 }}
            />
            
            <FormControlLabel 
              control={
                <Switch 
                  checked={consentToClinicians} 
                  onChange={(e) => setConsentToClinicians(e.target.checked)}
                  sx={{
                    '& .MuiSwitch-switchBase.Mui-checked': {
                      color: '#6e41e2',
                    },
                    '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                      backgroundColor: '#6e41e2',
                    },
                  }}
                />
              } 
              label={
                <Typography variant="body2" sx={{ color: 'white' }}>
                  I consent to the clinicians I approve being able to access my data
                </Typography>
              }
              sx={{ display: 'flex', mb: 2 }}
            />
          </Box>

          {/* Clinician search */}
          {consentToClinicians && (
            <>
              {/* Display saved clinicians */}
              <SavedClinicians 
                clinicians={savedClinicians} 
                onRemoveClinician={handleRemoveClinician} 
              />

              {/* Clinician search component */}
              <ClinicianSearch 
                onSaveClinician={handleSaveClinician} 
                savedClinicians={savedClinicians} 
              />
            </>
          )}

          {/* Navigation Buttons */}
          <Box sx={{ display: "flex", justifyContent: "space-between", marginTop: 3 }}>
            <Button 
              variant="outlined" 
              onClick={() => setStep(0)}
              sx={{ 
                borderRadius: '8px',
                borderColor: 'rgba(255, 255, 255, 0.3)',
                color: 'white',
                '&:hover': {
                  borderColor: 'rgba(255, 255, 255, 0.5)',
                  backgroundColor: 'rgba(255, 255, 255, 0.05)',
                },
              }}
            >
              ← Previous
            </Button>
            <Button 
              variant="contained" 
              onClick={() => console.log("Submit")}
              sx={{ 
                bgcolor: '#4CAF50', 
                color: 'white', 
                '&:hover': { bgcolor: '#45a049' },
                borderRadius: '8px'
              }}
            >
              Submit ✔
            </Button>
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default RegisterPatient;
