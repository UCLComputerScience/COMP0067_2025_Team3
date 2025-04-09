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
}

export const DateOfBirthPicker = ({
  value,
  onChange,
  label = 'Date of birth',
  error = false,
  helperText
}: DateOfBirthPickerProps) => {
  const minDate = new Date()

  minDate.setFullYear(minDate.getFullYear() - 120)

  const maxDate = new Date()

  // Set max date to today

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Box sx={{ width: '100%' }}>
        <Typography variant='caption' sx={{ color: error ? 'error.main' : 'text.secondary', mb: 1, display: 'block' }}>
          {label}
        </Typography>

        <DatePicker
          value={value}
          onChange={onChange}
          minDate={minDate}
          maxDate={maxDate}
          sx={{ width: '100%', '& .MuiOutlinedInput-root': { borderColor: error ? 'error.main' : undefined } }}
          slotProps={{
            textField: {
              error: error,
              helperText: helperText,
              placeholder: 'dd/mm/yyyy',
              inputProps: {
                readOnly: true, 
                'aria-label': label
                 }
            }
          }}
          format='dd/MM/yyyy'
        />
      </Box>
    </LocalizationProvider>
  )
}


