"use client";

import React, { useState, useEffect } from "react";
import { useTheme } from "@mui/material/styles";
import { useRouter } from "next/navigation";
import { loginUser, getCurrentUser } from "@/actions/userActions";
import { Box,Button,TextField,Checkbox,FormControlLabel,Typography,Container,Paper,Link,CircularProgress} from "@mui/material";
import Footer from "@/components/layout/horizontal/Footer";
import { Role } from "@prisma/client";

const LoginPageClient: React.FC = () => {
  const theme = useTheme();
  const router = useRouter();
  const mode = theme.palette.mode;
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [isClient, setIsClient] = useState(false);

  // 用于解决hydration错误，确保只在客户端渲染后执行localStorage相关操作
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Check login Information
  useEffect(() => {
    async function checkAuth() {
      const user = await getCurrentUser();
      if (user) {
        let role = user.role as string;  
        let redirectPath = "/dashboard"; // 默认路径
        
        if (role.toLowerCase() === "clinician") {
          redirectPath = "/clinician-allpatients";
        } else if (role.toLowerCase() === "admin") {
          redirectPath = "/admin-allusers";
        } else if (role.toLowerCase() === "researcher") {
          redirectPath = "/researcher-download";
        } else if (role.toLowerCase() === "patient") {
          redirectPath = "/my-records";
        }
        
        console.log("[CheckAuth] User role:", role);
        console.log("[CheckAuth] Redirecting to:", redirectPath);
        router.push(redirectPath);
      }
    }
    
    if (isClient) {
      checkAuth();
    }
  }, [isClient]);
  
  // obtain email and password - only after client-side hydration
  useEffect(() => {
    if (!isClient) return;
    
    const savedEmail = localStorage.getItem("rememberedEmail");
    const savedPassword = localStorage.getItem("rememberedPassword");
    const savedRememberMe = localStorage.getItem("rememberMe") === "true";
    
    if (savedEmail) setEmail(savedEmail);
    if (savedRememberMe) {
      setRememberMe(true);
      if (savedPassword) setPassword(savedPassword);
    }
  }, [isClient]);

  // Validate email format
  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email) && email.trim() !== "") {
      setEmailError("Please enter a valid email address");
      return false;
    } else {
      setEmailError("");
      return true;
    }
  };

  // Handle email change with validation
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newEmail = e.target.value;
    setEmail(newEmail);
    if (newEmail.trim() !== "") {
      validateEmail(newEmail);
    } else {
      setEmailError("");
    }
  };

  // login verification
  const validateForm = () => {
    setFormError("");
    if (!email.trim()) {
      setFormError("Enter your Email and Password");
      return false;
    }
    if (!password.trim()) {
      setFormError("Enter your password");
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setEmailError("Please enter a valid email address");
      return false;
    }
    return true;
  };

  const handleLogin = async () => {
    setFormError("");
    if (!validateForm()) {
      return;
    }
    setLoading(true);

    try {
      const result = await loginUser({ email, password, rememberMe });
      console.log("Login Response:", result); 

      if (!result.success) {
        setFormError(result.error || "Incorrect email or password");
        return;
      }

      // Remember email and password
      if (rememberMe) {
        localStorage.setItem("rememberedEmail", email);
        localStorage.setItem("rememberedPassword", password);
        localStorage.setItem("rememberMe", "true");
      } else {
        localStorage.removeItem("rememberedEmail");
        localStorage.removeItem("rememberedPassword");
        localStorage.removeItem("rememberMe");
      }

      // Dynamic jumps to different pages
      let redirectPath = "/dashboard"; 
      if (result.user?.role === Role.CLINICIAN) {
        redirectPath = "/clinician-allpatients";
      } else if (result.user?.role === Role.ADMIN) {
        redirectPath = "/admin-allusers";
      } else if (result.user?.role === Role.RESEARCHER) {
        redirectPath = "/researcher-download";
      }else if (result.user?.role === Role.PATIENT) {
        redirectPath = "/my-records";
      }

      console.log("Redirecting to:", redirectPath); 
      router.push(redirectPath);
      router.refresh();
      
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "An unexpected error has occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh", backgroundColor: theme.palette.background.default }}>
      <Container component="main" sx={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Paper elevation={6} sx={{ padding: 4, maxWidth: 500, width: "100%", textAlign: "center", backgroundColor: mode === "dark" ? "rgba(255, 255, 255, 0.1)" : "#f9f9f9" }}>
          <Typography variant="h4" fontWeight="bold" gutterBottom>Log In</Typography>
          
          <TextField 
            fullWidth 
            label="Email" 
            type="email" 
            autoComplete="email"  
            variant="outlined"  
            margin="normal" 
            value={email} 
            onChange={handleEmailChange} 
            error={!!emailError}
            helperText={emailError}
          />
          
          <TextField 
            fullWidth 
            label="Password" 
            type="password" 
            autoComplete="current-password"  
            variant="outlined" 
            margin="normal" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)}
          />

          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%", mt: 1 }}>
            <FormControlLabel 
              control={<Checkbox checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)} />}  
              label="Remember Me"
            />
            <Link  
              href="/forgot-password"  
              sx={{ fontWeight: 600, color: "#6c4af7", textDecoration: "none", "&:hover": { textDecoration: "underline" } }}
            >
              Forgot Password?
            </Link>
          </Box>

          {/* Login Button */}
          <Button 
            fullWidth 
            variant="contained" 
            onClick={handleLogin} 
            disabled={loading} 
            sx={{ marginTop: 3, padding: 1.5, backgroundColor: "#6c4af7", "&:hover": { backgroundColor: "#5633e3" } }}
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : "Log In"}
          </Button>

          {/* Form Error Message */}
          {formError && (
            <Typography 
              sx={{ 
                marginTop: 1, 
                fontSize: 14,
                textAlign: 'center',
                color: '#ff3d3d',
                fontWeight: 'bold'
              }}
            >
              {formError}
            </Typography>
          )}
          
          {/* Register link */}
          <Typography sx={{ marginTop: 2, fontSize: 14, color: mode === "dark" ? "rgba(255, 255, 255, 0.7)" : "#555" }}>
            Already have an account?{" "}
            <Link href="/register" sx={{ fontWeight: 600, color: "#6c4af7", textDecoration: "none", "&:hover": { textDecoration: "underline" } }}>
              Sign in instead
            </Link>
          </Typography>
        </Paper>
      </Container>

      {/* Footer*/}
      <Box sx={{ textAlign: "center", paddingY: 2, backgroundColor: "transparent" }}>
        <Footer />
      </Box>
    </Box>
  );
};

export default LoginPageClient;
