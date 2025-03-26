

'use client'

import React, { useState, useEffect, useCallback } from 'react'

import { useRouter } from 'next/navigation'

import debounce from 'lodash/debounce'

import Stack from '@mui/material/Stack'

import type { SelectChangeEvent } from '@mui/material/Select'

import {Grid,Box,Typography,Radio,RadioGroup,FormControlLabel,Button,Stepper,Step,StepLabel,TextField,Checkbox,Link,Snackbar,Alert,CircularProgress,FormControl, InputLabel, Select, MenuItem} from '@mui/material'

import { PatientRegister } from './RegisterPatient'

import { DateOfBirthPicker } from './DateOfBirthPicker'

import { ClinicianRegister } from './RegisterClinician'

import { ResearcherRegister } from './RegisterResearcher'

import { PrivacyPolicyTerms } from './PrivacyPolicyTerms'

import { checkUserDuplicates } from '@/actions/register/registerActions'

// Define form interfaces
export interface AccountDetailsForm {
  firstName: string
  lastName: string
  email: string
  password: string
  confirmPassword: string
  dateOfBirth?: string
  address?: string
  phoneNumber?: string
  registrationNumber?: string
  institution?: string
  profession?: string
}
interface FormErrors {
  firstName: string
  lastName: string
  email: string
  password: string
  confirmPassword: string
  dateOfBirth?: string
  address?: string
  phoneNumber?: string
  registrationNumber?: string
  institution?: string
  profession?: string
}
interface DuplicateCheckResult {
  emailExists: boolean
  phoneExists: boolean
  registrationNumberExists: boolean
}

