"use client";

import React from "react";
import { Box, Typography } from "@mui/material";
import { Clinician } from "./ClinicianSearch";

interface SavedCliniciansProps {
  clinicians: Clinician[];
  onRemoveClinician: (clinicianId: string) => void;
}

const SavedClinicians = ({ clinicians, onRemoveClinician }: SavedCliniciansProps) => {
  if (clinicians.length === 0) {
    return null;
  }

  return (
    <Box sx={{ mb: 4, mt: 2 }}>
      <Typography variant="h6" sx={{ color: 'white', mb: 2 }}>
        Clinicians
      </Typography>
      <Box sx={{ 
        display: 'flex',
        flexWrap: 'wrap',
        gap: 2
      }}>
        {clinicians.map((clinician) => (
          <Box 
            key={clinician.id} 
            sx={{ 
              position: 'relative',
              width: '220px', 
              p: 2, 
              bgcolor: 'rgba(255, 255, 255, 0.05)', 
              borderRadius: '4px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.12)'
            }}
          >
            {/* Delete button */}
            <Box 
              sx={{ 
                position: 'absolute', 
                top: 5, 
                right: 5, 
                cursor: 'pointer',
                color: 'rgba(255,255,255,0.5)',
                fontSize: '16px',
                lineHeight: 1,
                padding: '2px',
                '&:hover': {
                  color: 'rgba(255,255,255,0.8)',
                }
              }}
              onClick={() => onRemoveClinician(clinician.id)}
            >
              ×
            </Box>
            
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Box sx={{ 
                width: '32px', 
                height: '32px', 
                borderRadius: '4px',
                bgcolor: '#ffd700',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: 2,
                color: 'white',
                fontSize: '16px'
              }}>
                🔒
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
            </Box>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default SavedClinicians;
