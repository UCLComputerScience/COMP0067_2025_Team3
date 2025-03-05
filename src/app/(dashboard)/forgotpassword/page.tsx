"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useTheme } from "@mui/material/styles";
import { requestPasswordReset, verifyResetCode, resetPassword } from "@/actions/userActions";
import { Box, Button, TextField, Typography, Paper, Container, CircularProgress } from "@mui/material";

const ForgotPasswordPage: React.FC = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [error, setError] = useState("");

  const handleRequestCode = async () => {
    setLoading(true);
    setError("");
    const result = await requestPasswordReset(email);
    setLoading(false);

    if (result.success) {
      setStep(2);
    } else {
      setError(result.error || "Failed to send verification code.");
    }
  };

  const handleVerifyCode = async () => {
    setLoading(true);
    setError("");
    const result = await verifyResetCode(email, code);
    setLoading(false);

    if (result.success) {
      setStep(3);
    } else {
      setError(result.error || "Invalid or expired verification code.");
    }
  };

  const handleResetPassword = async () => {
    setLoading(true);
    setError("");
    const result = await resetPassword(email, newPassword);
    setLoading(false);

    if (result.success) {
      alert("Password reset successful. Redirecting to login...");
      router.push("/login");
    } else {
      setError(result.error || "Failed to reset password.");
    }
  };
  const theme = useTheme();

  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh", justifyContent: "center", alignItems: "center", backgroundColor: theme.palette.background.default,  }}>
    <Container component="main" sx={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh" }}>
    <Paper elevation={6} sx={{ padding: 4, maxWidth: 400, width: "100%", textAlign: "center", backgroundColor: theme.palette.background.paper,  color: theme.palette.text.primary, }}>
    <Typography variant="h4" fontWeight="bold" gutterBottom>Forgot Password</Typography>
        {step === 1 && (
            <>
              <TextField fullWidth label="Registered Email" type="email" variant="outlined" margin="normal" value={email} onChange={(e) => setEmail(e.target.value)}/>
              <Button  fullWidth  variant="contained"  onClick={handleRequestCode}  disabled={loading}  sx={{ marginTop: 3, padding: 1.5, backgroundColor: "#6c4af7", "&:hover": { backgroundColor: "#5633e3" } }}> {loading ? <CircularProgress size={24} color="inherit" /> : "Send Verification Code"} </Button>
            </>
          )}
  
        {step === 2 && (
            <>
              <TextField fullWidth label="Verification Code" type="text"  variant="outlined"  margin="normal"  value={code}  onChange={(e) => setCode(e.target.value)}/>
              <Button  fullWidth  variant="contained"  onClick={handleVerifyCode} disabled={loading}  sx={{ marginTop: 3, padding: 1.5, backgroundColor: "#6c4af7", "&:hover": { backgroundColor: "#5633e3" } }} > {loading ? <CircularProgress size={24} color="inherit" /> : "Verify Code"}</Button>
            </>
          )}
        {step === 3 && (
            <>
              <TextField fullWidth label="New Password" type="password" variant="outlined"  margin="normal"  value={newPassword}  onChange={(e) => setNewPassword(e.target.value)} />
              <Button  fullWidth  variant="contained"  onClick={handleResetPassword}  disabled={loading}  sx={{ marginTop: 3, padding: 1.5, backgroundColor: "#6c4af7", "&:hover": { backgroundColor: "#5633e3" } }}> {loading ? <CircularProgress size={24} color="inherit" /> : "Reset Password"}</Button>
            </>
          )}
        {error && (
            <Typography sx={{ marginTop: 1, fontSize: 14, textAlign: "center", color: "#ff3d3d", fontWeight: "bold" }}> {error} </Typography>
          )}
        </Paper>
      </Container>
    </Box>
  );
  
};


export default ForgotPasswordPage;

