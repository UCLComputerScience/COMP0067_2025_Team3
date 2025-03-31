/* eslint-disable */
// move to components? (could only move password box maybe)

// hydration error

// *Could have* --> requirements changing to green as they are satisfied
// *Could have* --> invited clinicians saved in the database
// *Could have* --> phone number validation

'use client'

import React, { useState, useEffect } from 'react'

import { useRouter } from 'next/navigation'

import {
  Box,
  Button,
  Card,
  CardContent,
  TextField,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Switch,
  Chip
} from '@mui/material'
import Grid from '@mui/material/Grid2'

import { saveShareData, deleteClinician } from '@/actions/patientSettings/userActions'

import type { ClinicianData, UserData } from '@/app/(private)/my-profile/patient-settings/page'

import DataPrivacyForm from '@/components/DataPrivacyForm'
import ChangePasswordForm from '@/components/ChangePasswordForm'
import AccountSettingForm from '@/components/account-setting-form'

interface Props {
  initialData: UserData
  clinicians: ClinicianData[]
}

const UserProfile = ({ initialData, clinicians = [] }: Props) => {
  const router = useRouter()
  const [formData, setFormData] = useState<UserData | null>(initialData)

  const [agreedForResearch, setAgreedForResearch] = useState(!!formData?.agreedForResearch)
  const [cliniciansData, setCliniciansData] = useState(clinicians)

  useEffect(() => {
    setFormData(initialData)
  }, [initialData])

  if (!formData) {
    return <div>Loading...</div> // Render loading until user data is available
  }

  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    setAgreedForResearch(!!formData?.agreedForResearch)
  }, [formData])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Connected':
        return 'success'
      case 'Pending':
        return 'warning'
      case 'Invited':
        return 'primary'
      default:
        return 'primary'
    }
  }

  const handleClinicianSwitch = async (clinicianId: string, newValue: boolean, patientId: string) => {
    setCliniciansData(prevClinicians =>
      prevClinicians.map(clinician =>
        clinician.id === clinicianId ? { ...clinician, agreedToShareData: newValue } : clinician
      )
    )

    try {
      formData.id === patientId
      const result = await saveShareData(clinicianId, newValue, patientId)

      if (!result.success) {
        throw new Error('Failed to save clinician data share consent')
      }
    } catch (error) {
      console.error('Error saving clinician data consent:', error)
      setCliniciansData(prevClinicians =>
        prevClinicians.map(clinician =>
          clinician.id === clinicianId
            ? { ...clinician, agreedToShareData: !newValue } // Revert state if API fails
            : clinician
        )
      )
    }
  }

  const handleDelete = async (clinicianId: string, patientId: string) => {
    const prevClinicians = [...cliniciansData]

    setCliniciansData(prevClinicians.filter(clinician => clinician.id !== clinicianId))

    try {
      const result = await deleteClinician(clinicianId, patientId)

      if (!result.success) {
        throw new Error('Failed to delete clinician')
      }
    } catch (error) {
      console.error('Error deleting clinician:', error)
      setCliniciansData(prevClinicians)
    }
  }

  const confirmDelete = (clinicianId: string, patientId: string) => {
    if (window.confirm('Are you sure you want to delete this clinician?')) {
      handleDelete(clinicianId, patientId)
    }
  }

  return (
    <>
      <Grid container spacing={4}>
        <AccountSettingForm />
        <ChangePasswordForm />
        <DataPrivacyForm />
      </Grid>

      {/* Linked Clinicians Card*/}
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <Card sx={{ width: 2000, p: 3 }}>
          <Typography variant='h5' gutterBottom>
            Linked Clinicians
          </Typography>
          <CardContent>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>USER</TableCell>
                    <TableCell>EMAIL</TableCell>
                    <TableCell>PROFESSION</TableCell>
                    <TableCell>STATUS</TableCell>
                    <TableCell>DATA ACCESS</TableCell>
                    <TableCell></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {clinicians.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} style={{ textAlign: 'center', padding: '20px' }}>
                        {/* eslint-disable-next-line react/no-unescaped-entities */}
                        You don&apos;t have clinicians linked yet. Please add a clinician below.
                      </TableCell>
                    </TableRow>
                  ) : (
                    cliniciansData.map((clinician, index) => (
                      <TableRow key={index}>
                        <TableCell>
                          <div>
                            <i className='ri-hospital-line' style={{ color: 'orange' }}></i>
                            <Typography variant='body1'>
                              {clinician.firstName} {clinician.lastName}
                            </Typography>
                          </div>
                          <Typography variant='body2' color='secondary'>
                            {clinician.institution}
                          </Typography>
                        </TableCell>
                        <TableCell>{clinician.email}</TableCell>
                        <TableCell>{clinician.profession}</TableCell>
                        <TableCell>
                          <Chip label={clinician.status} variant='tonal' color={getStatusColor(clinician.status)} />
                        </TableCell>
                        <TableCell>
                          <Switch
                            color='success'
                            checked={!!clinician.agreedToShareData}
                            onChange={e => handleClinicianSwitch(clinician.id, e.target.checked, formData.id)}
                          />
                        </TableCell>
                        <TableCell>
                          <Button
                            color='secondary'
                            startIcon={<i className='ri-delete-bin-7-line' />}
                            onClick={() => confirmDelete(clinician.id, formData.id)}
                          ></Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
            {/* Add Clinician Button */}
            <Box sx={{ display: 'flex', justifyContent: 'flex-start', gap: 2, mt: 3 }}>
              <Button
                variant='contained'
                color='primary'
                onClick={() => router.push('/my-profile/patient-settings/add-clinician')}
              >
                Add Clinician
              </Button>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </>
  )
}

export default UserProfile
