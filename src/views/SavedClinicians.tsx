"use client";

import React from "react";
import { Box, Typography, IconButton } from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';
import { Clinician } from "./ClinicianSearch";

interface SavedCliniciansProps {
  clinicians: Clinician[];
  onRemoveClinician: (id: string) => void;
}

const SavedClinicians: React.FC<SavedCliniciansProps> = ({ clinicians, onRemoveClinician }) => {
  if (clinicians.length === 0) {
    return null;
  }

  return (
    <Box
      sx={{
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        borderRadius: '8px',
        padding: 2,
        maxHeight: '300px',
        overflowY: 'auto',
        // Add scrollbar styling for dark theme
        '&::-webkit-scrollbar': {
          width: '8px',
        },
        '&::-webkit-scrollbar-track': {
          background: 'rgba(255, 255, 255, 0.05)',
        },
        '&::-webkit-scrollbar-thumb': {
          background: 'rgba(255, 255, 255, 0.2)',
          borderRadius: '4px',
        },
        '&::-webkit-scrollbar-thumb:hover': {
          background: 'rgba(255, 255, 255, 0.3)',
        },
      }}
    >
      {clinicians.map((clinician) => (
        <Box
          key={clinician.id}
          sx={{
            display: 'flex',
            alignItems: 'center',
            padding: 1.5,
            borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
            '&:last-child': {
              borderBottom: 'none',
            },
          }}
        >
          <Box
            sx={{
              width: '24px',
              height: '24px',
              borderRadius: '4px',
              bgcolor: '#6e41e2',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginRight: 2,
              color: 'white',
              fontSize: '14px',
            }}
          >
            ✓
          </Box>
          <Box sx={{ flexGrow: 1 }}>
            <Typography sx={{ fontWeight: 'bold', fontSize: '14px', color: 'white' }}>
              {clinician.firstName} {clinician.lastName}
            </Typography>
            <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '12px' }}>
              {clinician.institution || "No Institution"}
            </Typography>
            <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '12px' }}>
              {clinician.email}
            </Typography>
          </Box>
          <IconButton
            onClick={() => onRemoveClinician(clinician.id)}
            sx={{
              color: 'rgba(255, 255, 255, 0.7)',
              '&:hover': {
                color: 'white',
                bgcolor: 'rgba(255, 0, 0, 0.1)',
              },
            }}
          >
            <DeleteIcon fontSize="small" />
          </IconButton>
        </Box>
      ))}
    </Box>
  );
};

export default SavedClinicians;
