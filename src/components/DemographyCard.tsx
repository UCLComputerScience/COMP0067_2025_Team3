'use client'

import { Card, CardContent, CardHeader, Typography, Divider, Box } from '@mui/material'
import Grid from '@mui/material/Grid2'

interface DemographyCardProps {
  patientInfo: {
    user: {
      id: string
      email: string
      firstName: string
      lastName: string
      phoneNumber?: string | null
      address?: string | null
      dateOfBirth?: Date | null
      hospitalNumber?: string | null
    }
    age?: number | null
    sex?: string | null
    gender?: string | null
    isSexMatchingGender?: boolean | null
    ethnicity?: string | null
    residenceCountry?: string | null
    employment?: string | null
    education?: string | null
    activityLevel?: string | null
    weeklyExerciseMinutes?: number | null
    diagnosis?: string | null
    diagnosedBy?: string | null
    medications?: string | null
    otherConditions?: string | null
  } | null
}

const DemographyCard = ({ patientInfo }: DemographyCardProps) => {
  if (!patientInfo) {
    return (
      <Card className='w-full'>
        <CardHeader title='Patient Details' />
        <CardContent>
          <Typography>No patient information available</Typography>
        </CardContent>
      </Card>
    )
  }

  const formatDate = (date?: Date | null) => {
    if (!date) return 'Not provided'
    
return new Date(date).toLocaleDateString()
  }

  const displayValue = (value: any) => {
    if (value === null || value === undefined || value === '') {
      return 'Not provided'
    }

    
return value.toString()
  }

  const personalFields = [
    { label: 'Full Name', value: `${patientInfo.user.firstName} ${patientInfo.user.lastName}` },
    { label: 'Email', value: patientInfo.user.email },
    { label: 'Phone Number', value: displayValue(patientInfo.user.phoneNumber) },
    { label: 'Address', value: displayValue(patientInfo.user.address) },
    { label: 'Date of Birth', value: formatDate(patientInfo.user.dateOfBirth) },
    { label: 'Hospital Number', value: displayValue(patientInfo.user.hospitalNumber) },
    { label: 'Age', value: displayValue(patientInfo.age) }
  ]

  const demographicFields = [
    { label: 'Sex', value: displayValue(patientInfo.sex) },
    { label: 'Gender', value: displayValue(patientInfo.gender) },
    { label: 'Sex Matching Gender', value: patientInfo.isSexMatchingGender ? 'Yes' : 'No' },
    { label: 'Ethnicity', value: displayValue(patientInfo.ethnicity) },
    { label: 'Country of Residence', value: displayValue(patientInfo.residenceCountry) },
    { label: 'Employment Status', value: displayValue(patientInfo.employment) },
    { label: 'Education Level', value: displayValue(patientInfo.education) }
  ]

  const healthFields = [
    { label: 'Activity Level', value: displayValue(patientInfo.activityLevel) },
    { label: 'Weekly Exercise (minutes)', value: displayValue(patientInfo.weeklyExerciseMinutes) },
    { label: 'Diagnosis', value: displayValue(patientInfo.diagnosis) },
    { label: 'Diagnosed By', value: displayValue(patientInfo.diagnosedBy) },
    { label: 'Medications', value: displayValue(patientInfo.medications) },
    { label: 'Other Conditions', value: displayValue(patientInfo.otherConditions) }
  ]

  const FieldItem = ({ label, value }: { label: string; value: string }) => (
    <Box sx={{ mb: 4 }}>
      <div className='flex items-center flex-wrap gap-x-1.5'>
        <Typography className='font-medium' color='text.primary'>
          {label}:
        </Typography>
        <Typography>{value}</Typography>
      </div>
    </Box>
  )

  return (
    <Card className='w-full'>
      <CardHeader title='Patient Details' />
      <CardContent>
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 12 }}>
            <Typography variant='h6' sx={{ mb: 2 }}>
              Personal Information
            </Typography>
            <Divider sx={{ mb: 4 }} />
            {personalFields.map((field, index) => (
              <FieldItem key={index} label={field.label} value={field.value} />
            ))}
          </Grid>

          <Grid size={{ xs: 12, md: 12 }}>
            <Typography variant='h6' sx={{ mt: 2, mb: 2 }}>
              Demographic Information
            </Typography>
            <Divider sx={{ mb: 4 }} />
            {demographicFields.map((field, index) => (
              <FieldItem key={index} label={field.label} value={field.value} />
            ))}
          </Grid>

          <Grid size={{ xs: 8, md: 12 }}>
            <Typography variant='h6' sx={{ mt: 2, mb: 2 }}>
              Health Information
            </Typography>
            <Divider sx={{ mb: 4 }} />
            {healthFields.map((field, index) => (
              <FieldItem key={index} label={field.label} value={field.value} />
            ))}
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  )
}

export default DemographyCard
