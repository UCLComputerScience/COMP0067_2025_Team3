'use client'

// React Imports
import { useState } from 'react'

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

import Styles from './styles.module.css'

type FormDataType = {
  username: string
  email: string
  password: string
  isPasswordShown: boolean
  confirmPassword: string
  isConfirmPasswordShown: boolean
  firstName: string
  lastName: string
  country: string
  language: string[]
  date: Date | null
  phoneNumber: string
}

const PatientInfoForm = ({ handleNext }) => {
  // States
  const [formData, setFormData] = useState<FormDataType>({
    username: '',
    email: '',
    password: '',
    isPasswordShown: false,
    confirmPassword: '',
    isConfirmPasswordShown: false,
    firstName: '',
    lastName: '',
    country: '',
    language: [],
    date: null,
    phoneNumber: ''
  })

  const handleReset = () => {
    setFormData({
      username: '',
      email: '',
      password: '',
      isPasswordShown: false,
      confirmPassword: '',
      isConfirmPasswordShown: false,
      firstName: '',
      lastName: '',
      country: '',
      language: [],
      date: null,
      phoneNumber: ''
    })
  }

  return (
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
              <TextField fullWidth label='Age' />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Typography className={Styles.info_questions}>{'What sex were you assigned at birth? '}</Typography>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <FormControl fullWidth>
                <InputLabel>Select Sex</InputLabel>
                <Select multiple label='Select Sex'></Select>
              </FormControl>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Typography className={Styles.info_questions}>What Best Describes your gender?</Typography>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <FormControl fullWidth>
                <InputLabel>Select Gender</InputLabel>
                <Select multiple label='Select Gender'></Select>
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
                <Select multiple label='Select'></Select>
              </FormControl>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Typography className={Styles.info_questions}>What is your ethnicity?</Typography>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <FormControl fullWidth>
                <InputLabel>Select Ethnicity</InputLabel>
                <Select multiple label='Select Ethnicity'></Select>
              </FormControl>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Typography className={Styles.info_questions}>What is your country of residence?</Typography>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <FormControl fullWidth>
                <InputLabel>Select Country</InputLabel>
                <Select multiple label='Select Country'></Select>
              </FormControl>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Typography className={Styles.info_questions}>What is your employment status?</Typography>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <FormControl fullWidth>
                <InputLabel>Select employment status</InputLabel>
                <Select multiple label='Select Employment'></Select>
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
                <Select multiple label='Select Education'></Select>
              </FormControl>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Typography className={Styles.info_questions}>How active would you say you are?</Typography>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <FormControl fullWidth>
                <InputLabel>Select</InputLabel>
                <Select multiple label='Select Activity Level'></Select>
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
              <TextField fullWidth label='Enter your input here' />
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
                <Select multiple label='Select Diagnosis State'></Select>
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
                <Select multiple label='Select Healthcare Professional'></Select>
              </FormControl>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Typography className={Styles.info_questions}>Are you currently receiving treatment?</Typography>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <FormControl fullWidth>
                <InputLabel>Select</InputLabel>
                <Select multiple label='Select Treatment'></Select>
              </FormControl>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Typography className={Styles.info_questions}>Are you taking medications?</Typography>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <FormControl fullWidth>
                <InputLabel>Select</InputLabel>
                <Select multiple label='Select Medication'></Select>
              </FormControl>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Typography className={Styles.info_questions}>What medication do you take?</Typography>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField fullWidth label='List your medications' />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Typography className={Styles.info_questions}>Do you have other medical conditions?</Typography>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField fullWidth label='Enter your input here' />
            </Grid>
          </Grid>
        </CardContent>
        <Divider />
        <CardActions>
          <Button type='submit' variant='contained' className='mie-2' onClick={handleNext}>
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
