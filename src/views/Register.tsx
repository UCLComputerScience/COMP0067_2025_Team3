"use client";

import debounce from "lodash/debounce";
import Stack from "@mui/material/Stack";
import { useRouter } from "next/navigation";
import RegisterPatient from "./RegisterPatient";
import RegisterClinician from "./RegisterClinician";
import RegisterResearcher from "./RegisterResearcher";
import { SelectChangeEvent } from '@mui/material/Select';
import VisibilityIcon from "@mui/icons-material/Visibility";
import React, { useState, useEffect, useCallback } from "react";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import { registerUser, checkUserDuplicates } from "@/actions/registerActions";
import { Grid, Box, Typography, Radio, RadioGroup,FormControlLabel, Button, Stepper, Step, StepLabel, TextField, Checkbox, Link, InputAdornment, IconButton, Snackbar, Alert, CircularProgress, Select, MenuItem, InputLabel, FormControl,} from "@mui/material";


// Define country codes
const countryCodes = [ { code: "+44", country: "United Kingdom", length: 10 }, { code: "+1", country: "United States", length: 10 }, { code: "+86", country: "China", length: 11 }, { code: "+91", country: "India", length: 10 }, { code: "+33", country: "France", length: 9 },];

// Define form interfaces
export interface AccountDetailsForm { firstName: string; lastName: string; email: string; password: string; confirmPassword: string; dateOfBirth?: string; address?: string; countryCode: string;  phoneNumber?: string; registrationNumber?: string; institution?: string; profession?: string;}
interface FormErrors { firstName: string; lastName: string; email: string; password: string; confirmPassword: string; dateOfBirth?: string; address?: string; phoneNumber?: string; registrationNumber?: string; institution?: string; profession?: string;}
interface DuplicateCheckResult { emailExists: boolean; phoneExists: boolean; registrationNumberExists: boolean;}

