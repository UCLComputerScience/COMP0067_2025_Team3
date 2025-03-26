'use client'

// React Imports
import { useState } from 'react'

import { safeParse } from 'valibot'
// eslint-disable-next-line import/no-unresolved
import country from 'country-list-js'

// MUI Imports

import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid2'
import Button from '@mui/material/Button'
import Select from '@mui/material/Select'
import Divider from '@mui/material/Divider'
import MenuItem from '@mui/material/MenuItem'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'
import CardActions from '@mui/material/CardActions'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'

import { InfoSchema } from '@/actions/formValidation'

import {
  ACTIVITY_LEVEL_OPTIONS,
  EDUCATION_LEVEL_OPTIONS,
  EMPLOYMENT_STATUS_OPTIONS,
  ETHNICITY_OPTIONS,
  GENDER_OPTIONS,
  GENDER_SAME_AS_SEX_OPTIONS,
  SEX_OPTIONS,
  SPECIALIST_OPTIONS
} from '@/constants'

import Styles from './styles.module.css'

// Set up the form data
type FormDataType = {
  age: string
  sex_at_birth: string
  gender: string
  gender_same_as_sex: string
  ethnicity: string
  country: string
  employment_status: string
  education_level: string
  activity_level: string
  minutes_of_exercise: string
  diagnosis_confirmed: string
  healthcare_professional: string
  receiving_treatment: string
  treatment: string
  taking_medications: string
  medications: string
  other_conditions: string
}

interface PatientInfoFormProps {
  handleNext: () => void
}

const COUNTRIES = country.names()

