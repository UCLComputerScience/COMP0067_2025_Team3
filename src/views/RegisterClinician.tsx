"use client";

import { useRouter } from "next/navigation";
import { AccountDetailsForm } from './Register'; 
import React, { useState, useEffect } from "react";
import { completeRegistration } from "@/actions/registerActions";
import {Box,Typography,Button,CircularProgress,Card,CardContent,Dialog,DialogTitle,DialogContent,DialogActions,} from "@mui/material";

// Define the props interface
interface RegisterClinicianProps {onBack: () => void;accountType: string;userId: string | null;formData: AccountDetailsForm}

const RegisterClinician: React.FC<RegisterClinicianProps> = ({ onBack, accountType, userId, formData,}) => {
  const router = useRouter();

  // UI state
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [openSuccessDialog, setOpenSuccessDialog] = useState(false);
  const [openErrorDialog, setOpenErrorDialog] = useState(false);

  // Effect to clean up on unmount
  useEffect(() => {
    setSuccess(null);
    return () => {
      setSuccess(null);
      setError(null);
    };
  }, []);

  // Handle form submission - this is the main registration flow for clinicians
  const handleSubmit = async () => {
    if (!userId) { setError("User registration incomplete. Please go back and try again.");setOpenErrorDialog(true);
      return;
    }

    try { setIsLoading(true);setError(null);
      console.log("formData:", formData);

      // Complete the registration for Clinician
      const completionResult = await completeRegistration(userId, { researchConsent: false, clinicianAccess: false, selectedClinicians: [],}, accountType); 

      if (!completionResult.success) {
        throw new Error(completionResult.error || "Failed to complete registration");
      }

      setSuccess("Congratulations! Your account has been created successfully!");
      setOpenSuccessDialog(true);
    } catch (err) {
      console.error("Registration error:", err);
      setError(err instanceof Error ? err.message : "An unexpected error occurred");
      setOpenErrorDialog(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoToLogin = () => {
    setOpenSuccessDialog(false);
    router.push("/login");
  };

  return (
    <Box sx={{ maxWidth: "600px", marginX: "auto" }}>
      {/* Error dialog */}
      <Dialog open={openErrorDialog} onClose={() => setOpenErrorDialog(false)} aria-labelledby="error-dialog-title">
        <DialogTitle id="error-dialog-title">Error</DialogTitle>
        <DialogContent> <Typography variant="body1">{error}</Typography></DialogContent>
        <DialogActions> <Button onClick={onBack}  variant="contained" sx={{ bgcolor: "#6e41e2", color: "white", "&:hover": { bgcolor: "#5835b5" },  borderRadius: "8px",}}>Back to Register</Button></DialogActions></Dialog>

      {/* Success dialog */}
      <Dialog open={openSuccessDialog} onClose={() => setOpenSuccessDialog(false)} aria-labelledby="success-dialog-title">
        <DialogTitle id="success-dialog-title">Success</DialogTitle>
        <DialogContent> <Typography variant="body1">{success}</Typography> </DialogContent>
        <DialogActions> <Button onClick={handleGoToLogin} variant="contained" sx={{   bgcolor: "#6e41e2",  color: "white",  "&:hover": { bgcolor: "#5835b5" },  borderRadius: "8px",}}> Go to Login</Button> </DialogActions></Dialog>

      {/* Clinician registration confirmation */}
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Typography variant="h4" fontWeight="bold" sx={{ marginBottom: 2 }}> Complete Registration </Typography>
          <Typography variant="body1" sx={{ mb: 4 }}>  You have successfully provided all the necessary information to register as aclinician. Click submit to complete your registration.</Typography>
          <Box sx={{ display: "flex", justifyContent: "space-between", mt: 4 }}>
            <Button variant="outlined" onClick={onBack} disabled={isLoading} sx={{  borderRadius: "8px", borderColor: "#6e41e2", color: "#6e41e2","&:hover": {  borderColor: "#5835b5", backgroundColor: "rgba(110, 65, 226, 0.04)" },}}> ← Previou</Button>
            <Button variant="contained" onClick={handleSubmit} disabled={isLoading} sx={{   borderRadius: "8px", backgroundColor: "#6e41e2", "&:hover": {   backgroundColor: "#5835b5", },"&.Mui-disabled": {  backgroundColor: "#ded5f7",  color: "#ffffff", },}} >{isLoading ? <CircularProgress size={24} color="inherit" /> : "Submit ✓"}</Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default RegisterClinician;
