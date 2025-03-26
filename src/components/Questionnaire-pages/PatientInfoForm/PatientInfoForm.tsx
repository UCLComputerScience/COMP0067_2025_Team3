'use client'

// React Imports

import { useEffect, useState } from 'react'

import { safeParse } from 'valibot'

import country from 'country-list-js'

import { useSession } from 'next-auth/react'

import { toast } from 'react-toastify'

import { v4 as uuidv4 } from 'uuid'

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

import { savePatientInfo } from '@/actions/submit-response/info-submission-action'

import { getUserDemographicAndClinical } from '@/actions/all-users/userAction'

import { InfoSchema } from '@/actions/formValidation'

import {
  ACTIVITY_LEVEL_OPTIONS,
  EDUCATION_LEVEL_OPTIONS,
  EMPLOYMENT_STATUS_OPTIONS,
  ETHNICITY_OPTIONS,
  GENDER_OPTIONS,
  SEX_OPTIONS,
  SPECIALIST_OPTIONS,
  DIAGNOSIS_OPTIONS
} from '@/constants'

import Styles from './styles.module.css'

// Set up the form data
type FormDataType = {
  age: string
  sex_at_birth: string
  gender: string
  gender_same_as_sex: boolean
  ethnicity: string
  country: string
  employment_status: string
  education_level: string
  activity_level: string
  minutes_of_exercise: string
  diagnosis_confirmed: string
  healthcare_professional: string
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
  // Session data
  const { data: session } = useSession()

  // Check that user is logged in
  let userId = ''

  if (session) {
    userId = session.user.id
  }

  // States
  const [formData, setFormData] = useState<FormDataType>({
    age: '',
    sex_at_birth: '',
    gender: '',
    gender_same_as_sex: true,
    country: '',
    ethnicity: '',
    employment_status: '',
    education_level: '',
    activity_level: '',
    minutes_of_exercise: '',
    diagnosis_confirmed: '',
    healthcare_professional: '',
    taking_medications: '',
    medications: '',
    other_conditions: ''
  })

  const handleReset = () => {
    setFormData({
      age: '',
      sex_at_birth: '',
      gender: '',
      gender_same_as_sex: false,
      ethnicity: '',
      country: '',
      employment_status: '',
      education_level: '',
      activity_level: '',
      minutes_of_exercise: '',
      diagnosis_confirmed: '',
      healthcare_professional: '',
      taking_medications: '',
      medications: '',
      other_conditions: ''
    })
  }

  const formatPatientInfo = (formData: FormDataType, userId: string) => {
    return {
      userId,
      submissionId: uuidv4(),
      age: Number(formData.age),
      sex: formData.sex_at_birth,
      gender: formData.gender,
      isSexMatchingGender: formData.gender_same_as_sex,
      ethnicity: formData.ethnicity,
      residenceCountry: formData.country,
      employment: formData.employment_status,
      education: formData.education_level,
      activityLevel: formData.activity_level,
      weeklyExerciseMinutes: Number(formData.minutes_of_exercise),
      diagnosis: formData.diagnosis_confirmed,
      diagnosedBy: formData.healthcare_professional,
      medications: formData.medications,
      otherConditions: formData.other_conditions
    }
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    const result = safeParse(InfoSchema, formData)

    console.log('Formatted patient data: ', formatPatientInfo(formData, userId))

    if (result.success) {
      console.log('Success!', result.output)
      console.log(formData)
      const databaseResult = await savePatientInfo(formatPatientInfo(formData, userId))

      if (databaseResult.success) {
        console.log('Data saved successfully')
        alert('Data saved successfully')
      } else {
        console.log('Error!', databaseResult.error)
        alert('Error saving data')
      }

      handleNext()
    } else {
      console.log('Error!', result.issues)
      alert('Please fill out all fields correctly')
    }
  }

  // Get user's information data and set it as the default

  useEffect(() => {
    const loadUserInfo = async () => {
      try {
        const userInfo = await getUserDemographicAndClinical(userId)

        console.log(userInfo)

        if (userInfo) {
          // If query is successful run toast notification
          if (!toast.isActive('correctInfo')) {
            toast.info('Is this information still correct?', { toastId: 'correctInfo' })
          }

          let taking_medication = ''

          // Change null values to strings for the form
          if (userInfo.medications === null) {
            taking_medication = 'No'

            userInfo.medications = 'n/a'
          }

          if (userInfo.otherConditions === null) {
            userInfo.otherConditions = 'None'
          }

          setFormData({
            age: userInfo.age.toString(),
            sex_at_birth: userInfo.sex,
            gender_same_as_sex: userInfo.isSexMatchingGender,
            gender: userInfo.gender,
            ethnicity: userInfo.ethnicity,
            country: userInfo.residenceCountry,
            employment_status: userInfo.employment,
            education_level: userInfo.education,
            activity_level: userInfo.activityLevel,
            minutes_of_exercise: userInfo.weeklyExerciseMinutes.toString(),
            diagnosis_confirmed: userInfo.diagnosis,
            healthcare_professional: userInfo.diagnosedBy,
            taking_medications: taking_medication,
            medications: userInfo.medications,
            other_conditions: userInfo.otherConditions
          })
        }
      } catch {
        console.log('error')
      }
    }

    loadUserInfo()
  }, [userId])

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
                  onChange={e => setFormData({ ...formData, gender_same_as_sex: !!e.target.value })}
                >
                  <MenuItem value='true'>Yes</MenuItem>
                  <MenuItem value='false'>No</MenuItem>
                  <MenuItem value='null'>Prefer not to say</MenuItem>
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
                  {DIAGNOSIS_OPTIONS.map((option, index) => (
                    <MenuItem key={index} value={option}>
                      {option}
                    </MenuItem>
                  ))}
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
