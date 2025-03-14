"use client";

import debounce from "lodash/debounce";
import Stack from "@mui/material/Stack";
import { useRouter } from "next/navigation";
import {PatientRegister} from "./RegisterPatient";
import {DateOfBirthPicker} from "./DateOfBirthPicker";
import {ClinicianRegister} from "./RegisterClinician";
import {ResearcherRegister} from "./RegisterResearcher";
import {PrivacyPolicyTerms} from "./PrivacyPolicyTerms";
import { SelectChangeEvent } from '@mui/material/Select';
import React, { useState, useEffect, useCallback } from "react";
import { registerUser, checkUserDuplicates } from "@/actions/register/registerActions";
import { Grid, Box, Typography, Radio, RadioGroup,FormControlLabel, Button, Stepper, Step, StepLabel, TextField, Checkbox, Link, InputAdornment, IconButton, Snackbar, Alert, CircularProgress, Select, MenuItem, InputLabel, FormControl,} from "@mui/material";


// Define form interfaces
export interface AccountDetailsForm { firstName: string; lastName: string; email: string; password: string; confirmPassword: string; dateOfBirth?: string; address?: string; phoneNumber?: string; registrationNumber?: string; institution?: string; profession?: string;}
interface FormErrors { firstName: string; lastName: string; email: string; password: string; confirmPassword: string; dateOfBirth?: string; address?: string; phoneNumber?: string; registrationNumber?: string; institution?: string; profession?: string;}
interface DuplicateCheckResult { emailExists: boolean; phoneExists: boolean; registrationNumberExists: boolean;}

