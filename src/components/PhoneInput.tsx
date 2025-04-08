'use client'

import  React, {  useEffect,useState } from 'react';

import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/material.css';
import { useTheme } from '@mui/material/styles';
import { Typography, Box } from '@mui/material';

interface ThemedPhoneInputProps {
  value?: string;
  onChange: (value: string, data: any) => void;
  onBlur?: (e: React.FocusEvent) => void;
  onFocus?: (e: React.FocusEvent) => void;
  error?: boolean;
  helperText?: string;
  label?: string;
  required?: boolean;
  name?: string;
  country?: string;
}

const ThemedPhoneInput: React.FC<ThemedPhoneInputProps> = ({
  value,
  onChange,
  onBlur,
  onFocus,
  error,
  helperText,
  label,
  required = false,
  name = 'phoneNumber',
  country = 'gb'
}) => {
  const theme = useTheme();
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    const applyHoverStyles = () => {
      const style = document.createElement('style');

      style.innerHTML = `
        .react-tel-input .country:hover {
          background-color: rgba(110, 65, 226, 0.15) !important;
          color: #8f6ff7 !important;
        }
  
        .react-tel-input .country:hover .country-name,
        .react-tel-input .country:hover .dial-code {
          color: #8f6ff7 !important;
        }
  
        .react-tel-input .country-list .highlight {
          background-color: rgba(110, 65, 226, 0.15) !important;
          color: #8f6ff7 !important;
        }
  
        .react-tel-input .country-list .highlight .country-name,
        .react-tel-input .country-list .highlight .dial-code {
          color: #8f6ff7 !important;
        }
      `;
      document.head.appendChild(style);
    };
  
    applyHoverStyles();
  }, []);
   

  const getBorderColor = () => {
    if (error) return theme.palette.error.main;
    if (isFocused) return theme.palette.primary.main;
    
return theme.palette.divider;
  };

  const handleFocus = (e: React.FocusEvent) => {
    setIsFocused(true);
    if (onFocus) onFocus(e);
  };

  const handleBlur = (e: React.FocusEvent) => {
    setIsFocused(false);
    if (onBlur) onBlur(e);
  };

  const handleChange = (phoneValue: string, data: any) => {
    if (onChange) {
      onChange(phoneValue, data);
    }
  };

  return (
    <Box sx={{ position: 'relative', width: '100%', mb: 2 }}>
      {label && (
        <Typography
          variant="caption"
          sx={{
            position: 'absolute',
            top: -8,
            left: 14,
            zIndex: 1,
            bgcolor: theme.palette.background.paper,
            px: 0.5,
            color: error 
              ? theme.palette.error.main 
              : (isFocused || !!value)
                ? theme.palette.primary.main
                : theme.palette.text.secondary
          }}
        >
          {label}{required && ' '}
        </Typography>
      )}
      <PhoneInput
        country={country}
        value={value}
        onChange={handleChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        specialLabel=""
        inputProps={{
          name: name,
          required: required,
          autoComplete: 'tel',
        }}
        containerStyle={{ 
          width: '100%' 
        }}
        containerClass="custom-phone-input"
        dropdownStyle={{
          backgroundColor: theme.palette.background.paper,
          color: theme.palette.text.primary,
          borderColor: theme.palette.divider,
          boxShadow: theme.shadows[4],
        }}
        searchStyle={{
          backgroundColor: theme.palette.background.paper,
          color: theme.palette.text.primary,
          borderColor: theme.palette.divider
        }}

        // @ts-ignore
        highlightCountryStyle={{
            backgroundColor: 'rgba(110, 65, 226, 0.2)',  
            color: theme.palette.primary.main,         
            fontWeight: 500
        }}
        buttonStyle={{
          backgroundColor: 'transparent',
          borderTopLeftRadius: '8px',
          borderBottomLeftRadius: '8px',
          borderColor: getBorderColor()
        }}
        inputStyle={{
          width: '100%',
          height: '56px',
          borderRadius: '8px',
          backgroundColor: 'transparent',
          color: theme.palette.text.primary,
          borderColor: getBorderColor()
        }}
        countryCodeEditable={false}
        enableSearch={false}
        disableSearchIcon={false}
      />
      {helperText && (
        <Typography 
          variant="caption" 
          sx={{ 
            ml: 1.5, 
            color: error ? theme.palette.error.main : theme.palette.text.secondary,
            fontSize: '0.75rem' 
          }}
        >
          {helperText}
        </Typography>
      )}
    </Box>
  );
};

export default ThemedPhoneInput;


