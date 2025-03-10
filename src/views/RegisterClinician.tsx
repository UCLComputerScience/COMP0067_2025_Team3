"use client";

import React, { useState } from "react";
import { Box, Typography, TextField, Button, Checkbox, FormControlLabel, Grid, Link, MenuItem, Select, InputLabel, FormControl, CircularProgress, Dialog, DialogTitle, DialogContent, DialogActions} from "@mui/material";

// Define the props interface
interface RegisterClinicianProps {
  onBack: () => void;
  accountType: string;
}

// Create the component as a regular function component
const RegisterClinician = ({ onBack, accountType }: RegisterClinicianProps) => {
  console.log("Current account type:", accountType);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [customProfession, setCustomProfession] = useState("");
  
  // Form states
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [profession, setProfession] = useState("");
  const [registrationNumber, setRegistrationNumber] = useState("");
  const [institution, setInstitution] = useState("");
  const [formError, setFormError] = useState("");

  // **🔹 DialogMessage**
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogMessage, setDialogMessage] = useState("");

  const handleSubmit = async () => {
    // Form checking
    if (!firstName.trim() || !lastName.trim()) { setFormError("Please enter your first and last name.");  return;}
    if (!agreeTerms) { setFormError("You must agree to the privacy policy and terms.");  return; }
    if (password !== confirmPassword) { setFormError("Passwords do not match."); return;}

    setLoading(true);
    setFormError("");

    try {
      console.log("Send data to back end:", { 
        accountType, 
        firstName, 
        lastName, 
        email, 
        password, 
        customProfession, 
        registrationNumber, 
        institution,
      });

      const finalProfession = profession === "Other" ? customProfession : profession;

      // **POST request**
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          accountType, 
          firstName, 
          lastName, 
          email, 
          password, 
          profession: finalProfession, 
          registrationNumber, 
          institution 
        }),
      });

      console.log("Request sent, response status.:", res.status);

      const data = await res.json();
      console.log("Data returned by the server:", data);

      setLoading(false);

      if (data.success) {
        setDialogMessage(`Successful！Welcome to Spider!,${data.user?.firstName || "New user"}!`);
        setOpenDialog(true);
      } else {
        if (data.error && data.error.includes("already registered")) { 
          setDialogMessage("⚠️ This email is already registered. Please log in instead."); 
          setOpenDialog(true);
        } else { 
          setFormError(data.error || "Registration failed, please try again later."); 
        }
      }
    } catch (error) {
      console.error("Registration request error.", error);
      setLoading(false);
      setFormError("An error occurred during the submission process, please check your internet connection and try again!");
    }
  };

  return (
    <Box sx={{ maxWidth: "600px", marginX: "auto" }}>
      <Typography variant="h3" fontWeight="bold" sx={{ marginBottom: 2 }}>Account Details</Typography>
      <Typography variant="h6" color="textSecondary" sx={{ marginBottom: 3 }}>Enter your account details below.</Typography>

      {/* Dialog ** */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>⚠ Notification</DialogTitle>
        <DialogContent> <Typography>{dialogMessage}</Typography> </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)} color="primary">OK</Button>
          <Button href="/login" variant="contained" sx={{  backgroundColor: "#6C4AF7", "&:hover": { backgroundColor: "#5633E3" } }} > Go to Login</Button> 
        </DialogActions>
      </Dialog>

      {/* Error message */}
      {formError && (
        <Typography color="error" sx={{ marginBottom: 2 }}>
          {formError}
        </Typography>
      )}

      <Grid container spacing={2}>
        <Grid item xs={6}>
          <TextField label="First name" fullWidth margin="normal" value={firstName} onChange={(e) => setFirstName(e.target.value)} required /> 
        </Grid>
        <Grid item xs={6}> 
          <TextField label="Last name" fullWidth margin="normal" value={lastName} onChange={(e) => setLastName(e.target.value)} required />
        </Grid>
      </Grid>

      {/* Email & Password, professional information, */}
      <TextField label="Email" type="email" fullWidth margin="normal" required value={email} onChange={(e) => setEmail(e.target.value)} />
      <TextField label="Password" type="password" fullWidth margin="normal" required value={password} onChange={(e) => setPassword(e.target.value)} />
      <TextField label="Confirm password" type="password" fullWidth margin="normal" required value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />

      <Typography variant="h6" fontWeight="bold" sx={{ marginTop: 2 }}>Professional Information</Typography>

      <FormControl fullWidth margin="normal">
        <InputLabel>Profession</InputLabel>
        <Select
            value={profession}
            onChange={(e) => setProfession(e.target.value as string)} 
            label="Profession">
            <MenuItem value="General Practitioner">General Practitioner</MenuItem>
            <MenuItem value="Internist">Internist</MenuItem>
            <MenuItem value="Surgeon">Surgeon</MenuItem>
            <MenuItem value="Pediatrician">Pediatrician</MenuItem>
            <MenuItem value="Neurologist">Neurologist</MenuItem>
            <MenuItem value="Other">Other</MenuItem>
        </Select>
      </FormControl>

      {/* The manual input box is displayed only when 'Other' is selected for profession.  */}
      {profession === "Other" && (
        <TextField 
          label="Please specify your profession"
          fullWidth 
          margin="normal" 
          value={customProfession} 
          onChange={(e) => setCustomProfession(e.target.value)} 
        />
      )}
      
      <TextField 
        label="Registration Number" 
        fullWidth 
        margin="normal" 
        value={registrationNumber} 
        onChange={(e) => setRegistrationNumber(e.target.value)} 
      />
      
      <TextField 
        label="Institution" 
        fullWidth 
        margin="normal" 
        value={institution} 
        onChange={(e) => setInstitution(e.target.value)} 
      />

      {/* Privacy Policy */}
      <FormControlLabel 
        control={<Checkbox checked={agreeTerms} onChange={(e) => setAgreeTerms(e.target.checked)} />} 
        label={<Typography variant="body1">I agree to <Link href="#">privacy policy & terms</Link></Typography>} 
      />

      {/* Buttons */}
      <Box sx={{ display: "flex", justifyContent: "space-between", marginTop: 3 }}>
        <Button variant="contained" onClick={onBack} disabled={loading}>← Previous</Button>
        <Button 
          variant="contained" 
          disabled={loading} 
          onClick={handleSubmit}
        > 
          {loading ? <CircularProgress size={24} color="inherit" sx={{ mr: 1 }} /> : "Submit →"} 
        </Button>
      </Box>
    </Box>
  );
};

export default RegisterClinician;
