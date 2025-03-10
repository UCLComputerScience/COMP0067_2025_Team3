"use client";

import React, { useState, useRef, useEffect } from "react";
import { 
  Box, Typography, TextField, Button, Link,
  InputAdornment
} from "@mui/material";
import { searchClinicians } from "@/actions/registerActions";

// Define the Clinician interface
export interface Clinician {
  id: string;
  firstName: string;
  lastName: string;
  institution: string;
  email: string;
}

interface ClinicianSearchProps {
  onSaveClinician: (clinician: Clinician) => void;
  savedClinicians: Clinician[];
}

const ClinicianSearch = ({ onSaveClinician, savedClinicians }: ClinicianSearchProps) => {
  // Clinician search and selection states
  const [searchFirstName, setSearchFirstName] = useState("");
  const [searchLastName, setSearchLastName] = useState("");
  const [searchInstitution, setSearchInstitution] = useState("");
  const [searchEmail, setSearchEmail] = useState("");
  const [clinicianList, setClinicianList] = useState<Clinician[]>([]);
  const [selectedClinician, setSelectedClinician] = useState<Clinician | null>(null);
  const [searchPerformed, setSearchPerformed] = useState(false);

  // Infinite scroll states
  const [visibleCount, setVisibleCount] = useState(10);
  const observerRef = useRef(null);

  const loadMoreClinicians = () => {
    setVisibleCount((prev) => prev + 10); // Load 10 more items each time
  };

  useEffect(() => {
    if (!observerRef.current) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          loadMoreClinicians(); // Load more when scrolled to bottom
        }
      },
      { threshold: 1.0 }
    );
    observer.observe(observerRef.current);
    return () => observer.disconnect();
  }, []);

  // Search for clinicians
  const handleSearchClinician = async () => {
    console.log("🔍 Searching for clinicians...");
    setSearchPerformed(true);
    
    // Clear previous search results
    setClinicianList([]);
    
    // Build search parameters, only include fields with values
    const searchParams: Record<string, string> = {};
    
    if (searchFirstName.trim()) searchParams.firstName = searchFirstName.trim();
    if (searchLastName.trim()) searchParams.lastName = searchLastName.trim();
    if (searchInstitution.trim()) searchParams.institution = searchInstitution.trim();
    if (searchEmail.trim()) searchParams.email = searchEmail.trim();
    
    console.log("Search params:", searchParams);
    
    // Check if at least one search parameter exists
    if (Object.keys(searchParams).length === 0) {
      console.log("Please enter at least one search parameter");
      return;
    }
    
    const response = await searchClinicians(searchParams);
    
    if (response && response.success) {
      setClinicianList(response.clinicians as Clinician[]);
    } else {
      console.error("Clinician search failed:", response.error);
      setClinicianList([]);
    }
  };

  // Select a clinician
  const handleSelectClinician = (clinician: Clinician) => {
    setSelectedClinician(clinician);
  };

  // Save the selected clinician
  const handleSaveClinician = () => {
    if (!selectedClinician) {
      alert("Please select a clinician first.");
      return;
    }
    
    // Check if clinician is already saved
    const isClinicalAlreadySaved = savedClinicians.some(
      clinician => clinician.id === selectedClinician.id
    );
    
    if (isClinicalAlreadySaved) {
      alert("This clinician is already saved.");
      return;
    }
    
    // Add to saved clinicians list via callback
    onSaveClinician(selectedClinician);
    
    // Clear search area
    setSearchFirstName("");
    setSearchLastName("");
    setSearchInstitution("");
    setSearchEmail("");
    setClinicianList([]);
    setSearchPerformed(false);
    setSelectedClinician(null);
  };

  return (
    <>
      <Typography variant="h6" sx={{ marginTop: 3, marginBottom: 2, color: 'white' }}>
        Search Clinician
      </Typography>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <TextField 
          placeholder="First Name"
          fullWidth 
          variant="outlined"
          value={searchFirstName} 
          onChange={(e) => setSearchFirstName(e.target.value)}
          InputProps={{
            sx: { 
              bgcolor: 'rgba(255, 255, 255, 0.05)', 
              borderRadius: '4px',
              color: 'white',
              '&::placeholder': {
                color: 'rgba(255, 255, 255, 0.7)',
              }
            }
          }}
          InputLabelProps={{
            shrink: true,
            sx: { color: 'rgba(255, 255, 255, 0.7)' }
          }}
          sx={{ 
            '& .MuiOutlinedInput-root': {
              '& fieldset': {
                borderColor: 'rgba(255, 255, 255, 0.2)',
              },
              '&:hover fieldset': {
                borderColor: 'rgba(255, 255, 255, 0.3)',
              },
              '&.Mui-focused fieldset': {
                borderColor: '#6e41e2',
              },
            },
          }}
        />
        <TextField 
          placeholder="Last Name"
          fullWidth 
          variant="outlined"
          value={searchLastName} 
          onChange={(e) => setSearchLastName(e.target.value)}
          InputProps={{
            sx: { 
              bgcolor: 'rgba(255, 255, 255, 0.05)', 
              borderRadius: '4px',
              color: 'white' 
            }
          }}
          InputLabelProps={{
            shrink: true,
            sx: { color: 'rgba(255, 255, 255, 0.7)' }
          }}
          sx={{ 
            '& .MuiOutlinedInput-root': {
              '& fieldset': {
                borderColor: 'rgba(255, 255, 255, 0.2)',
              },
              '&:hover fieldset': {
                borderColor: 'rgba(255, 255, 255, 0.3)',
              },
              '&.Mui-focused fieldset': {
                borderColor: '#6e41e2',
              },
            },
          }}
        />
        <TextField 
          placeholder="Organization"
          fullWidth 
          variant="outlined"
          value={searchInstitution} 
          onChange={(e) => setSearchInstitution(e.target.value)}
          InputProps={{
            sx: { 
              bgcolor: 'rgba(255, 255, 255, 0.05)', 
              borderRadius: '4px',
              color: 'white' 
            }
          }}
          InputLabelProps={{
            shrink: true,
            sx: { color: 'rgba(255, 255, 255, 0.7)' }
          }}
          sx={{ 
            '& .MuiOutlinedInput-root': {
              '& fieldset': {
                borderColor: 'rgba(255, 255, 255, 0.2)',
              },
              '&:hover fieldset': {
                borderColor: 'rgba(255, 255, 255, 0.3)',
              },
              '&.Mui-focused fieldset': {
                borderColor: '#6e41e2',
              },
            },
          }}
        />
        <TextField 
          placeholder="Email"
          fullWidth 
          variant="outlined"
          value={searchEmail} 
          onChange={(e) => setSearchEmail(e.target.value)}
          InputProps={{
            sx: { 
              bgcolor: 'rgba(255, 255, 255, 0.05)', 
              borderRadius: '4px',
              color: 'white' 
            }
          }}
          InputLabelProps={{
            shrink: true,
            sx: { color: 'rgba(255, 255, 255, 0.7)' }
          }}
          sx={{ 
            '& .MuiOutlinedInput-root': {
              '& fieldset': {
                borderColor: 'rgba(255, 255, 255, 0.2)',
              },
              '&:hover fieldset': {
                borderColor: 'rgba(255, 255, 255, 0.3)',
              },
              '&.Mui-focused fieldset': {
                borderColor: '#6e41e2',
              },
            },
          }}
        />
      </Box>
      <Box sx={{ display: 'flex', justifyContent: 'flex-start', marginTop: 2 }}>
        <Button 
          variant="contained" 
          onClick={handleSearchClinician}
          sx={{ 
            bgcolor: '#6e41e2', 
            color: 'white', 
            '&:hover': { bgcolor: '#5835b5' },
            borderRadius: '4px',
            padding: '8px 16px',
            textTransform: 'none'
          }}
        >
          Search
        </Button>
      </Box>

      {/* No Results Message */}
      {searchPerformed && clinicianList.length === 0 && (
        <Box sx={{ textAlign: 'center', marginTop: 2, color: '#666' }}>
          <Typography variant="body2">
            Cannot find your clinician? <Link href="#" sx={{ color: '#6e41e2' }}>Invite them to create an account</Link>
          </Typography>
        </Box>
      )}

      {/* Clinician Results Count */}
      {clinicianList.length > 0 && (
        <Box sx={{ marginTop: 2 }}>
          <Typography variant="body2" sx={{ color: '#666' }}>
            {clinicianList.length} Results
          </Typography>
        </Box>
      )}

      {/* Clinician search results with infinite scroll */}
      {clinicianList.length > 0 && (
        <Box sx={{ 
          marginTop: 2, 
          maxHeight: "400px", 
          overflowY: "auto"
        }}>
          {clinicianList.slice(0, visibleCount).map((clinician, index) => (
            <Box 
              key={index} 
              sx={{ 
                padding: 1.5,
                cursor: "pointer", 
                borderBottom: index < clinicianList.length - 1 ? "1px solid #eee" : "none",
                backgroundColor: selectedClinician?.id === clinician.id ? "#f8f5ff" : "transparent",
                "&:hover": { backgroundColor: "#f8f5ff" },
                display: 'flex',
                alignItems: 'center',
              }}
              onClick={() => handleSelectClinician(clinician)}
            >
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
                <Typography sx={{ fontWeight: 'bold', fontSize: '14px' }}>{clinician.firstName} {clinician.lastName}</Typography>
                <Typography variant="body2" sx={{ color: '#666', fontSize: '12px' }}>{clinician.institution || "No Institution"}</Typography> 
                <Typography variant="body2" sx={{ color: '#666', fontSize: '12px' }}>{clinician.email}</Typography>
              </Box>
            </Box>
          ))}
          <div ref={observerRef}></div>
        </Box>
      )}

      {/* Save Button */}
      {clinicianList.length > 0 && (
        <Box sx={{ display: 'flex', justifyContent: 'flex-start', margin: '20px 0' }}>
          <Button 
            variant="contained"
            sx={{ 
              bgcolor: '#7e57c2', 
              color: 'white', 
              '&:hover': { bgcolor: '#6a4db4' },
              borderRadius: '4px',
              padding: '8px 16px',
              textTransform: 'none'
            }}
            onClick={handleSaveClinician}
            disabled={!selectedClinician}
          >
            Save
          </Button>
        </Box>
      )}
    </>
  );
};

export default ClinicianSearch;
