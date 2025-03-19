'use client'

import React from 'react'
import { Box, Typography } from '@mui/material'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFnsV3'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'

interface DateOfBirthPickerProps {
  value: Date | null
  onChange: (date: Date | null) => void
  label?: string
  error?: boolean
  helperText?: string
  isFocused?: boolean
  onFocus?: () => void
  onBlur?: () => void
}

export const DateOfBirthPicker = ({
  value,
  onChange,
  label = 'Date of birth',
  error = false,
  helperText,
  isFocused = false,
  onFocus = () => {},
  onBlur = () => {}
}: DateOfBirthPickerProps) => {
  const minDate = new Date()
  minDate.setFullYear(minDate.getFullYear() - 120)
  const maxDate = new Date()
  
  // Set max date to today
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Box sx={{ width: '100%' }}>
        <Typography 
          variant='caption' 
          sx={{ 
            color: error ? 'error.main' : 'text.secondary', 
            mb: 1, 
            display: 'block',
            fontWeight: isFocused ? 'medium' : 'regular'
          }}
        >
          {label}
        </Typography>
        
        <DatePicker
          value={value}
          onChange={onChange}
          minDate={minDate}
          maxDate={maxDate}
          sx={{ 
            width: '100%', 
            '& .MuiOutlinedInput-root': { 
              borderColor: error ? 'error.main' : undefined,
              borderWidth: isFocused ? '2px' : '1px'
            } 
          }}
          slotProps={{
            textField: {
              error: error,
              helperText: helperText,
              placeholder: 'dd/mm/yyyy',
              inputProps: { 'aria-label': label },

              onFocus: onFocus,
              onBlur: onBlur
            }
          }}
          format='dd/MM/yyyy'
        />
      </Box>
    </LocalizationProvider>
  )
}
