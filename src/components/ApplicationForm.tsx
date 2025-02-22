'use client'

// React Imports
import { useEffect, useState } from 'react'

// MUI Imports
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid2'
import Button from '@mui/material/Button'
import Select from '@mui/material/Select'
import Divider from '@mui/material/Divider'
import MenuItem from '@mui/material/MenuItem'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import CardActions from '@mui/material/CardActions'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import InputAdornment from '@mui/material/InputAdornment'
import IconButton from '@mui/material/IconButton'

import Form from 'next/form'

// Styled Component Imports
import AppReactDatepicker from '@/libs/styles/AppReactDatepicker'
import DateRangePicker from './DateRangePicker'
import FormControlLabel from '@mui/material/FormControlLabel'
import Checkbox from '@mui/material/Checkbox'
import LabeledCheckbox from './LabeledCheckbox'
import FileUpload from './FileUpload'

type FormDataType = {
  researchTitle: string
  researchQuestion: string
  instituion: string
  expectedStartDate: Date | null | undefined
  expectedEndDate: Date | null | undefined
  summary: string
  documents?: string
  demographicDataAccess: string[]
  questionnaireAccess: string[]
}

const dataAccessAttributes = {
  demographic: [
    'Age',
    'Gender',
    'Sex',
    'Gender Same as Sex',
    'Ethnicity',
    'Geographical Location',
    'Diagnosis',
    'Person who Give Diagnosis',
    'Activity Levels/Excercises',
    'Education Levels',
    'Employment Status'
  ],
  questionnaire: ['Single episode questionnaire', 'Longitudinal data (multiple questionnaires over time)']
}

const ApplicationForm = () => {
  // States
  const [formData, setFormData] = useState<FormDataType>({
    researchTitle: '',
    researchQuestion: '',
    instituion: '',
    expectedStartDate: null,
    expectedEndDate: null,
    summary: '',
    demographicDataAccess: [], // Initialize as empty array
    questionnaireAccess: [] // Initialize as empty array
  })

  const handleReset = () => {
    setFormData({
      researchTitle: '',
      researchQuestion: '',
      instituion: '',
      expectedStartDate: null,
      expectedEndDate: null,
      summary: '',
      demographicDataAccess: [],
      questionnaireAccess: []
    })
  }

  const handleCheckboxChange = (type: 'demographic' | 'questionnaire', value: string) => {
    setFormData(prev => {
      const updatedData = { ...prev }

      if (type === 'demographic') {
        if (updatedData.demographicDataAccess.includes(value)) {
          updatedData.demographicDataAccess = updatedData.demographicDataAccess.filter(item => item !== value)
        } else {
          updatedData.demographicDataAccess.push(value)
        }
      } else if (type === 'questionnaire') {
        if (updatedData.questionnaireAccess?.includes(value)) {
          updatedData.questionnaireAccess = updatedData.questionnaireAccess.filter(item => item !== value)
        } else {
          updatedData.questionnaireAccess?.push(value)
        }
      }

      return updatedData
    })
  }

  return (
    <Card>
      <CardHeader title='Study Application' subheader='Add you study here to apply for using our research data.' />
      <Form action=''></Form>
      <form onSubmit={e => e.preventDefault()}>
        <CardContent>
          <Grid container spacing={5}>
            <Grid size={{ xs: 12 }}>
              <Typography variant='body1' className='font-medium'>
                Study Information
              </Typography>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                label='Research Title'
                value={formData.researchTitle}
                onChange={e => setFormData({ ...formData, researchTitle: e.target.value })}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                label='Research Question'
                value={formData.researchQuestion}
                onChange={e => setFormData({ ...formData, researchQuestion: e.target.value })}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <FormControl fullWidth>
                <InputLabel>Institution</InputLabel>
                <Select
                  label='Country'
                  value={formData.instituion}
                  onChange={e => setFormData({ ...formData, instituion: e.target.value })}
                >
                  <MenuItem value='UCL'>University College London (UCL)</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <DateRangePicker
                label='Expected start date to end date'
                startDateRange={formData.expectedStartDate}
                setStartDateRange={start =>
                  setFormData(prev => ({
                    ...prev,
                    expectedStartDate: typeof start === 'function' ? start(prev.expectedStartDate) : start
                  }))
                }
                endDateRange={formData.expectedEndDate}
                setEndDateRange={end =>
                  setFormData(prev => ({
                    ...prev,
                    expectedEndDate: typeof end === 'function' ? end(prev.expectedEndDate) : end
                  }))
                }
              />
            </Grid>

            <Grid size={{ xs: 12 }}>
              <TextField
                rows={4}
                multiline
                fullWidth
                label='Summary'
                helperText='Includes aims, objectives and proposed methods.'
                value={formData.summary}
                onChange={e => setFormData({ ...formData, summary: e.target.value })}
              />
            </Grid>

            <Grid size={{ xs: 12 }}>
              <Divider sx={{ mt: 4, mb: 2 }} variant='fullWidth' />
            </Grid>

            <Grid size={{ xs: 12 }}>
              <Typography variant='body1' className='font-medium'>
                Upload supporting documents
              </Typography>
              <Typography variant='body2' className='font-small' sx={{ mt: 2 }}>
                Ethics approval and other supporting documents.
              </Typography>
            </Grid>
            <Grid size={{ xs: 12 }}>
              <FileUpload />
            </Grid>

            <Grid size={{ xs: 12 }}>
              <Divider variant='middle' sx={{ mt: 2, mb: 2 }} />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <Typography variant='body1' className='font-medium'>
                What data would you like access to?
              </Typography>
            </Grid>
            <Grid size={{ xs: 12 }}>
              <Typography variant='body2' className='font-small'>
                Demographic Data
              </Typography>
              {dataAccessAttributes['demographic'].map(label => (
                <LabeledCheckbox
                  key={label}
                  label={label}
                  checked={formData.demographicDataAccess.includes(label)}
                  onChange={() => handleCheckboxChange('demographic', label)}
                />
              ))}
            </Grid>
            <Grid size={{ xs: 12 }}>
              <Typography variant='body2' className='font-small'>
                Spider Questionnaire
              </Typography>
              {dataAccessAttributes['questionnaire'].map(label => (
                <LabeledCheckbox
                  key={label}
                  label={label}
                  checked={formData.questionnaireAccess.includes(label)}
                  onChange={() => handleCheckboxChange('questionnaire', label)}
                />
              ))}
            </Grid>
          </Grid>
        </CardContent>
        <CardActions>
          <Button type='submit' variant='contained' className='mie-2'>
            Submit
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
    </Card>
  )
}

export default ApplicationForm
