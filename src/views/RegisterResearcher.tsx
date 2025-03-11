"use client";


import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";
import { valibotResolver } from "@hookform/resolvers/valibot";
import { completeRegistration } from "@/actions/registerActions";
import { createApplication } from "@/actions/researcher/applicationAction";
import DataAccessApplicationContent from '@/components/DataAccessApplicationContent';
import { object, minLength, string, pipe, nonEmpty, array, file, date, InferInput } from 'valibot';
import { Box, Typography, Button, Alert, Dialog, DialogTitle, DialogContent,DialogActions,Card,CardContent,CircularProgress} from "@mui/material";

interface RegisterResearcherProps {
  onBack: () => void;
  accountType: string;
  userId: string | null;
}

// Form schema definition (from DataAccessApplicationForm)
export type FormValues = InferInput<typeof schema>;

const schema = object({
  researchTitle: pipe(
    string(),
    nonEmpty('This field is required'),
    minLength(3, 'Research Title must be at least 3 characters long')
  ),
  researchQuestion: pipe(
    string(),
    nonEmpty('This field is required'),
    minLength(3, 'Research Question must be at least 3 characters long')
  ),
  institution: pipe(string(), nonEmpty('This field is required')),
  summary: pipe(
    string(),
    nonEmpty('This field is required'),
    minLength(8, 'Summary must be at least 8 characters long')
  ),
  documents: pipe(array(file()), nonEmpty('This field is required')),
  demographicDataAccess: pipe(array(string())),
  questionnaireAccess: pipe(array(string())),
  dateRange: object({
    expectedStartDate: pipe(date('This field is required')),
    expectedEndDate: pipe(date('This field is required'))
  })
});

const RegisterResearcher: React.FC<RegisterResearcherProps> = ({ onBack, accountType, userId }) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [openSuccessDialog, setOpenSuccessDialog] = useState(false);
  const [openErrorDialog, setOpenErrorDialog] = useState(false);

  // Effect to control success message visibility
  useEffect(() => {
    setSuccess(null);
    return () => {
      setSuccess(null);
    };
  }, []);

  // Form handling with validation
  const { control, reset, handleSubmit, formState: { errors }} = useForm<FormValues>({ resolver: valibotResolver(schema), defaultValues: { researchTitle: '', researchQuestion: '', institution: '', summary: '', documents: [], demographicDataAccess: [], questionnaireAccess: [], dateRange: { expectedStartDate: undefined, expectedEndDate: undefined }}});

  // Handle form submission
  const onSubmit = async (data: FormValues) => { if (!userId) { setError("User registration incomplete. Please go back and try again."); setOpenErrorDialog(true);
      return;
    }
  
    try {
      setIsLoading(true);
      setError(null);
  
      // Complete the base registration for Researcher
      const registrationResult = await completeRegistration(userId, { researchConsent: false, clinicianAccess: false, selectedClinicians: []}, "Researcher");
  
      if (!registrationResult.success) { throw new Error(registrationResult.error || "Failed to complete registration");}

      // Prepare form data for application submission
      const formData = new FormData();

      // Handle date range data
      const { dateRange, ...rest } = data;
      if (dateRange.expectedStartDate) { formData.append('expectedStartDate', dateRange.expectedStartDate.toISOString());}
      if (dateRange.expectedEndDate) {formData.append('expectedEndDate', dateRange.expectedEndDate.toISOString());}

      // Add all other form fields to formData
      Object.entries(rest).forEach(([key, value]) => {
        if (Array.isArray(value)) {
          if (key === 'documents') {
            // Handle file uploads
            for (const file of value) {
              formData.append(key, file);
            }
          } else {
            // Handle other arrays
            value.forEach(item => formData.append(key, item));
          }
        } else if (value && typeof value === 'object') {
          Object.entries(value).forEach(([subKey, subValue]) => {
            if (subValue !== undefined) {
              formData.append(`${key}[${subKey}]`, subValue as string | Blob);
            }
          });
        } else if (value !== undefined) {
          formData.append(key, value as string | Blob);
        }
      });

      // Submit the researcher application
      const success = await createApplication(formData, userId);

      if (success) {
        setSuccess("Congratulations! Your account has been created successfully!");
        setOpenSuccessDialog(true); 
      } else {
        throw new Error("Application creation failed");
      }
    } catch (err) {
      console.error("Registration completion error:", err);
      setError(err instanceof Error ? err.message : "An unexpected error occurred");
      setOpenErrorDialog(true); 
      setIsLoading(false);
    }
  };

  const handleGoToLogin = () => {
    setOpenSuccessDialog(false); 
    router.push('/login'); 
  };

  return (
    <Box sx={{ maxWidth: "800px", marginX: "auto" }}>
      {/* Error and success notifications */}
      <Dialog open={openErrorDialog} onClose={() => setOpenErrorDialog(false)} aria-labelledby="error-dialog-title">
          <DialogTitle id="error-dialog-title">Error</DialogTitle>
          <DialogContent> <Typography variant="body1"> {error}</Typography></DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenErrorDialog(false)}  variant="contained" sx={{   bgcolor: '#6e41e2', color: 'white', '&:hover': { bgcolor: '#5835b5' }, borderRadius: '8px',}}>Close</Button>
            </DialogActions>
        </Dialog>
      
      <Dialog open={openSuccessDialog} onClose={() => setOpenSuccessDialog(false)} aria-labelledby="success-dialog-title">
          <DialogTitle id="success-dialog-title">Success</DialogTitle>
          <DialogContent> <Typography variant="body1"> {success} </Typography></DialogContent><DialogActions>
            <Button onClick={handleGoToLogin} variant="contained" sx={{ bgcolor: '#6e41e2', color: 'white', '&:hover': { bgcolor: '#5835b5' }, borderRadius: '8px',}}> Go to Login</Button>
          </DialogActions>
        </Dialog>
      
      {/* Application Form */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight="bold" sx={{ marginBottom: 2 }}> Research Application</Typography>
        <Typography variant="body1" color="textSecondary" sx={{ marginBottom: 4 }}> Please provide details about your research project to complete your registration.</Typography>
      </Box>

      <Card>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            {/* Data Access Application Content from the existing component */}
            <DataAccessApplicationContent control={control} errors={errors} />
            
            {/* Navigation Buttons */}
            <Box sx={{ display: "flex", justifyContent: "space-between", marginTop: 4 }}>
              <Button  variant="outlined"  onClick={onBack} disabled={isLoading} sx={{    borderRadius: '8px', borderColor: '#6e41e2',  color: '#6e41e2', '&:hover': {   borderColor: '#5835b5', backgroundColor: 'rgba(110, 65, 226, 0.04)',},}}> ← Previous</Button>
              <Box>
                <Button  onClick={() => reset()} disabled={isLoading} sx={{   mr: 2,  borderRadius: '8px',  borderColor: '#6e41e2',  color: '#6e41e2', }}>Reset</Button>
                <Button  type="submit" variant="contained"  disabled={isLoading} sx={{   bgcolor: '#6e41e2',  color: 'white',  '&:hover': { bgcolor: '#5835b5' }, borderRadius: '8px'}}>{isLoading ? ( <CircularProgress size={24} sx={{ color: 'white' }} /> ) : ('Submit ✓')}</Button>
              </Box>
            </Box>
          </form>
        </CardContent>
      </Card>
    </Box>
  );
};

export default RegisterResearcher;