export const Register = () => {
  const router = useRouter();

  // Hooks must be called at the top level in a consistent order
  const [step, setStep] = useState(0);
  const [mounted, setMounted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [accountType, setAccountType] = useState("patient");
  const [userId, setUserId] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [completedSteps, setCompletedSteps] = useState<boolean[]>([]);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isPhoneFocused, setIsPhoneFocused] = useState(false);
  const [openPrivacyTerms, setOpenPrivacyTerms] = useState<boolean>(false);
  const [formData, setFormData] = useState<AccountDetailsForm>({ firstName: "", lastName: "", email: "", password: "", confirmPassword: "", dateOfBirth: "", address: "",  phoneNumber: "", registrationNumber: "", institution: "", profession: "",});
  const [formErrors, setFormErrors] = useState<FormErrors>({ firstName: "", lastName: "", email: "", password: "", confirmPassword: "", dateOfBirth: "", address: "", phoneNumber: "", registrationNumber: "", institution: "", profession: "",});
 
 

  // Define debouncedCheckDuplicates 
  const debouncedCheckDuplicates = useCallback(
    debounce(async (email: string, phoneNumber: string, registrationNumber: string) => {
      if (email.trim() || phoneNumber.trim() || registrationNumber.trim()) { const result: DuplicateCheckResult = await checkUserDuplicates( email, phoneNumber, registrationNumber);
        setFormErrors((prev) => ({ ...prev,
          email: result.emailExists ? "This email already exists" : prev.email,
          phoneNumber: result.phoneExists ? "The phone number already exists" : prev.phoneNumber,
          registrationNumber: result.registrationNumberExists
            ? "The Registration Number already exists"
            : prev.registrationNumber,
        }));
      }
    }, 500),
    []
  );

  // Define functions before useEffect
  const getSteps = (type: string) => {
    switch (type) {
      case "patient":
        return ["Account Type", "Account Details", "Data Privacy"];
      case "clinician":
        return ["Account Type", "Account Details","Complete Registration"];
      case "researcher":
        return ["Account Type", "Account Details", "Application"];
      default:
        return ["Account Type"];
    }
  };

  const handleOpenPrivacyTerms = (): void => {
    setOpenPrivacyTerms(true);
  };
  
  const handleClosePrivacyTerms = (): void => {
    setOpenPrivacyTerms(false);
  };

  const validateForm = (fieldName?: string) => {
    const errors: FormErrors = { ...formErrors };
    let isValid = true;
  
    if (!fieldName || fieldName === "firstName") {  errors.firstName = !formData.firstName.trim() ? "First name is required" : ""; isValid = isValid && !errors.firstName;}
    if (!fieldName || fieldName === "lastName") { errors.lastName = !formData.lastName.trim() ? "Last name is required" : ""; isValid = isValid && !errors.lastName;}
    if (!fieldName || fieldName === "email") { if (!formData.email.trim()) {
        errors.email = ""; 
      } else {  errors.email = !/^\S+@\S+\.\S+$/.test(formData.email) ? "Please enter a valid email address" : "";
      }isValid = isValid && !errors.email;
    }
    if (!fieldName || fieldName === "password") { if (!fieldName && !formData.password) {
        errors.password = "Password is required";
      } else if (formData.password && formData.password.length < 8) { errors.password = "Password must be at least 8 characters";
      } else { errors.password = "";
      } isValid = isValid && !errors.password;
    }
    if (!fieldName || fieldName === "confirmPassword") { 
      if (formData.password && formData.password !== formData.confirmPassword) { 
        console.log("Password:", formData.password);
        console.log("Confirm:", formData.confirmPassword);
        errors.confirmPassword = "Passwords do not match";  
      } else { 
        errors.confirmPassword = "";
      } 
      isValid = isValid && !errors.confirmPassword;
    }
    if (!fieldName || fieldName === "phoneNumber") { if (formData.phoneNumber) {
        const cleanedPhoneNumber = formData.phoneNumber.replace(/\D/g, '');
        const isValidDigits = /^\d+$/.test(cleanedPhoneNumber);
        const isValidLength = cleanedPhoneNumber.length === 10;        
        errors.phoneNumber = !isValidDigits 
          ? "Phone numbers can only contain digits" 
          : !isValidLength 
            ? "The length of the phone number should be 10 digits." 
            : "";
      } else { errors.phoneNumber = ""; 
      }isValid = isValid && !errors.phoneNumber;
}
    if ((!fieldName || fieldName === "dateOfBirth") && accountType === "patient") { errors.dateOfBirth = !fieldName && !formData.dateOfBirth ? "Date of birth is required" : ""; isValid = isValid && !errors.dateOfBirth;}
    if ((!fieldName || fieldName === "registrationNumber") && accountType === "clinician") {errors.registrationNumber = !fieldName && !formData.registrationNumber?.trim()  ? "Registration number is required"  : ""; isValid = isValid && !errors.registrationNumber;}
    if ((!fieldName || fieldName === "institution") &&   (accountType === "clinician" || accountType === "researcher")) {errors.institution = !fieldName && !formData.institution?.trim()  ? "Institution is required"   : ""; isValid = isValid && !errors.institution;}
    if ((!fieldName || fieldName === "profession") && accountType === "clinician") { errors.profession = !fieldName && !formData.profession?.trim()  ? "Profession is required" : ""; isValid = isValid && !errors.profession;}

    setFormErrors(errors);
    return isValid;
  };

  useEffect(() => { setMounted(true);
    return () => { setSuccess(null); setError(null);
    };
  }, []);

  useEffect(() => { setSuccess(null);setError(null);
  }, [step, accountType]);

  

  if (!mounted) return null;

  const steps = getSteps(accountType);
  const maxStep = steps.length - 1;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    console.log(`Input ${name}:`, value);
    setFormData((prev) => ({ ...prev, [name]: value }));
  
    if (name === "confirmPassword") { setTimeout(() => {
        if (formData.password !== value) { setFormErrors((prev) => ({ ...prev, confirmPassword: "Passwords do not match",}));
        } else { setFormErrors((prev) => ({ ...prev, confirmPassword: "",}));}
      }, 300); 
    } else {
      validateForm(name);
    }
  
    if ( (name === "email" && value.trim()) || (name === "phoneNumber" && value.trim()) || (name === "registrationNumber" && value.trim())) {
      debouncedCheckDuplicates( name === "email" ? value : formData.email || "", name === "phoneNumber" ? value : formData.phoneNumber || "", accountType === "clinician" && name === "registrationNumber" ? value : formData.registrationNumber || "");
    } else { setFormErrors((prev) => ({ ...prev,...(name === "email" && { email: "" }), ...(name === "phoneNumber" && { phoneNumber: "" }), ...(name === "registrationNumber" && { registrationNumber: "" }),
      }));
    }
  };
  
  const handleSelectChange = (event: React.ChangeEvent<HTMLInputElement> | SelectChangeEvent<string>, child?: React.ReactNode) => {
    const name = event.target.name as keyof AccountDetailsForm;
    const value = event.target.value as string;
    setFormData((prev) => ({ 
      ...prev, 
      [name]: value,
    }));
    setTimeout(() => { 
      validateForm(name as string);
    }, 0);
  };  const handleTogglePasswordVisibility = () => { setShowPassword((prev) => !prev)};
  const handleToggleConfirmPasswordVisibility = () => { setShowConfirmPassword((prev) => !prev);};
  const handleNext = async () => {setSuccess(null);
    if (step === 1) {
      if (!validateForm() || !agreeTerms) {
        return;
      }    
    }
    if (step < maxStep) {setCompletedSteps((prev) => {const newCompleted = [...prev]; newCompleted[step] = true; return newCompleted;});setStep((prevStep) => prevStep + 1);}};
  const handlePrevious = () => { if (step > 0) {setStep((prevStep) => prevStep - 1);}};
  const renderAccountTypeStep = () => (
    <Box sx={{ marginLeft: 15 }}>
      <Typography variant="h3" fontWeight="bold">  Account Type</Typography>
      <Typography variant="h5" color="textSecondary" sx={{ marginBottom: 5 }}> Choose your account type.</Typography>
      <RadioGroup value={accountType} onChange={(e) => setAccountType(e.target.value)}>
        <Stack spacing={8}>
          <FormControlLabel value="patient" control={<Radio sx={{ transform: "scale(1.5)" }} />} label={<Typography variant="h5">Patient</Typography>}/>
           <FormControlLabel value="clinician" control={<Radio sx={{ transform: "scale(1.5)" }} />} label={<Typography variant="h5">Clinician</Typography>}/>
          <FormControlLabel value="researcher" control={<Radio sx={{ transform: "scale(1.5)" }} />} label={<Typography variant="h5">Researcher</Typography>}/>
      </Stack>
      </RadioGroup>

      <Box sx={{ display: "flex", justifyContent: "space-between", marginTop: 3, paddingX: 8 }}>
      <Button   variant="outlined" onClick={handlePrevious}  sx={{  borderRadius: "8px",    borderColor: "#6e41e2",  color: "#6e41e2",  "&:hover": {    borderColor: "#5835b5",   backgroundColor: "rgba(110, 65, 226, 0.04)",   }, }}> ← Previous</Button>     
   <Button variant="contained" onClick={handleNext}  sx={{  borderRadius: "8px",    borderColor: "#6e41e2",   "&:hover": { borderColor: "#5835b5", }, "&.Mui-disabled": { backgroundColor: "#ded5f7", color: "#ffffff",   }, }}> Next →</Button></Box></Box>);

  const renderAccountDetailsStep = () => (
    <Box sx={{ maxWidth: "600px", marginX: "auto" }}>
      <Typography variant="h4" fontWeight="bold" sx={{ marginBottom: 1 }}>  Account Details </Typography>
      <Typography variant="body1" color="textSecondary" sx={{ marginBottom: 3 }}> Enter your account details below.</Typography>
      <Grid container spacing={2}>
        <Grid item xs={6}> <TextField label="First name" name="firstName" fullWidth variant="outlined" value={formData.firstName} onChange={handleInputChange} error={!!formErrors.firstName} helperText={formErrors.firstName} sx={{  mb: 2, "& .MuiOutlinedInput-root": {   borderRadius: "8px", }, }} /></Grid>
        <Grid item xs={6}> <TextField label="Last name" name="lastName" fullWidth variant="outlined" value={formData.lastName} onChange={handleInputChange} error={!!formErrors.lastName} helperText={formErrors.lastName} sx={{  mb: 2, "& .MuiOutlinedInput-root": {   borderRadius: "8px", }, }} /></Grid>
        <Grid item xs={12}><TextField label="Email" name="email" type="email" fullWidth variant="outlined" value={formData.email} onChange={handleInputChange} error={!!formErrors.email} helperText={formErrors.email} sx={{   mb: 2, "& .MuiOutlinedInput-root": {    borderRadius: "8px",  },}}/></Grid>
        <Grid item xs={12}> <TextField label="Address"name="address" fullWidth variant="outlined" value={formData.address}  onChange={handleInputChange}  error={!!formErrors.address}  helperText={formErrors.address}  sx={{    mb: 2,  "& .MuiOutlinedInput-root": {    borderRadius: "8px", }, }}/></Grid>
        <Grid item xs={12}>  <TextField  label="Phone Number"  name="phoneNumber"  fullWidth  variant="outlined"  value={formData.phoneNumber}  onChange={handleInputChange}  error={!!formErrors.phoneNumber}  helperText={formErrors.phoneNumber}  InputLabelProps={{    shrink: isPhoneFocused || !!formData.phoneNumber }} onFocus={() => setIsPhoneFocused(true)} onBlur={() => setIsPhoneFocused(!!formData.phoneNumber)} sx={{ mb: 2, "& .MuiOutlinedInput-root": {  borderRadius: "8px" }}} /> </Grid>
        <Grid item xs={12}><TextField label="Password" name="password" type="password"  fullWidth variant="outlined" value={formData.password} onChange={handleInputChange} error={!!formErrors.password} helperText={formErrors.password} sx={{ mb: 2, "& .MuiOutlinedInput-root": { borderRadius: "8px" } }}/></Grid>
        <Grid item xs={12}> <TextField label="Confirm password" name="confirmPassword" type="password"  fullWidth variant="outlined" value={formData.confirmPassword} onChange={handleInputChange} error={!!formErrors.confirmPassword} helperText={formErrors.confirmPassword} sx={{ mb: 2, "& .MuiOutlinedInput-root": { borderRadius: "8px" } }} /></Grid>
        {accountType === "patient" && (
          <Grid item xs={12}>
          <DateOfBirthPicker
            value={formData.dateOfBirth ? new Date(formData.dateOfBirth) : null} // 转换为 Date 对象
            onChange={(newDate) => {
              setFormData((prev) => ({
                ...prev,
                dateOfBirth: newDate ? newDate.toISOString().split("T")[0] : "",
              }));
              validateForm("dateOfBirth");
            }}
            label="Date of birth"
            error={!!formErrors.dateOfBirth}
            helperText={formErrors.dateOfBirth}
          />
        </Grid>        )}
        {accountType === "clinician" && (
          <>
            <Grid item xs={12}> <TextField label="Registration Number"  name="registrationNumber" fullWidth variant="outlined" value={formData.registrationNumber} onChange={handleInputChange} error={!!formErrors.registrationNumber} helperText={formErrors.registrationNumber} sx={{  mb: 2,  "& .MuiOutlinedInput-root": {  borderRadius: "8px",  }, }}/> </Grid>
            <Grid item xs={12}> <TextField label="Institution" name="institution"  fullWidth  variant="outlined"  value={formData.institution}  onChange={handleInputChange}  error={!!formErrors.institution}  helperText={formErrors.institution}  sx={{   mb: 2,  "& .MuiOutlinedInput-root": {    borderRadius: "8px", }, }} /></Grid>
            <Grid item xs={12}> <TextField label="Profession" name="profession"  fullWidth variant="outlined" value={formData.profession} onChange={handleInputChange} error={!!formErrors.profession} helperText={formErrors.profession} sx={{ mb: 2, "& .MuiOutlinedInput-root": {   borderRadius: "8px", }, }}/> </Grid>
          </>
        )}

        {accountType === "researcher" && (
          <Grid item xs={12}> <TextField label="Institution" name="institution"  fullWidth variant="outlined" value={formData.institution}onChange={handleInputChange} error={!!formErrors.institution} helperText={formErrors.institution} sx={{  mb: 2,  "& .MuiOutlinedInput-root": {   borderRadius: "8px", }, }}/></Grid>
        )}
      </Grid>

      <FormControlLabel
  control={
    <Checkbox checked={agreeTerms} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setAgreeTerms(e.target.checked)} sx={{ color: "#6e41e2","&.Mui-checked": { color: "#6e41e2", },}}/>}
  label={
    <Typography variant="body2"> I agree to <Link 
      component="button"
      variant="body2"
      onClick={handleOpenPrivacyTerms} 
      sx={{ color: "#6e41e2", textDecoration: "underline", border: "none", background: "none", p: 0, cursor: "pointer" }}
    >
      privacy policy & terms
    </Link></Typography>
  }
  sx={{ mb: 2 }} 
