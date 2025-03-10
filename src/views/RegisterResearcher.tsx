"use client";

import React, { useState } from "react";
import { Box, Typography, TextField, Button, Checkbox, FormControlLabel, Grid, Link, Paper} from "@mui/material";
//import ResearcherApplication from "./ResearcherApplication";

interface RegisterResearcherProps {
  onBack: () => void;
  accountType: string;
}

// Create the component as a regular function component
const RegisterResearcher = ({ onBack, accountType }: RegisterResearcherProps) => {
  console.log("Current account type:", accountType);
  const [step, setStep] = useState(0); // Changed from 2 to 0 to match the parent component's flow
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [isEmailValid, setIsEmailValid] = useState(true);
  const [isPasswordValid, setIsPasswordValid] = useState(true);
  const [isConfirmPasswordValid, setIsConfirmPasswordValid] = useState(true);
  
  const validateEmail = (value: string) => { 
    setEmail(value);
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; 
    setIsEmailValid(emailRegex.test(value));
  };

  const validatePassword = (value: string) => { 
    setPassword(value);
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_])[A-Za-z\d\W_]{8,}$/;
    setIsPasswordValid(passwordRegex.test(value));
  };

  const validateConfirmPassword = (value: string) => { 
    setConfirmPassword(value);
    setIsConfirmPasswordValid(value === password);
  };

  const handleNext = () => {
    setStep(1); // Changed from 3 to 1 to match expected flow
  };

  // submit application
  const handleSubmit = async () => { 
    const formData = {
      accountType: "researcher", 
      personalInfo: { firstName,lastName, email, password},
    };
  
    try {
      // send the API request
      const response = await fetch("/api/register-researcher", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
  
      // deal with API response 
      const data = await response.json();
      if (data.success) { 
        console.log('Researcher application submitted successfully!');
        alert("Application submitted successfully!");
      } else {
        console.error("Submission failed:", data.error);
        alert("Failed to submit application: " + data.error);
      }
    } catch (error) {
      console.error("Error submitting application:", error);
      alert("An error occurred while submitting the application.");
    }
  };

  // For Application step - commented out for now as ResearcherApplication component is not available
  // if (step === 1) {
  //   return <ResearcherApplication onBack={() => setStep(0)} onSubmit={handleSubmit} />;
  // }

  return (
    <Box sx={{ maxWidth: "600px", marginX: "auto" }}>
      <Typography variant="h3" fontWeight="bold" sx={{ marginBottom: 2 }}> Researcher Account Details</Typography>
      <Typography variant="h6" color="textSecondary" sx={{ marginBottom: 3 }}> Enter your account details below.</Typography>

      <Grid container spacing={2}>
        <Grid item xs={6}>
          <TextField 
            label="First name" 
            fullWidth 
            margin="normal" 
            value={firstName} 
            onChange={(e) => setFirstName(e.target.value)} 
          />
        </Grid>
        <Grid item xs={6}>
          <TextField 
            label="Last name" 
            fullWidth 
            margin="normal" 
            value={lastName} 
            onChange={(e) => setLastName(e.target.value)} 
          />
        </Grid>
      </Grid>

      <TextField 
        label="Email" 
        type="email" 
        fullWidth 
        margin="normal" 
        value={email} 
        onChange={(e) => validateEmail(e.target.value)} 
        error={!isEmailValid} 
        helperText={!isEmailValid ? "Invalid email format" : ""} 
      />
      
      <TextField 
        label="Password" 
        type="password" 
        fullWidth 
        margin="normal" 
        value={password} 
        onChange={(e) => validatePassword(e.target.value)} 
        error={!isPasswordValid} 
        helperText={!isPasswordValid ? "Must contain upper/lowercase letters, numbers, special symbols (8+ characters)" : ""} 
      />
      
      <TextField 
        label="Confirm password" 
        type="password" 
        fullWidth 
        margin="normal" 
        value={confirmPassword} 
        onChange={(e) => validateConfirmPassword(e.target.value)} 
        error={!isConfirmPasswordValid} 
        helperText={!isConfirmPasswordValid ? "Passwords do not match" : ""} 
      />

      {/* Privacy Policy */}
      <FormControlLabel
        control={<Checkbox checked={agreeTerms} onChange={(e) => setAgreeTerms(e.target.checked)} />}
        label={<Typography variant="body1">I agree to <Link href="#">privacy policy & terms</Link></Typography>}
      />

      {/* Button */}
      <Box sx={{ display: "flex", justifyContent: "space-between", marginTop: 3 }}>
        <Button variant="contained" onClick={onBack}>← Previous</Button>
        <Button 
          variant="contained" 
          disabled={!agreeTerms || !isEmailValid || !isPasswordValid || !isConfirmPasswordValid || !firstName || !lastName} 
          onClick={step === 0 ? handleNext : handleSubmit} 
        >
          {step === 0 ? "Next →" : "Submit →"}
        </Button>
      </Box>
      
      {/* If you need to render the ResearcherApplication component in step 1: */}
      {step === 1 && (
        <Box sx={{ marginTop: 4 }}>
          <Typography variant="h3" fontWeight="bold" sx={{ marginBottom: 2 }}>Application</Typography>
          <Typography variant="body1">
            Please provide additional information about your research interests and credentials.
          </Typography>
          {/* Application form fields would go here */}
          <Box sx={{ display: "flex", justifyContent: "space-between", marginTop: 3 }}>
            <Button variant="contained" onClick={() => setStep(0)}>← Previous</Button>
            <Button
              variant="contained"
              onClick={handleSubmit}
            >
              Submit Application →
            </Button>
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default RegisterResearcher;