// Give the Info form the handleNext prop defined in the stepper
const PatientInfoForm = ({ handleNext }: PatientInfoFormProps) => {
  // States
  const [formData, setFormData] = useState<FormDataType>({
    age: '',
    sex_at_birth: '',
    gender: '',
    gender_same_as_sex: '',
    country: '',
    ethnicity: '',
    employment_status: '',
    education_level: '',
    activity_level: '',
    minutes_of_exercise: '',
    diagnosis_confirmed: '',
    healthcare_professional: '',
    receiving_treatment: '',
    treatment: '',
    taking_medications: '',
    medications: '',
    other_conditions: ''
  })

  const handleReset = () => {
    setFormData({
      age: '',
      sex_at_birth: '',
      gender: '',
      gender_same_as_sex: '',
      ethnicity: '',
      country: '',
      employment_status: '',
      education_level: '',
      activity_level: '',
      minutes_of_exercise: '',
      diagnosis_confirmed: '',
      healthcare_professional: '',
      receiving_treatment: '',
      treatment: '',
      taking_medications: '',
      medications: '',
      other_conditions: ''
    })
  }

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault()
    const result = safeParse(InfoSchema, formData)

    if (result.success) {
      console.log('Success!', result.output)
      console.log(formData)
      handleNext()
    } else {
      console.log('Error!', result.issues)
      alert('Please fill out all fields correctly')
    }
  }

  return (

    // Return the Information form
    <Box>
      <form onSubmit={e => e.preventDefault()}>
        <CardContent>
          <Grid container spacing={5}>
            <Grid size={{ xs: 12 }}>
              <Typography variant='h2'>Personal Information</Typography>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Typography className={Styles.info_questions}>What is your age?</Typography>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                label='Age'
                value={formData.age}
                onChange={e => setFormData({ ...formData, age: e.target.value })}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Typography className={Styles.info_questions}>{'What sex were you assigned at birth? '}</Typography>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <FormControl fullWidth>
                <InputLabel>Select Sex</InputLabel>
                <Select
                  label='Select Sex'
                  value={formData.sex_at_birth}
                  onChange={e => setFormData({ ...formData, sex_at_birth: e.target.value })}
                >
                  {SEX_OPTIONS.map((option, index) => (
                    <MenuItem key={index} value={option}>
                      {option}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Typography className={Styles.info_questions}>What Best Describes your gender?</Typography>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <FormControl fullWidth>
                <InputLabel>Select Gender</InputLabel>
                <Select
                  label='Select Gender'
                  value={formData.gender}
                  onChange={e => setFormData({ ...formData, gender: e.target.value })}
                >
                  {GENDER_OPTIONS.map((option, index) => (
                    <MenuItem key={index} value={option}>
                      {option}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Typography className={Styles.info_questions}>
                Is your gender the same as the sex you <br />
                were assigned at birth?
              </Typography>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <FormControl fullWidth>
                <InputLabel>Select</InputLabel>
                <Select
                  label='Select'
                  value={formData.gender_same_as_sex}
                  onChange={e => setFormData({ ...formData, gender_same_as_sex: e.target.value })}
                >
                  {GENDER_SAME_AS_SEX_OPTIONS.map((option, index) => (
                    <MenuItem key={index} value={option}>
                      {option}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Typography className={Styles.info_questions}>What is your ethnicity?</Typography>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <FormControl fullWidth>
                <InputLabel>Select Ethnicity</InputLabel>
                <Select
                  label='Select Ethnicity'
                  value={formData.ethnicity}
                  onChange={e =>
                    setFormData({
                      ...formData,
                      ethnicity: e.target.value
                    })
                  }
                >
                  {ETHNICITY_OPTIONS.map((option, index) => (
                    <MenuItem key={index} value={option}>
                      {option}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Typography className={Styles.info_questions}>What is your country of residence?</Typography>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <FormControl fullWidth>
                <InputLabel>Select Country</InputLabel>
                <Select
                  label='Select Country'
                  value={formData.country}
                  onChange={e => setFormData({ ...formData, country: e.target.value })}
                >
                  {COUNTRIES.map((country, index) => (
                    <MenuItem key={index} value={country}>
                      {country}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Typography className={Styles.info_questions}>What is your employment status?</Typography>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <FormControl fullWidth>
                <InputLabel>Select employment status</InputLabel>
                <Select
                  label='Select Employment'
                  value={formData.employment_status}
                  onChange={e => setFormData({ ...formData, employment_status: e.target.value })}
                >
                  {EMPLOYMENT_STATUS_OPTIONS.map((option, index) => (
                    <MenuItem key={index} value={option}>
                      {option}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Typography className={Styles.info_questions}>
                What is the highest level of education you have completed?
              </Typography>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <FormControl fullWidth>
                <InputLabel>Select Education</InputLabel>
                <Select
                  label='Select Education'
                  value={formData.education_level}
                  onChange={e => setFormData({ ...formData, education_level: e.target.value })}
                >
                  {EDUCATION_LEVEL_OPTIONS.map((option, index) => (
                    <MenuItem key={index} value={option}>
                      {option}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Typography className={Styles.info_questions}>How active would you say you are?</Typography>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <FormControl fullWidth>
                <InputLabel>Select</InputLabel>
                <Select
                  label='Select Activity Level'
                  value={formData.activity_level}
                  onChange={e => setFormData({ ...formData, activity_level: e.target.value })}
                >
                  {ACTIVITY_LEVEL_OPTIONS.map((option, index) => (
                    <MenuItem key={index} value={option}>
                      {option}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Typography className={Styles.info_questions}>
                How many minutes of moderate to high
                <br />
                intensity exercise do you do per week?
              </Typography>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                label='Enter your input here'
                value={formData.minutes_of_exercise}
                onChange={e => setFormData({ ...formData, minutes_of_exercise: e.target.value })}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}></Grid>
            <Grid size={{ xs: 12 }}>
              <Typography variant='h2' className='font-medium'>
                Clinical Information
              </Typography>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Typography className={Styles.info_questions}>
                Has your diagnosis been confirmed by a healthcare professional?
              </Typography>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <FormControl fullWidth>
                <InputLabel>Select</InputLabel>
                <Select
                  label='Select Diagnosis State'
                  value={formData.diagnosis_confirmed}
                  onChange={e => {
                    if (e.target.value === 'No') {
                      setFormData({ ...formData, diagnosis_confirmed: e.target.value, healthcare_professional: 'n/a' })
                    } else {
                      setFormData({ ...formData, diagnosis_confirmed: e.target.value })
                    }
                  }}
                >
                  <MenuItem value='Yes'>Yes</MenuItem>
                  <MenuItem value='No'>No</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Typography className={Styles.info_questions}>
                Which healthcare professional gave you
                <br />
                your diagnosis?
              </Typography>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <FormControl fullWidth>
                <InputLabel>Select</InputLabel>
                <Select
                  label='Select Healthcare Professional'
                  disabled={formData.diagnosis_confirmed === 'No'}
                  value={formData.healthcare_professional}
                  onChange={e => {
                    if (formData.diagnosis_confirmed === 'No') {
                      setFormData({ ...formData, healthcare_professional: 'n/a' })
                    } else {
                      setFormData({ ...formData, healthcare_professional: e.target.value })
                    }
                  }}
                >
                  <MenuItem value='n/a' hidden>
                    n/a
                  </MenuItem>
                  {SPECIALIST_OPTIONS.map((option, index) => (
                    <MenuItem key={index} value={option}>
                      {option}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Typography className={Styles.info_questions}>Are you currently receiving treatment?</Typography>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <FormControl fullWidth>
                <InputLabel>Select</InputLabel>
                <Select
                  label='Select Treatment'
                  value={formData.receiving_treatment}
                  onChange={e => {
                    if (e.target.value === 'No') {
                      setFormData({ ...formData, receiving_treatment: e.target.value, treatment: 'n/a' })
                    } else {
                      setFormData({ ...formData, receiving_treatment: e.target.value })
                    }
                  }}
                >
                  <MenuItem value='Yes'>Yes</MenuItem>
                  <MenuItem value='No'>No</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Typography className={Styles.info_questions}>What treatment are you receiving?</Typography>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                disabled={formData.receiving_treatment === 'No'}
                label='List your treatments'
                value={formData.treatment}
                onChange={e => {
                  if (formData.receiving_treatment === 'No') {
                    setFormData({ ...formData, treatment: 'n/a' })
                  } else {
                    setFormData({ ...formData, treatment: e.target.value })
                  }
                }}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Typography className={Styles.info_questions}>Are you taking medications?</Typography>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <FormControl fullWidth>
                <InputLabel>Select</InputLabel>
                <Select
                  label='Select Medication'
                  value={formData.taking_medications}
                  onChange={e => {
                    if (e.target.value === 'No') {
                      setFormData({ ...formData, taking_medications: e.target.value, medications: 'n/a' })
                    } else {
                      setFormData({ ...formData, taking_medications: e.target.value })
                    }
                  }}
                >
                  <MenuItem value='Yes'>Yes</MenuItem>
                  <MenuItem value='No'>No</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Typography className={Styles.info_questions}>What medication do you take?</Typography>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                disabled={formData.taking_medications === 'No'}
                label='List your medications'
                value={formData.medications}
                onChange={e => {
                  if (formData.taking_medications === 'No') {
                    setFormData({ ...formData, medications: 'n/a' })
                  } else {
                    setFormData({ ...formData, medications: e.target.value })
                  }
                }}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Typography className={Styles.info_questions}>Do you have other medical conditions?</Typography>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                label='Enter your input here'
                value={formData.other_conditions}
                onChange={e => setFormData({ ...formData, other_conditions: e.target.value })}
              />
            </Grid>
          </Grid>
        </CardContent>
        <Divider />
        <CardActions>
          <Button type='submit' variant='contained' className='mie-2' onClick={handleSubmit}>
            Next
          </Button>
          <Button
            type='reset'
            variant='outlined'
            onClick={() => {
              handleReset()
            }}
          >
            Reset
          </Button>
        </CardActions>
      </form>
    </Box>
  )
}

export default PatientInfoForm