const Register = () => {
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
  const [formData, setFormData] = useState<AccountDetailsForm>({ firstName: "", lastName: "", email: "", password: "", confirmPassword: "", dateOfBirth: "", address: "", countryCode: "+44",  phoneNumber: "", registrationNumber: "", institution: "", profession: "",});
  const [formErrors, setFormErrors] = useState<FormErrors>({ firstName: "", lastName: "", email: "", password: "", confirmPassword: "", dateOfBirth: "", address: "", phoneNumber: "", registrationNumber: "", institution: "", profession: "",});
 
 

  // Define debouncedCheckDuplicates 
  const debouncedCheckDuplicates = useCallback(
    debounce(async (email: string, phoneNumber: string, registrationNumber: string) => {
      if (email.trim() || phoneNumber.trim() || registrationNumber.trim()) {
        const fullPhoneNumber = phoneNumber ? `${formData.countryCode}${phoneNumber}` : "";
        const result: DuplicateCheckResult = await checkUserDuplicates( email, fullPhoneNumber, registrationNumber);
        setFormErrors((prev) => ({
          ...prev,
          email: result.emailExists ? "This email already exists" : prev.email,
          phoneNumber: result.phoneExists ? "The phone number already exists" : prev.phoneNumber,
          registrationNumber: result.registrationNumberExists
            ? "The Registration Number already exists"
            : prev.registrationNumber,
        }));
      }
    }, 500),
    [formData.countryCode]
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

  const validateForm = (fieldName?: string) => {
    const errors: FormErrors = { ...formErrors };
    let isValid = true;
    if (!fieldName || fieldName === "firstName") { errors.firstName = !formData.firstName.trim() ? "First name is required" : ""; isValid = isValid && !errors.firstName;}
    if (!fieldName || fieldName === "lastName") { errors.lastName = !formData.lastName.trim() ? "Last name is required" : ""; isValid = isValid && !errors.lastName}
    if (!fieldName || fieldName === "email") {errors.email = !formData.email.trim()? "Email is required": !/^\S+@\S+\.\S+$/.test(formData.email)? "Please enter a valid email address": "";isValid = isValid && !errors.email;}
    if (!fieldName || fieldName === "password") {errors.password = !formData.password? "Password is required": formData.password.length < 8? "Password must be at least 8 characters": "";isValid = isValid && !errors.password;}
    if (!fieldName || fieldName === "confirmPassword") { errors.confirmPassword = formData.password !== formData.confirmPassword ? "Passwords do not match"  : "";isValid = isValid && !errors.confirmPassword}
    if (!fieldName || fieldName === "dateOfBirth") { errors.dateOfBirth = accountType === "patient" && !formData.dateOfBirth ? "Date of birth is required" : "";isValid = isValid && !errors.dateOfBirth;}
    if (!fieldName || fieldName === "registrationNumber") { errors.registrationNumber = accountType === "clinician" && !formData.registrationNumber?.trim()  ? "Registration number is required"  : "";isValid = isValid && !errors.registrationNumber;}
    if (!fieldName || fieldName === "institution") {errors.institution = (accountType === "clinician" || accountType === "researcher") && !formData.institution?.trim()   ? "Institution is required": ""; isValid = isValid && !errors.institution;}
    if (!fieldName || fieldName === "profession") {errors.profession = accountType === "clinician" && !formData.profession?.trim()  ? "Profession is required" : "";isValid = isValid && !errors.profession;}
    if (!fieldName || fieldName === "phoneNumber" || fieldName === "countryCode") {
       const country = countryCodes.find((c) => c.code === formData.countryCode);
       const phoneLength = country ? country.length : 10;
      
      if (formData.phoneNumber) {
        const cleanedPhoneNumber = formData.phoneNumber.replace(/\D/g, '');
        if (cleanedPhoneNumber !== formData.phoneNumber) {
          setFormData(prev => ({
            ...prev,
            phoneNumber: cleanedPhoneNumber
          }));
        }        
        const isValidDigits = /^\d+$/.test(cleanedPhoneNumber);
        const isValidLength = cleanedPhoneNumber.length === phoneLength;
               
        errors.phoneNumber = !isValidDigits 
          ? "Phone numbers can only contain digits" 
          : !isValidLength 
            ? `The length of the phone number should be ${phoneLength} bits.` 
            : "";
      } else { errors.phoneNumber = ""; }  isValid = isValid && !errors.phoneNumber;}
    setFormErrors(errors);
    return isValid;
  };

  // Use Effects
  useEffect(() => { setMounted(true);
    return () => { setSuccess(null); setError(null);
    };
  }, []);

  useEffect(() => { setSuccess(null);setError(null);
  }, [step, accountType]);

  useEffect(() => { validateForm("confirmPassword");
  }, [formData.password, formData.confirmPassword]);

  if (!mounted) return null;

  const steps = getSteps(accountType);
  const maxStep = steps.length - 1;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    if (name === "phoneNumber") { setFormData((prev) => ({ ...prev, [name]: value,}));
    } else { setFormData((prev) => ({...prev, [name]: value.trim(), }));}
    
    setTimeout(() => {
      validateForm(name);
      
      if (name === "email" || name === "phoneNumber" || name === "registrationNumber") {
        debouncedCheckDuplicates(
          name === "email" ? value : formData.email || "",
          name === "phoneNumber" ? `${formData.countryCode}${value}` : formData.phoneNumber ? `${formData.countryCode}${formData.phoneNumber}` : "",
          accountType === "clinician" && name === "registrationNumber" ? value : formData.registrationNumber || ""
        );
      }
    }, 0);
  };
  
  const handleSelectChange = (event: React.ChangeEvent<HTMLInputElement> | SelectChangeEvent<string>, child?: React.ReactNode) => {
    const name = event.target.name as keyof AccountDetailsForm;
    const value = event.target.value as string;
    setFormData((prev) => ({ ...prev, [name]: value,}));
    setTimeout(() => { validateForm(name as string);
      if (name === "countryCode") { debouncedCheckDuplicates(  formData.email || "", formData.phoneNumber ? `${value}${formData.phoneNumber}` : "", accountType === "clinician" ? formData.registrationNumber || "" : "");}}, 0);};
  const handleTogglePasswordVisibility = () => { setShowPassword((prev) => !prev)};
  const handleToggleConfirmPasswordVisibility = () => { setShowConfirmPassword((prev) => !prev);};
  const handleNext = async () => {setSuccess(null);
    if (step === 1) {
      if (!validateForm() || !agreeTerms) {
        return;
      }
    
      try {  setIsLoading(true); setError(null);
    
        // The same registration logic for all usertypes
        const fullPhoneNumber = formData.phoneNumber
          ? `${formData.countryCode}${formData.phoneNumber}`
          : "";
        const result = await registerUser({  firstName: formData.firstName, lastName: formData.lastName, email: formData.email, password: formData.password, dateOfBirth: formData.dateOfBirth || "",
          address: formData.address,
          phoneNumber: fullPhoneNumber,
          registrationNumber:
            accountType === "clinician" ? formData.registrationNumber : undefined,
          profession: accountType === "clinician" ? formData.profession : undefined,
          institution:
            accountType === "clinician" || accountType === "researcher"
              ? formData.institution
              : undefined,
          accountType,
        });
    
        if (!result.success) { throw new Error(result.error || "Failed to register user");}
        setUserId(result?.userId || null);
      } catch (err) {
        console.error("Registration error:", err);
        setError(err instanceof Error ? err.message : "An unexpected error occurred");
        setIsLoading(false);
        return;
      } finally {
        setIsLoading(false);
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
        <Button  variant="contained" size="large" onClick={handlePrevious} sx={{ fontSize: "20px", paddingX: 1, paddingY: 1.5, backgroundColor: "#6C4AF7", color: "white", "&:hover": { backgroundColor: "#5633E3" }, }}> ← Previous</Button>
        <Button variant="contained" size="large" onClick={handleNext} sx={{   fontSize: "20px",  paddingX: 7,  paddingY: 1.5, backgroundColor: "#6C4AF7",  "&:hover": { backgroundColor: "#5633E3" }, }}> Next →</Button></Box></Box>);

  const renderAccountDetailsStep = () => (
    <Box sx={{ maxWidth: "600px", marginX: "auto" }}>
      <Typography variant="h4" fontWeight="bold" sx={{ marginBottom: 1 }}>  Account Details </Typography>
      <Typography variant="body1" color="textSecondary" sx={{ marginBottom: 3 }}> Enter your account details below.</Typography>
      <Grid container spacing={2}>
        <Grid item xs={6}> <TextField label="First name" name="firstName" fullWidth variant="outlined" value={formData.firstName} onChange={handleInputChange} error={!!formErrors.firstName} helperText={formErrors.firstName} sx={{  mb: 2, "& .MuiOutlinedInput-root": {   borderRadius: "8px", }, }} /></Grid>
        <Grid item xs={6}> <TextField label="Last name" name="lastName" fullWidth variant="outlined" value={formData.lastName} onChange={handleInputChange} error={!!formErrors.lastName} helperText={formErrors.lastName} sx={{  mb: 2, "& .MuiOutlinedInput-root": {   borderRadius: "8px", }, }} /></Grid>
        <Grid item xs={12}><TextField label="Email" name="email" type="email" fullWidth variant="outlined" value={formData.email} onChange={handleInputChange} error={!!formErrors.email} helperText={formErrors.email} sx={{   mb: 2, "& .MuiOutlinedInput-root": {    borderRadius: "8px",  },}}/></Grid>
        <Grid item xs={12}>
          <TextField label="Address"name="address" fullWidth variant="outlined" value={formData.address}  onChange={handleInputChange}  error={!!formErrors.address}  helperText={formErrors.address}  sx={{    mb: 2,  "& .MuiOutlinedInput-root": {    borderRadius: "8px", }, }}/></Grid>
        <Grid item xs={12}><Box sx={{ display: "flex", alignItems: "center", gap: 1 }}><FormControl sx={{ minWidth: 120 }}><InputLabel id="country-code-label">Country Code</InputLabel>
        <Select labelId="country-code-label"name="countryCode"value={formData.countryCode}onChange={handleSelectChange} label="Country Code"sx={{ borderRadius: "8px", height: "56px",  }}>{countryCodes.map((country) => ( <MenuItem key={country.code} value={country.code}>  {country.code} ({country.country})</MenuItem>))}</Select>
    </FormControl>
    <TextField label="Phone Number" name="phoneNumber" fullWidth variant="outlined" value={formData.phoneNumber} onChange={handleInputChange}  error={!!formErrors.phoneNumber} helperText={formErrors.phoneNumber} sx={{   mb: 2, "& .MuiOutlinedInput-root": {   borderRadius: "8px",  },}}/></Box></Grid>
        <Grid item xs={12}> <TextField label="Password" name="password" type={showPassword ? "text" : "password"}fullWidth variant="outlined" value={formData.password} onChange={handleInputChange} error={!!formErrors.password} helperText={formErrors.password} InputProps={{ endAdornment: (
              <InputAdornment position="end"><IconButton onClick={handleTogglePasswordVisibility} edge="end" > {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}</IconButton></InputAdornment> ),}}sx={{ mb: 2,"& .MuiOutlinedInput-root": { borderRadius: "8px", },}}/>
       </Grid>
        <Grid item xs={12}>
          <TextField label="Confirm password" name="confirmPassword" type={showConfirmPassword ? "text" : "password"} fullWidth variant="outlined" value={formData.confirmPassword} onChange={handleInputChange} error={!!formErrors.confirmPassword} helperText={formErrors.confirmPassword} InputProps={{ endAdornment: (
                <InputAdornment position="end"><IconButton onClick={handleToggleConfirmPasswordVisibility} edge="end">{showConfirmPassword ? <VisibilityOffIcon /> : <VisibilityIcon />} </IconButton></InputAdornment> ),}}sx={{ mb: 2, "& .MuiOutlinedInput-root": {   borderRadius: "8px", }, }}/></Grid>

        {accountType === "patient" && (
          <Grid item xs={12}>
            <TextField label="Date of birth" name="dateOfBirth"type="date"fullWidth variant="outlined" value={formData.dateOfBirth} onChange={handleInputChange} error={!!formErrors.dateOfBirth} helperText={formErrors.dateOfBirth} InputLabelProps={{ shrink: true }} sx={{   mb: 2,  "& .MuiOutlinedInput-root": { borderRadius: "8px",  }, }}/>
          </Grid>
        )}

        {accountType === "clinician" && (
          <>
            <Grid item xs={12}>
              <TextField label="Registration Number"  name="registrationNumber" fullWidth variant="outlined" value={formData.registrationNumber} onChange={handleInputChange} error={!!formErrors.registrationNumber} helperText={formErrors.registrationNumber} sx={{  mb: 2,  "& .MuiOutlinedInput-root": {  borderRadius: "8px",  }, }}/>
            </Grid>
            <Grid item xs={12}>
              <TextField label="Institution" name="institution"  fullWidth  variant="outlined"  value={formData.institution}  onChange={handleInputChange}  error={!!formErrors.institution}  helperText={formErrors.institution}  sx={{   mb: 2,  "& .MuiOutlinedInput-root": {    borderRadius: "8px", }, }} />
             </Grid>
            <Grid item xs={12}>
              <TextField label="Profession" name="profession"  fullWidth variant="outlined" value={formData.profession} onChange={handleInputChange} error={!!formErrors.profession} helperText={formErrors.profession} sx={{ mb: 2, "& .MuiOutlinedInput-root": {   borderRadius: "8px", }, }}/>
            </Grid>
          </>
        )}

        {accountType === "researcher" && (
          <Grid item xs={12}>
            <TextField label="Institution" name="institution"  fullWidth variant="outlined" value={formData.institution}onChange={handleInputChange} error={!!formErrors.institution} helperText={formErrors.institution} sx={{  mb: 2,  "& .MuiOutlinedInput-root": {   borderRadius: "8px", }, }}/>
          </Grid>
        )}
      </Grid>

      <FormControlLabel
        control={
          <Checkbox checked={agreeTerms} onChange={(e) => setAgreeTerms(e.target.checked)} sx={{ color: "#6e41e2","&.Mui-checked": { color: "#6e41e2", },}}/>}
        label={
          <Typography variant="body2"> I agree to <Link href="#" sx={{ color: "#6e41e2" }}>privacy policy & terms</Link></Typography>
        }sx={{ mb: 2 }} />

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
          {step === 2 && accountType === "patient" && (
            <RegisterPatient onBack={handlePrevious}  accountType={accountType} userId={userId}/>
          )}
          {step === 2 && accountType === "researcher" && ( <RegisterResearcher onBack={handlePrevious} accountType={accountType} userId={userId}/>           
          )}
          {step === 2 && accountType === "clinician" && (
          <RegisterClinician onBack={handlePrevious} accountType={accountType} userId={userId} formData={formData}

          />
        )}
        </Grid>
      </Grid>
    </Box>
  );
};

export default Register;
