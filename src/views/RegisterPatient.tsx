"use client";

import React, { useState, useEffect } from "react";
import { 
  Box, 
  Typography, 
  Button, 
  Switch, 
  FormControlLabel, 
  Alert, 
  Snackbar, 
  CircularProgress,
  Card,
  CardContent
} from "@mui/material";
import { Clinician } from "@/actions/registerActions";
import ClinicianSearch from "./ClinicianSearch";
import SavedClinicians from "./SavedClinicians";
import { completeRegistration } from "@/actions/registerActions";
import { useRouter } from "next/navigation";

// Define the props interface
interface RegisterPatientProps {
  onBack: () => void;
  accountType: string;
  userId: string | null;
}

// Create the component focusing only on the Data Privacy step
const RegisterPatient = ({ onBack, accountType, userId }: RegisterPatientProps) => {
  const router = useRouter();

  // State for data privacy settings
  const [consentToClinicians, setConsentToClinicians] = useState(false);
  const [consentToResearchers, setConsentToResearchers] = useState(true);
  const [savedClinicians, setSavedClinicians] = useState<Clinician[]>([]);

  // UI state
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Effect to control success message visibility
  useEffect(() => {
    setSuccess(null);
    return () => {
      setSuccess(null);
    };
  }, []);

  // Add clinician to saved list
  const handleSaveClinician = (clinician: Clinician) => {
    // Prevent duplicates
    if (!savedClinicians.some(saved => saved.id === clinician.id)) {
      setSavedClinicians(prev => [...prev, clinician]);
    }
  };

  // Remove clinician from saved list
  const handleRemoveClinician = (clinicianId: string) => {
    setSavedClinicians(prev => prev.filter(clinician => clinician.id !== clinicianId));
  };

  // Handle form submission
  const handleSubmit = async () => {
    if (!userId) {
      setError("User registration incomplete. Please go back and try again.");
      return;
    }
    
    try {
      setIsLoading(true);
      setError(null);
      
      // Show success message before redirecting
      setSuccess("Account created successfully! Redirecting to dashboard...");
      
      // Submit data privacy settings after a brief delay to show the success message
      setTimeout(async () => {
        try {
          // Complete the patient registration with privacy settings
          await completeRegistration(userId, {
            researchConsent: consentToResearchers,
            clinicianAccess: consentToClinicians,
            selectedClinicians: savedClinicians
          });
          
          // Redirect to dashboard
          router.push('/dashboard');
        } catch (submitErr) {
          console.error("Registration completion error:", submitErr);
          setError(submitErr instanceof Error ? submitErr.message : "An unexpected error occurred");
          setIsLoading(false);
        }
      }, 1500);
      
    } catch (err) {
      console.error("Registration completion error:", err);
      setError(err instanceof Error ? err.message : "An unexpected error occurred");
      setIsLoading(false);
    }
  };

  return (
    <Box sx={{ maxWidth: "600px", marginX: "auto" }}>
      {/* Error and success notifications */}
      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={() => setError(null)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert severity="error" onClose={() => setError(null)}>
          {error}
        </Alert>
      </Snackbar>
      
      <Snackbar
        open={!!success}
        autoHideDuration={6000}
        onClose={() => setSuccess(null)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert severity="success" onClose={() => setSuccess(null)}>
          {success}
        </Alert>
      </Snackbar>
      
      {/* Data Privacy Section */}
      <Card sx={{ mb: 4, bgcolor: '#2d2a43', color: 'white' }}>
        <CardContent sx={{ p: 4 }}>
          <Typography variant="h4" fontWeight="bold" sx={{ marginBottom: 2, color: 'white' }}>
            Data Privacy
          </Typography>

          <Box sx={{ mb: 4 }}>
            <FormControlLabel 
              control={
                <Switch 
                  checked={consentToResearchers} 
                  onChange={(e) => setConsentToResearchers(e.target.checked)}
                  disabled={isLoading}
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
                  disabled={isLoading}
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

          {/* Clinician search section (conditionally rendered) */}
          {consentToClinicians && (
            <>
              {/* Display saved clinicians if any exist */}
              {savedClinicians.length > 0 && (
                <Box sx={{ mb: 4 }}>
                  <Typography variant="h6" sx={{ mb: 2, color: 'white' }}>
                    Your Selected Clinicians
                  </Typography>
                  <SavedClinicians 
                    clinicians={savedClinicians} 
                    onRemoveClinician={handleRemoveClinician} 
                  />
                </Box>
              )}

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
              onClick={onBack}
              disabled={isLoading}
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
              onClick={handleSubmit}
              disabled={isLoading}
              sx={{ 
                bgcolor: '#4CAF50', 
                color: 'white', 
                '&:hover': { bgcolor: '#45a049' },
                borderRadius: '8px'
              }}
            >
              {isLoading ? (
                <CircularProgress size={24} sx={{ color: 'white' }} />
              ) : (
                'Submit ✓'
              )}
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default RegisterPatient;
