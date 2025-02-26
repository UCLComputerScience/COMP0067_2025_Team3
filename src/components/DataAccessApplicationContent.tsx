'use client'

// React Imports
import { Dispatch, SetStateAction } from 'react'

// MUI Imports
import Grid from '@mui/material/Grid2'
import Select from '@mui/material/Select'
import Divider from '@mui/material/Divider'
import MenuItem from '@mui/material/MenuItem'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'

// Styled Component Imports
import DateRangePicker from './DateRangePicker'
import LabeledCheckbox from './LabeledCheckbox'
import FileUpload from './FileUpload'

interface Props {
  formData: any
  setFormData: Dispatch<SetStateAction<any>>
  handleCheckboxChange: (type: 'demographic' | 'questionnaire', value: string) => void
  handleFilesChanges: (files: File[]) => void
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

const DataAccessApplicationContent = ({ formData, setFormData, handleCheckboxChange, handleFilesChanges }: Props) => {
  return (
    <>
      <CardHeader
        title='Data Access Application'
        subheader='Add you study here to apply for using our research data.'
      />

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
                setFormData((prev: { expectedStartDate: Date | null | undefined }) => ({
                  ...prev,
                  expectedStartDate: typeof start === 'function' ? start(prev.expectedStartDate) : start
                }))
              }
              endDateRange={formData.expectedEndDate}
              setEndDateRange={end =>
                setFormData((prev: { expectedEndDate: Date | null | undefined }) => ({
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
            <FileUpload files={formData.documents} onChange={handleFilesChanges} />
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
    </>
  )
}

export default DataAccessApplicationContent