export const Register = () => {
  // Hooks must be called at the top level in a consistent order
  const [step, setStep] = useState(0)
  const [mounted, setMounted] = useState(false)
  const [isLoading] = useState(false)
  const [agreeTerms, setAgreeTerms] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [accountType, setAccountType] = useState('patient')
  const [success, setSuccess] = useState<string | null>(null)
  const [completedSteps, setCompletedSteps] = useState<boolean[]>([])
  const [isPhoneFocused, setIsPhoneFocused] = useState(false)
  const [openPrivacyTerms, setOpenPrivacyTerms] = useState<boolean>(false)
  const [isFirstNameFocused, setIsFirstNameFocused] = useState(false)
  const [isLastNameFocused, setIsLastNameFocused] = useState(false)
  const [isEmailFocused, setIsEmailFocused] = useState(false)
  const [isAddressFocused, setIsAddressFocused] = useState(false)
  const [isPasswordFocused, setIsPasswordFocused] = useState(false)
  const [isConfirmPasswordFocused, setIsConfirmPasswordFocused] = useState(false)
  const [isRegistrationNumberFocused, setIsRegistrationNumberFocused] = useState(false)
  const [isInstitutionFocused, setIsInstitutionFocused] = useState(false)
  const [isProfessionFocused, setIsProfessionFocused] = useState(false)
  const [touchedFields, setTouchedFields] = useState<Record<string, boolean>>({})

  const validatePhoneNumber = (phoneNumber: string): boolean => {
    return /^\d{10,}$/.test(phoneNumber);
  };

  const validatePassword = (password: string): { isValid: boolean; errorMessage: string } => {
    const requirements = [
      { met: password.length >= 8, message: 'Password must be at least 8 characters' },
      { met: /[A-Z]/.test(password), message: 'Password must include at least one uppercase letter' },
      { met: /[a-z]/.test(password), message: 'Password must include at least one lowercase letter' },
      { met: /\d/.test(password), message: 'Password must include at least one number' },
      { met: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password), message: 'Password must include at least one special character' }
    ];
  
    const allMet = requirements.every(req => req.met);
   
    if (!password) {
      return { isValid: false, errorMessage: 'Password is required' };
    }
   
    if (!allMet) {
      return {
        isValid: false,
        errorMessage: 'Password must be at least 8 characters;\nPassword must include at least one uppercase letter;\nPassword must include at least one lowercase letter\nPassword must include at least one number;\nPassword must include at least one special character;'
      };
    }
    
    return { isValid: true, errorMessage: '' };
  };
  

  const [formData, setFormData] = useState<AccountDetailsForm>({ firstName: '', lastName: '',email: '',password: '',confirmPassword: '',dateOfBirth: '',address: '',phoneNumber: '',registrationNumber: '',institution: '', profession: ''})
  const [formErrors, setFormErrors] = useState<FormErrors>({ firstName: '',lastName: '',email: '',password: '',confirmPassword: '',dateOfBirth: '',address: '',phoneNumber: '',registrationNumber: '',institution: '',profession: ''})
  const router = useRouter();

  // Define debouncedCheckDuplicates
  const debouncedCheckDuplicates = useCallback(
    (email: string, phoneNumber: string, registrationNumber: string) => {
      const checkDuplicates = debounce(async () => {
        if (email.trim() || phoneNumber.trim() || registrationNumber.trim()) {
          try {
            const result: DuplicateCheckResult = await checkUserDuplicates(email, phoneNumber, registrationNumber);
      
            setFormErrors(prev => {
              const newErrors = { ...prev };
   
              if (result.emailExists) { 
                newErrors.email = 'This email already exists';
              }
              
              if (result.phoneExists) {
                newErrors.phoneNumber = 'The phone number already exists';
              }
              
              if (result.registrationNumberExists) { 
                newErrors.registrationNumber = 'The Registration Number already exists';
              }
              
              return newErrors;
            });
          } catch (error) { 
            console.error('Error checking duplicates:', error)
          }
        }
      }, 500);
      
      checkDuplicates();
    }, 
    []
  );

  // Define functions before useEffect
  const getSteps = (type: string) => {
    switch (type) {
      case 'patient': return ['Account Type', 'Account Details', 'Data Privacy']
      case 'clinician': return ['Account Type', 'Account Details', 'Complete Registration']
      case 'researcher': return ['Account Type', 'Account Details', 'Application']
      default:return ['Account Type']
    }
  }

  const handleOpenPrivacyTerms = (): void => {setOpenPrivacyTerms(true)}
  const handleClosePrivacyTerms = (): void => { setOpenPrivacyTerms(false)}

  const validateForm = (fieldName?: string) => {const errors: FormErrors = { ...formErrors };
    let isValid = true;

    const shouldValidateField = (field: string) => {
      return !fieldName || (fieldName === field && touchedFields[field]);
    };
  
    if (shouldValidateField('firstName')) { errors.firstName = !formData.firstName.trim() ? 'First name is required' : ''; isValid = isValid && !errors.firstName;
    } else {
      errors.firstName = '';
    }
  
    if (shouldValidateField('lastName')) { errors.lastName = !formData.lastName.trim() ? 'Last name is required' : ''; isValid = isValid && !errors.lastName;
    } else {
      errors.lastName = '';
    }
  
    if (shouldValidateField('email')) {
      if (!formData.email.trim()) { errors.email = '';
      } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {errors.email = 'Please enter a valid email address';
      } else if (!errors.email?.includes('already exists')) { errors.email = '';
      }

isValid = isValid && !errors.email;
    }
  
    if (shouldValidateField('password')) {
      const passwordValidation = validatePassword(formData.password);

      errors.password = passwordValidation.errorMessage;
      isValid = isValid && passwordValidation.isValid;
    }
  
    if (shouldValidateField('confirmPassword')) {
      if (formData.password && formData.password !== formData.confirmPassword) { errors.confirmPassword = 'Passwords do not match';
      } else { errors.confirmPassword = '';
      }

isValid = isValid && !errors.confirmPassword;
    } else {errors.confirmPassword = '';
    }
  
    if (shouldValidateField('phoneNumber')) {
      if (formData.phoneNumber) {
        if (!validatePhoneNumber(formData.phoneNumber)) { errors.phoneNumber = 'Please enter a valid phone number'; } 
        else if (!errors.phoneNumber?.includes('already exists')) { errors.phoneNumber = '';}
      } else {
        errors.phoneNumber = '';
      }

 isValid = isValid && !errors.phoneNumber;
    }
  
    if (shouldValidateField('dateOfBirth') && accountType === 'patient') {
      errors.dateOfBirth = !formData.dateOfBirth ? 'Date of birth is required' : '';
      isValid = isValid && !errors.dateOfBirth;
    } else { errors.dateOfBirth = '';
    }
  
    if (shouldValidateField('registrationNumber') && accountType === 'clinician') {
      if (!formData.registrationNumber?.trim()) { errors.registrationNumber = 'Registration number is required';
      } else if (!errors.registrationNumber?.includes('already exists')) { errors.registrationNumber = '';
      }

isValid = isValid && !errors.registrationNumber;
    }
  
    if (shouldValidateField('institution') && (accountType === 'clinician' || accountType === 'researcher')) {
      errors.institution = !formData.institution?.trim() ? 'Institution is required' : '';
      isValid = isValid && !errors.institution;
    } else { errors.institution = '';
    }
  
    if (shouldValidateField('profession') && accountType === 'clinician') { errors.profession = !formData.profession?.trim() ? 'Profession is required' : '';isValid = isValid && !errors.profession;
    } else { errors.profession = '';
    }

    setFormErrors(errors);
    
return isValid;
  };
  

  useEffect(() => {
    setMounted(true);

    const checkAutofill = () => {
      const firstNameInput = document.querySelector('input[name="firstName"]') as HTMLInputElement;
      const lastNameInput = document.querySelector('input[name="lastName"]') as HTMLInputElement;
      const emailInput = document.querySelector('input[name="email"]') as HTMLInputElement;
      const addressInput = document.querySelector('input[name="address"]') as HTMLInputElement;
      const phoneNumberInput = document.querySelector('input[name="phoneNumber"]') as HTMLInputElement;
      const passwordInput = document.querySelector('input[name="password"]') as HTMLInputElement;
      const confirmPasswordInput = document.querySelector('input[name="confirmPassword"]') as HTMLInputElement;
  
      if (firstNameInput?.value) { setFormData(prev => ({ ...prev, firstName: firstNameInput.value })); setTouchedFields(prev => ({ ...prev, firstName: true }));
      }

      if (lastNameInput?.value) { setFormData(prev => ({ ...prev, lastName: lastNameInput.value })); setTouchedFields(prev => ({ ...prev, lastName: true }));
      }

      if (emailInput?.value) { setFormData(prev => ({ ...prev, email: emailInput.value })); setTouchedFields(prev => ({ ...prev, email: true }));
      }

      if (addressInput?.value) { setFormData(prev => ({ ...prev, address: addressInput.value })); setTouchedFields(prev => ({ ...prev, address: true }));
      }

      if (phoneNumberInput?.value) { setFormData(prev => ({ ...prev, phoneNumber: phoneNumberInput.value })); setTouchedFields(prev => ({ ...prev, phoneNumber: true }));
      }

      if (passwordInput?.value) { setFormData(prev => ({ ...prev, password: passwordInput.value })); setTouchedFields(prev => ({ ...prev, password: true }));
      }

      if (confirmPasswordInput?.value) { setFormData(prev => ({ ...prev, confirmPassword: confirmPasswordInput.value }));  setTouchedFields(prev => ({ ...prev, confirmPassword: true }));
      }
    };
  
    const timer = setTimeout(checkAutofill, 500);
  
    return () => { clearTimeout(timer); setSuccess(null); setError(null);};
  }, []);

  useEffect(() => {
    setSuccess(null)
    setError(null)
  }, [step, accountType])

  if (!mounted) return null

  const steps = getSteps(accountType)
  const maxStep = steps.length - 1

  const validateFieldFormat = (fieldName: string, value: string) => {
    console.log(`Validating field format: ${fieldName} = ${value}`);
    setFormErrors(prev => {
      const newErrors = { ...prev };

      if (fieldName === 'email') {
        if (value.trim() && !/^\S+@\S+\.\S+$/.test(value)) { newErrors.email = 'Please enter a valid email address';
        } else if (newErrors.email && !newErrors.email.includes('already exists')) { newErrors.email = '';}
      }

      if (fieldName === 'phoneNumber') {
        if (value && !validatePhoneNumber(value)) { console.log('Phone validation failed');  newErrors.phoneNumber = 'Please enter a valid phone number';
        } else { console.log('Phone validation passed'); 
          if (!newErrors.phoneNumber?.includes('already exists')) {  newErrors.phoneNumber = '';}
        }
      }
      
      if (fieldName === 'registrationNumber' && accountType === 'clinician') {
        if (!value.trim()) { newErrors.registrationNumber = 'Registration number is required';
        } else if (newErrors.registrationNumber && !newErrors.registrationNumber.includes('already exists')) { newErrors.registrationNumber = '';
        }
      }
 
      
return newErrors;
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    console.log(`Input ${name}:`, value);
    setFormData(prev => ({ ...prev, [name]: value }));
    setTouchedFields(prev => ({ ...prev, [name]: true }));
    
    if (name === 'password') {
      const passwordValidation = validatePassword(value);

      setFormErrors(prev => ({ ...prev, password: passwordValidation.errorMessage }));

      if (formData.confirmPassword) {
        if (value !== formData.confirmPassword) { setFormErrors(prev => ({ ...prev, confirmPassword: 'Passwords do not match' }));
        } else {
          setFormErrors(prev => ({ ...prev, confirmPassword: '' }));
        }
      }
    }
  else if (name === 'phoneNumber') {
    console.log('Processing phone number input');
 
        if (value && !validatePhoneNumber(value)) {
      console.log('Phone validation failed in handleInputChange'); 
      setFormErrors(prev => ({ ...prev, phoneNumber: 'Please enter a valid phone number' }));
    } else {
      console.log('Phone validation passed in handleInputChange'); 
      setFormErrors(prev => {
        if (prev.phoneNumber && !prev.phoneNumber.includes('already exists')) {
          return { ...prev, phoneNumber: '' };
        }

        
return prev;
      });

      if (value) {
        debouncedCheckDuplicates(
          formData.email || '',
          value,
          accountType === 'clinician' ? formData.registrationNumber || '' : ''
        );
      }
    }
  }

  else if (name === 'confirmPassword') {
    if (formData.password && value !== formData.password) {
      setFormErrors(prev => ({ ...prev, confirmPassword: 'Passwords do not match' }));
    } else { setFormErrors(prev => ({ ...prev, confirmPassword: '' }));
    }
  }
  else if (name === 'email' || name === 'phoneNumber' || name === 'registrationNumber') {
    if (value.trim() === '') {
      setFormErrors(prev => ({ ...prev, [name]: '' }));
    } else { debouncedCheckDuplicates(
        name === 'email' ? value : formData.email || '',
        name === 'phoneNumber' ? value : formData.phoneNumber || '',
        name === 'registrationNumber' ? value : formData.registrationNumber || ''
      );
    }
    
    validateFieldFormat(name, value);
  } else {
    setTimeout(() => {
      validateForm(name);
    }, 0);
  }
};

  const handleNext = async () => {
    setSuccess(null)

    if (step === 1) {
      setTouchedFields({ firstName: true, lastName: true, email: true, password: true, confirmPassword: true, dateOfBirth: true, address: true, phoneNumber: true, registrationNumber: true,institution: true, profession: true});

      if (!validateForm() || !agreeTerms) {
        return;
      }
    }

    if (step < maxStep) {
      setCompletedSteps(prev => {
        const newCompleted = [...prev]

        newCompleted[step] = true
        
return newCompleted
      })
      setStep(prevStep => prevStep + 1)
    }
  }

  const handlePrevious = () => {
    if (step > 0) { setStep(prevStep => prevStep - 1)}
  }

  const renderAccountTypeStep = () => (
    <Box sx={{ marginLeft: 15 }}>
      <Typography variant='h3' fontWeight='bold'>
        {' '}
        Account Type
      </Typography>
      <Typography variant='h5' color='textSecondary' sx={{ marginBottom: 5 }}>
        {' '}
        Choose your account type.
      </Typography>
      <RadioGroup value={accountType} onChange={e => setAccountType(e.target.value)}>
        <Stack spacing={8}>
          <FormControlLabel value='patient' control={<Radio sx={{ transform: 'scale(1.5)' }} />} label={<Typography variant='h5'>Patient</Typography>}
          />
          <FormControlLabel value='clinician' control={<Radio sx={{ transform: 'scale(1.5)' }} />} label={<Typography variant='h5'>Clinician</Typography>}
          />
          <FormControlLabel value='researcher' control={<Radio sx={{ transform: 'scale(1.5)' }} />} label={<Typography variant='h5'>Researcher</Typography>}
          />
        </Stack>
      </RadioGroup>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', marginTop: 10 }}>
      <Button  variant="outlined"  onClick={() => (step === 0 ? router.push('/login') : handlePrevious())} 
                sx={{  borderRadius: '8px',  borderColor: 'primary',  color: 'primary',  '&:hover': { borderColor: '#5835b5', backgroundColor: 'rgba(110, 65, 226, 0.04)' }}}>
                {step === 0 ? '⬅ Login' : '⬅ Previous'} 
              </Button>
          <Button
            variant="contained"
            onClick={handleNext}
            sx={{ borderRadius: '8px', borderColor: 'primary', '&:hover': { borderColor: '#5835b5' }, '&.Mui-disabled': { backgroundColor: '#ded5f7', color: '#ffffff' }}} > Next → </Button>
        </Box>
    </Box>
  )

  const renderAccountDetailsStep = () => (
    <Box sx={{ maxWidth: '600px', marginX: 'auto' }}>
      <Typography variant='h4' fontWeight='bold' sx={{ marginBottom: 1 }}>
        {' '}
        Account Details{' '}
      </Typography>
      <Typography variant='body1' color='textSecondary' sx={{ marginBottom: 3 }}>
        {' '}
        Enter your account details below.
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={6}>
          {' '}
          <TextField label='First name'  name='firstName' autoComplete="given-name" fullWidth  variant='outlined'
            value={formData.firstName}
            onChange={handleInputChange}
            onBlur={(e: React.FocusEvent<HTMLInputElement>) => {  setTouchedFields(prev => ({ ...prev, firstName: true })); setFormData(prev => ({ ...prev, firstName: e.target.value })); validateForm('firstName');  setIsFirstNameFocused(!!e.target.value); }}
            error={!!formErrors.firstName}
            helperText={formErrors.firstName}
            InputLabelProps={{ shrink: isFirstNameFocused || !!formData.firstName }}
            onFocus={() => setIsFirstNameFocused(true)}
            sx={{ mb: 2, '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
          />
        </Grid>
        <Grid item xs={6}>
          {' '}
          <TextField  label="Last name" name="lastName"  autoComplete="family-name"  fullWidth  variant="outlined"
            value={formData.lastName}
            onChange={handleInputChange}
            onBlur={(e: React.FocusEvent<HTMLInputElement>) => {  setTouchedFields(prev => ({ ...prev, lastName: true }));   setFormData(prev => ({ ...prev, lastName: e.target.value }));  validateForm('lastName'); setIsLastNameFocused(!!e.target.value); }}
            error={!!formErrors.lastName}
            helperText={formErrors.lastName}
            InputLabelProps={{ shrink: isLastNameFocused || !!formData.lastName }}
            onFocus={() => setIsLastNameFocused(true)}
            sx={{ mb: 2, '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
          />
        </Grid>
        <Grid item xs={12}>
        <TextField  label='Email'  name='email' type='email' autoComplete="email"  fullWidth variant='outlined'
            value={formData.email}
            onChange={handleInputChange}
            onBlur={(e: React.FocusEvent<HTMLInputElement>) => {  setTouchedFields(prev => ({ ...prev, email: true }));  setFormData(prev => ({ ...prev, email: e.target.value })); validateForm('email');  setIsFirstNameFocused(!!e.target.value); }}
            error={!!formErrors.email}
            helperText={formErrors.email}
            InputLabelProps={{ shrink: isEmailFocused || !!formData.email }}
            onFocus={() => setIsEmailFocused(true)}
            sx={{ mb: 2, '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
          />
        </Grid>
        <Grid item xs={12}>
          {' '}
          <TextField label='Address' name='address' autoComplete="street-address"  fullWidth variant='outlined'
            value={formData.address}
            onChange={handleInputChange}
            onBlur={(e: React.FocusEvent<HTMLInputElement>) => {   setTouchedFields(prev => ({ ...prev, address: true }));  setFormData(prev => ({ ...prev, address: e.target.value }));  validateForm('address');  setIsFirstNameFocused(!!e.target.value);}}
            error={!!formErrors.address}
            helperText={formErrors.address}
            InputLabelProps={{ shrink: isAddressFocused || !!formData.address }}
            onFocus={() => setIsAddressFocused(true)}
            sx={{ mb: 2, '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
          />
        </Grid>
        <Grid item xs={12}>
          {' '}
          <TextField label='Phone Number' name='phoneNumber'  autoComplete="tel"  fullWidth variant='outlined'
            value={formData.phoneNumber}
            onChange={handleInputChange}
            onBlur={(e: React.FocusEvent<HTMLInputElement>) => {  setTouchedFields(prev => ({ ...prev, phoneNumber: true })); setFormData(prev => ({ ...prev, phoneNumber: e.target.value })); validateForm('phoneNumber'); setIsFirstNameFocused(!!e.target.value); }}
            error={!!formErrors.phoneNumber}
            helperText={formErrors.phoneNumber}
            InputLabelProps={{ shrink: isPhoneFocused || !!formData.phoneNumber }}
            onFocus={() => setIsPhoneFocused(true)}
            sx={{ mb: 2, '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
          />{' '}
        </Grid>
        <Grid item xs={12}>
        <TextField  label='Password'  name='password'  type='password' autoComplete="new-password"  fullWidth  variant='outlined'
            value={formData.password}
            onChange={handleInputChange}
            onBlur={(e: React.FocusEvent<HTMLInputElement>) => { setTouchedFields(prev => ({ ...prev, password: true }));  setFormData(prev => ({ ...prev, password: e.target.value })); validateForm('password'); setIsFirstNameFocused(!!e.target.value); }}
            error={!!formErrors.password}
            InputLabelProps={{ shrink: isPasswordFocused || !!formData.password }}
            onFocus={() => setIsPasswordFocused(true)}
            sx={{ mb: 2, '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
          />
          {formErrors.password && (
              <Box sx={{ color: '#f44336',  fontSize: '0.75rem',  mt: -1.5,   mb: 1.5,   ml: 1.5 }}>
                {formErrors.password.split('\n').map((line, index) => (
                  <Typography   key={index}   variant="caption"   component="div" sx={{ color: '#f44336' }} > {line} </Typography> ))}
              </Box>
            )}
        </Grid>
        <Grid item xs={12}>
          {' '}
          <TextField label='Confirm password' name='confirmPassword' type='password' autoComplete="confirm-password"  fullWidth variant='outlined'
            value={formData.confirmPassword}
            onChange={handleInputChange}
            onBlur={(e: React.FocusEvent<HTMLInputElement>) => {  setTouchedFields(prev => ({ ...prev, confirmPassword: true })); setFormData(prev => ({ ...prev, confirmPassword: e.target.value })); validateForm('confirmPassword');  setIsFirstNameFocused(!!e.target.value); }}
            error={!!formErrors.confirmPassword}
            helperText={formErrors.confirmPassword}
            InputLabelProps={{ shrink: isConfirmPasswordFocused || !!formData.confirmPassword }}
            onFocus={() => setIsConfirmPasswordFocused(true)}
            sx={{ mb: 2, '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
          />
        </Grid>
        {accountType === 'patient' && (
          <Grid item xs={12}>
          <DateOfBirthPicker
            value={formData.dateOfBirth ? new Date(formData.dateOfBirth) : null}
            onChange={(newDate: Date | null) => {
              setFormData(prev => ({
                ...prev,
                dateOfBirth: newDate ? newDate.toISOString().split('T')[0] : ''
              }));
              setTouchedFields(prev => ({ ...prev, dateOfBirth: true }));
              validateForm('dateOfBirth');
            }}
            label="Date of birth"
            error={!!formErrors.dateOfBirth}
            helperText={formErrors.dateOfBirth}
          />
        </Grid>
        )}
        {accountType === 'clinician' && (
          <>
            <Grid item xs={12}>
              {' '}
              <TextField label='Registration Number' name='registrationNumber'  autoComplete="off" fullWidth variant='outlined'
                value={formData.registrationNumber}
                onChange={handleInputChange}
                onBlur={() => {
                  setTouchedFields(prev => ({ ...prev, registrationNumber: true }))
                  validateForm('registrationNumber')
                  setIsFirstNameFocused(!!formData.registrationNumber)
                }}
                error={!!formErrors.registrationNumber}
                helperText={formErrors.registrationNumber}
                InputLabelProps={{ shrink: isRegistrationNumberFocused || !!formData.registrationNumber }}
                onFocus={() => setIsRegistrationNumberFocused(true)}
                sx={{ mb: 2, '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
              />{' '}
            </Grid>
            <Grid item xs={12}>
              {' '}
              <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel shrink={isInstitutionFocused || !!formData.institution}>Institution</InputLabel>
                <Select name='institution' value={formData.institution}
                  onChange={(event: SelectChangeEvent<string>) =>
                    handleInputChange({
                      target: { name: "institution", value: event.target.value }
                    } as React.ChangeEvent<HTMLInputElement>)
                  }
                  onBlur={() => {  setTouchedFields(prev => ({ ...prev, institution: true }))
                    validateForm('institution')
                    setIsFirstNameFocused(!!formData.institution)
                  }}
                  onOpen={() => setIsInstitutionFocused(true)}
                  onClose={() => setIsInstitutionFocused(!!formData.institution)}
                >
                  <MenuItem value='University College London (UCL)'>University College London (UCL)</MenuItem>
                  <MenuItem value='Kings College London'>Kings College London</MenuItem>
                  <MenuItem value='Imperial College London'>Imperial College London</MenuItem>
                  <MenuItem value='NHS England'>NHS England</MenuItem>
                  <MenuItem value='South London and Maudsley NHS Trust'>South London and Maudsley NHS Trust</MenuItem>
                  <MenuItem value='Other'>Other</MenuItem>
                </Select>
                {formErrors.institution && (
                  <Typography variant='caption' color='error'>
                    {formErrors.institution}
                  </Typography>
                )}
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              {' '}
              <TextField label='Profession'  name='profession'  fullWidth variant='outlined'
                value={formData.profession}
                onChange={handleInputChange}
                onBlur={() => {  setTouchedFields(prev => ({ ...prev, profession: true }))
                  validateForm('profession')
                  setIsFirstNameFocused(!!formData.profession)
                }}
                error={!!formErrors.profession}
                helperText={formErrors.profession}
                InputLabelProps={{ shrink: isProfessionFocused || !!formData.profession }}
                onFocus={() => setIsProfessionFocused(true)}
                sx={{ mb: 2, '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
              />{' '}
            </Grid>
          </>
        )}

        {accountType === 'researcher' && (
          <Grid item xs={12}>
            {' '}
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel shrink={isInstitutionFocused || !!formData.institution}>Institution</InputLabel>
                <Select
                  name='institution'
                  value={formData.institution}
                  onChange={(event: SelectChangeEvent<string>) =>
                    handleInputChange({
                      target: { name: "institution", value: event.target.value }
                    } as React.ChangeEvent<HTMLInputElement>)
                  }
                  onBlur={() => {
                    setTouchedFields(prev => ({ ...prev, institution: true }))
                    validateForm('institution')
                    setIsFirstNameFocused(!!formData.institution)
                  }}
                  onOpen={() => setIsInstitutionFocused(true)}
                  onClose={() => setIsInstitutionFocused(!!formData.institution)}
                >
                  <MenuItem value='University College London (UCL)'>University College London (UCL)</MenuItem>
                  <MenuItem value='Kings College London'>Kings College London</MenuItem>
                  <MenuItem value='Imperial College London'>Imperial College London</MenuItem>
                  <MenuItem value='NHS England'>NHS England</MenuItem>
                  <MenuItem value='South London and Maudsley NHS Trust'>South London and Maudsley NHS Trust</MenuItem>
                  <MenuItem value='Other'>Other</MenuItem>
                </Select>
                {formErrors.institution && (
                  <Typography variant='caption' color='error'>
                    {formErrors.institution}
                  </Typography>
                )}
              </FormControl>
          </Grid>
        )}
      </Grid>

      <FormControlLabel
        control={
          <Checkbox
            checked={agreeTerms}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setAgreeTerms(e.target.checked)}
            sx={{ color: 'primary', '&.Mui-checked': { color: 'primary' } }}
          />
        }
        label={
          <Typography variant='body2'>
            {' '}
            I agree to{' '}
            <Link  component='button' variant='body2' onClick={handleOpenPrivacyTerms}
              sx={{ color: 'primary', textDecoration: 'underline',  border: 'none', background: 'none', p: 0,  cursor: 'pointer' }} > privacy policy & terms
            </Link>
          </Typography>
        } sx={{ mb: 2 }}
      />

      <Box sx={{ display: 'flex', justifyContent: 'space-between', marginTop: 3, marginBottom: 4 }}>
        <Button variant='outlined' onClick={handlePrevious} disabled={isLoading}
          sx={{ borderRadius: '8px', borderColor: 'primary', color: 'primary',  '&:hover': { borderColor: '#5835b5', backgroundColor: 'rgba(110, 65, 226, 0.04)' } }}
        >
          {' '}
          ← Previous
        </Button>
        <Button
          variant='contained'
          onClick={handleNext}
          disabled={!agreeTerms || isLoading || Object.values(formErrors).some(error => error !== '')}
          sx={{  borderRadius: '8px', backgroundColor: 'primary', '&:hover': { backgroundColor: '#5835b5' }, '&.Mui-disabled': { backgroundColor: '#ded5f7', color: '#ffffff' } }}
        >
          {isLoading ? <CircularProgress size={24} color='inherit' /> : 'Next →'}{' '}
        </Button>
      </Box>
    </Box>
  )

  return (
    <Box
      sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', width: '100%' }}
    >
      <Snackbar open={!!error} autoHideDuration={4000} onClose={() => setError(null)} anchorOrigin={{ vertical: 'top', horizontal: 'center' }} key='error-snackbar'>
        <Alert severity='error' onClose={() => setError(null)}>
          {' '}
          {error}
        </Alert>
      </Snackbar>

      <Snackbar open={!!success}  autoHideDuration={4000} onClose={() => setSuccess(null)} anchorOrigin={{ vertical: 'top', horizontal: 'center' }} key='success-snackbar'
      >
        <Alert severity='success' onClose={() => setSuccess(null)}>
          {' '}
          {success}
        </Alert>
      </Snackbar>

      <Grid container sx={{ flex: 1 }}>
        <Grid
          item
          xs={4}
          sx={{ backgroundColor: 'var(--mui-palette-customColors-bodyBg)', display: 'flex', alignItems: 'center',  justifyContent: 'center' }}
        >
          <Box sx={{ textAlign: 'center', backgroundColor: 'var(--mui-palette-customColors-bodyBg)' }}>
            {' '}
            <img src='/images/pages/Frame_16.png' alt='Logo' width='320px' />
          </Box>
        </Grid>
        <Grid item xs={8} sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', paddingX: 20 }}>
          <Box
            sx={{ marginBottom: 30, display: 'flex', justifyContent: 'center',  width: '100%',  marginLeft: '5%',  paddingRight: '0',  paddingTop: '5%'}}
          >
            <Stepper
              activeStep={step}
              alternativeLabel
              sx={{  width: '100%', '& .MuiStepConnector-line': { minLength: 70, borderTopWidth: 1 }, '& .MuiStepLabel-iconContainer': { padding: 0 }, '& .MuiStepLabel-labelContainer': { width: '100%' } }}
            >
              {steps.map((label, index) => (
                <Step key={index} completed={completedSteps[index]}>
                  <StepLabel>
                    <Typography
                      variant='h6'
                      sx={{ fontSize: '16px', fontWeight: 'medium', width: '100%', textAlign: 'center', mt: 1 }}
                    >
                      {' '}
                      {label}
                    </Typography>
                  </StepLabel>
                </Step>
              ))}
            </Stepper>
          </Box>

          {step === 0 && renderAccountTypeStep()}
          {step === 1 && renderAccountDetailsStep()}
          {step === 2 && accountType === 'patient' && (
            <PatientRegister onBack={handlePrevious} accountType={accountType} formData={formData} userId={null} />
          )}
          {step === 2 && accountType === 'researcher' && (
            <ResearcherRegister onBack={handlePrevious} accountType={accountType} formData={formData} userId={null} />
          )}
          {step === 2 && accountType === 'clinician' && (
            <ClinicianRegister onBack={handlePrevious} accountType={accountType} formData={formData} userId={null} />
          )}
        </Grid>
      </Grid>
      <PrivacyPolicyTerms open={openPrivacyTerms} onClose={handleClosePrivacyTerms} />
    </Box>
  )
}


