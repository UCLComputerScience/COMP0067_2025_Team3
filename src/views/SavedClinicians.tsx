"use client";

import React from "react";
import Image from "next/image";
import { Clinician } from "./ClinicianSearch";
import CloseIcon from "@mui/icons-material/Close";
import { Box, Typography, IconButton, Card, CardContent } from "@mui/material";
import { alpha } from '@mui/material/styles';

interface SavedCliniciansProps {
  clinicians: Clinician[];
  onRemoveClinician: (id: string) => void
}

export const SavedClinicians: React.FC<SavedCliniciansProps> = ({ clinicians, onRemoveClinician }) => {
  if (clinicians.length === 0) {
    return null;
  }

  return (
    <Box 
      sx={(theme) => ({display: "flex",flexWrap: "wrap",gap: 2,justifyContent: "flex-start",overflowX: "auto","&::-webkit-scrollbar": {height: "8px",
        },"&::-webkit-scrollbar-track": {background: alpha(theme.palette.background.paper, 0.05),
        },"&::-webkit-scrollbar-thumb": {background: alpha(theme.palette.background.paper, 0.2),borderRadius: "4px",
        },"&::-webkit-scrollbar-thumb:hover": {background: alpha(theme.palette.background.paper, 0.3),
        },
      })}
    >
      {clinicians.map((clinician) => (
        <Card key={clinician.id}
          sx={(theme) => ({bgcolor: alpha(theme.palette.background.paper, 0.05),borderRadius: "8px",color: theme.palette.text.primary,position: "relative",p: 1,width: 250,minWidth: 250,maxWidth: 250,})}>
          <CardContent sx={{ display: "flex", alignItems: "center", p: 1, pr: 3, width: "100%" }}>
            <Image src="/images/pages/savedclinician-logo.png" alt="Hospital Logo"width={40}height={40}style={{ marginRight: 8 }}/>
            <Box sx={{ flexGrow: 1 }}>
              <Typography sx={(theme) => ({ fontWeight: "bold", fontSize: "14px", color: theme.palette.text.primary })}>{clinician.firstName} {clinician.lastName}</Typography>
              <Typography variant="body2" sx={(theme) => ({ color: theme.palette.text.secondary, fontSize: "12px" })}>{clinician.institution || "No Institution"}</Typography>
              <Typography variant="body2" sx={(theme) => ({ color: theme.palette.text.secondary, fontSize: "12px" })}>{clinician.email}</Typography>
            </Box>
          </CardContent>
          {/* Delete button */}
          <IconButton onClick={() => onRemoveClinician(clinician.id)}
            sx={(theme) => ({position: "absolute",top: 4,right: 4,color: theme.palette.text.secondary,"&:hover": {color: theme.palette.error.main,bgcolor: alpha(theme.palette.error.main, 0.1),},padding: 0.5,})}>
            <CloseIcon fontSize="small" />
          </IconButton>
        </Card>
      ))}
    </Box>
  );
};

