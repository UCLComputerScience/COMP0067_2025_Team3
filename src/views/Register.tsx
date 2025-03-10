"use client";

import Stack from "@mui/material/Stack";
import RegisterPatient from "./RegisterPatient"; 
import RegisterClinician from "./RegisterClinician"; 
import RegisterResearcher from "./RegisterResearcher"; 
import React, { useState, useEffect } from "react";
import { Grid, Box, Typography, Radio, RadioGroup, FormControlLabel, Button, Stepper, Step, StepLabel } from "@mui/material";


const Register = () => {  // Remove React.FC type annotation to avoid conflicts
  const [mounted, setMounted] = useState(false);
  const [step, setStep] = useState(0);  // Remove type annotation
  const [accountType, setAccountType] = useState("patient");  // Remove type annotation
  const [completedSteps, setCompletedSteps] = useState<boolean[]>([]);  // Remove type annotation
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;
  console.log("Current Step:", step);
console.log("Current Account Type:", accountType);
console.log("RegisterPatient Component:", RegisterPatient);
console.log("RegisterPatient:", RegisterPatient);


  //active steps
  const getSteps = () => {
    switch (accountType) {
      case "patient":
        return ["Account Type", "Account Details", "Data Privacy"];
      case "clinician":
        return ["Account Type", "Account Details"];
      case "researcher":
        return ["Account Type", "Account Details", "Application"];
      default:
        return ["Account Type"];
    }
  };

  const steps = getSteps(); 
  const maxStep = steps.length - 1; 

  // logic about next button
  const handleNext = () => {
    if (step < maxStep) {
      setCompletedSteps((prev) => {
        const newCompleted = [...prev];
        newCompleted[step] = true; //current step marked (state) ✅
        return newCompleted;
      });
      setStep((prevStep) => prevStep + 1);
    }
  };
  
  // logic about previous button
  const handlePrevious = () => {
    if (step > 0) {
      setStep((prevStep) => prevStep - 1);
    }
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh", width: "100%" }}>
      <Grid container sx={{ flex: 1 }}>
        {/* **Left side: Logo** */}
        <Grid item xs={4} sx={{ backgroundColor: "#f8f9fc", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Box sx={{ textAlign: "center" }}>
            <img src="/images/pages/Frame_16.png" alt="Logo" width="320px" />
          </Box>
        </Grid>

        {/* **Right side: form** */}
        <Grid item xs={8} sx={{ display: "flex", flexDirection: "column", justifyContent: "center", paddingX: 10 }}>
          {/* **steps bar** */}
          <Box sx={{ 
            marginBottom: 30, 
            display: "flex", 
            justifyContent: "center", 
            width: "100%", 
            marginLeft: "5%", 
            paddingRight: "0" 
          }}>
            <Stepper 
              activeStep={step} 
              alternativeLabel 
              sx={{ 
                width: "100%", 
                '& .MuiStepConnector-line': {
                  minLength: 70, 
                  borderTopWidth: 1, 
                },
                '& .MuiStepLabel-iconContainer': {
                  padding: 0, 
                },
                '& .MuiStepLabel-labelContainer': {
                  width: '100%', 
                }
              }}
            >
              {steps.map((label, index) => (
                <Step key={index} completed={completedSteps[index]}>
                  <StepLabel>
                    <Typography 
                      variant="h6" 
                      sx={{ 
                        fontSize: "16px",
                        fontWeight: "medium",
                        width: "100%",
                        textAlign: "center",
                        mt: 1
                      }}
                    >
                      {label}
                    </Typography>
                  </StepLabel>
                </Step>
              ))}
            </Stepper>
          </Box>

          {/* **Account type options** */}
          {step === 0 && (
            <Box sx={{ marginLeft: 15 }}>
              <Typography variant="h3" fontWeight="bold">Account Type</Typography>
              <Typography variant="h5" color="textSecondary" sx={{ marginBottom: 5 }}>Choose your account type.</Typography>

              <RadioGroup value={accountType} onChange={(e) => setAccountType(e.target.value)}>
                <Stack spacing={8}>
                  <FormControlLabel value="patient" control={<Radio sx={{ transform: "scale(1.5)" }} />} label={<Typography variant="h5">Patient</Typography>} />
                  <FormControlLabel value="clinician" control={<Radio sx={{ transform: "scale(1.5)" }} />} label={<Typography variant="h5">Clinician</Typography>} />
                  <FormControlLabel value="researcher" control={<Radio sx={{ transform: "scale(1.5)" }} />} label={<Typography variant="h5">Researcher</Typography>} />
                </Stack>
              </RadioGroup>

              <Box sx={{ display: "flex", justifyContent: "space-between", marginTop: 3, paddingX: 8 }}>
                <Button variant="contained" size="large" onClick={handlePrevious} sx={{ fontSize: "20px", paddingX: 1, paddingY: 1.5, backgroundColor: "#6C4AF7", color: "white","&:hover": { backgroundColor: "#5633E3" } }}>← Previous</Button>
                <Button variant="contained" size="large" onClick={handleNext} sx={{ fontSize: "20px", paddingX: 7, paddingY: 1.5, backgroundColor: "#6C4AF7", "&:hover": { backgroundColor: "#5633E3" } }}>Next →</Button>
              </Box>
            </Box>
          )}

          {step === 1 && accountType === "patient" && <RegisterPatient onBack={handlePrevious} accountType={accountType} />}
          {step === 1 && accountType === "clinician" && <RegisterClinician onBack={handlePrevious} accountType={accountType} />}
          {step === 1 && accountType === "researcher" && <RegisterResearcher onBack={handlePrevious} accountType={accountType} />}

        </Grid>
      </Grid>
    </Box>
  );
};

export default Register;