/>

      <Box sx={{ display: "flex", justifyContent: "space-between", marginTop: 3 }}>
        <Button variant="outlined" onClick={handlePrevious} disabled={isLoading} sx={{  borderRadius: "8px",  borderColor: "#6e41e2", color: "#6e41e2", "&:hover": {   borderColor: "#5835b5",  backgroundColor: "rgba(110, 65, 226, 0.04)",  }, }}> ← Previous</Button>
        <Button variant="contained"  onClick={handleNext} disabled={ !agreeTerms || isLoading || Object.values(formErrors).some((error) => error !== "") }sx={{ borderRadius: "8px",backgroundColor: "#6e41e2","&:hover": {  backgroundColor: "#5835b5",},"&.Mui-disabled": { backgroundColor: "#ded5f7",color: "#ffffff", },}}>
           {isLoading ? <CircularProgress size={24} color="inherit" /> : "Next →"} </Button>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh", width: "100%" }}>
      <Snackbar open={!!error} autoHideDuration={4000} onClose={() => setError(null)} anchorOrigin={{ vertical: "top", horizontal: "center" }} key="error-snackbar">
        <Alert severity="error" onClose={() => setError(null)}>  {error}</Alert>
      </Snackbar>

      <Snackbar open={!!success} autoHideDuration={4000} onClose={() => setSuccess(null)} anchorOrigin={{ vertical: "top", horizontal: "center" }} key="success-snackbar">
        <Alert severity="success" onClose={() => setSuccess(null)}> {success}</Alert>
      </Snackbar>

      <Grid container sx={{ flex: 1 }}>
        <Grid item xs={4} sx={{   backgroundColor: "#f8f9fc", display: "flex", alignItems: "center", justifyContent: "center", }}>
          <Box sx={{ textAlign: "center" }}> <img src="/images/pages/Frame_16.png" alt="Logo" width="320px" /></Box></Grid>
        <Grid item xs={8} sx={{   display: "flex",  flexDirection: "column",  justifyContent: "center",  paddingX: 10,}}>
          <Box sx={{  marginBottom: 30, display: "flex",  justifyContent: "center", width: "100%", marginLeft: "5%",  paddingRight: "0", }}>
            <Stepper activeStep={step} alternativeLabel sx={{  width: "100%","& .MuiStepConnector-line": {  minLength: 70, borderTopWidth: 1, },"& .MuiStepLabel-iconContainer": {  padding: 0, }, "& .MuiStepLabel-labelContainer": { width: "100%", },}}>
              {steps.map((label, index) => (
                <Step key={index} completed={completedSteps[index]}>
                  <StepLabel>
                    <Typography variant="h6" sx={{   fontSize: "16px",  fontWeight: "medium", width: "100%",  textAlign: "center", mt: 1, }} > {label}</Typography>
                  </StepLabel>
                </Step>
              ))}
            </Stepper>
          </Box>

          {step === 0 && renderAccountTypeStep()}
          {step === 1 && renderAccountDetailsStep()}
          {step === 2 && accountType === "patient" && ( <PatientRegister onBack={handlePrevious}  accountType={accountType} formData={formData}  userId={null}/>
          )}
          {step === 2 && accountType === "researcher" && ( <ResearcherRegister onBack={handlePrevious} accountType={accountType} formData={formData} userId={null}/>           
          )}
          {step === 2 && accountType === "clinician" && (<ClinicianRegister onBack={handlePrevious} accountType={accountType} formData={formData} userId={null}/>
        )}
        </Grid>
      </Grid>
      <PrivacyPolicyTerms open={openPrivacyTerms} onClose={handleClosePrivacyTerms} />
    </Box>
  );
};


