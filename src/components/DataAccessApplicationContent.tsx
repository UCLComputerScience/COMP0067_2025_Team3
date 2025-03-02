// 'use client'

// React Imports
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
import { Control, Controller, FieldErrors } from 'react-hook-form'
import { FormValues } from './DataAccessApplicationForm'
import FormHelperText from '@mui/material/FormHelperText'

interface Props {
  control: Control<FormValues, any>
  errors: FieldErrors<FormValues>
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

const DataAccessApplicationContent = ({ control, errors }: Props) => {
  return (
    <>
      <CardHeader
        title='Data Access Application'
        subheader='Add your study here to apply for using our research data.'
      />

      <CardContent>
        <Grid container spacing={5}>
          <Grid size={12}>
            <Typography variant='body1' className='font-medium'>
              Study Information
            </Typography>
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <Controller
              name='researchTitle'
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  label='Research Title'
                  name='researchTitle'
                  {...(errors.researchTitle && { error: true, helperText: errors.researchTitle.message })}
                />
              )}
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <Controller
              name='researchQuestion'
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  label='Research Question'
                  name='researchQuestion'
                  {...(errors.researchQuestion && { error: true, helperText: errors.researchQuestion.message })}
                />
              )}
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <FormControl fullWidth error={Boolean(errors.institution)}>
              <InputLabel>Institution</InputLabel>
              <Controller
                name='institution'
                control={control}
                rules={{ required: true }}
                render={({ field }) => (
                  <Select {...field} label='Institution' defaultValue=''>
                    <MenuItem value='University College London (UCL)'>University College London (UCL)</MenuItem>
                  </Select>
                )}
              />
              {errors.institution && <FormHelperText>{errors.institution.message}</FormHelperText>}
            </FormControl>
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <FormControl
              fullWidth
              error={Boolean(errors.dateRange?.expectedStartDate || errors.dateRange?.expectedEndDate)}
            >
              <Controller
                name='dateRange'
                control={control}
                rules={{ required: true }}
                render={({ field }) => (
                  <DateRangePicker
                    value={{
                      expectedStartDate: field.value?.expectedStartDate,
                      expectedEndDate: field.value?.expectedEndDate
                    }}
                    onChange={dates => {
                      field.onChange({
                        expectedStartDate: dates.expectedStartDate,
                        expectedEndDate: dates.expectedEndDate
                      })
                    }}
                    label='Expected start date to end date'
                    error={Boolean(errors.dateRange?.expectedStartDate || errors.dateRange?.expectedEndDate)}
                  />
                )}
              />
              {(errors.dateRange?.expectedStartDate || errors.dateRange?.expectedEndDate) && (
                <FormHelperText>
                  {errors.dateRange?.expectedStartDate?.message || errors.dateRange?.expectedEndDate?.message}
                </FormHelperText>
              )}
            </FormControl>
          </Grid>

          <Grid size={{ xs: 12 }}>
            <Controller
              name='summary'
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <TextField
                  {...field}
                  rows={4}
                  multiline
                  fullWidth
                  label='Summary'
                  name='summary'
                  helperText='Includes aims, objectives, and proposed methods.'
                  {...(errors.summary && { error: true, helperText: errors.summary.message })}
                />
              )}
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
            <FormControl fullWidth error={Boolean(errors.documents)}>
              <Controller
                name='documents'
                control={control}
                render={({ field }) => <FileUpload files={field.value} onChange={field.onChange} />}
              />
              {errors.documents && <FormHelperText sx={{ mt: 2 }}>{errors.documents.message}</FormHelperText>}
            </FormControl>
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
              <Controller
                key={label}
                name='demographicDataAccess'
                control={control}
                render={({ field }) => (
                  <LabeledCheckbox
                    {...field}
                    label={label}
                    value={label}
                    checked={field.value?.includes(label) as boolean}
                    onChange={e => {
                      const newValue = e.target.checked
                        ? [...(field.value || []), label]
                        : (field.value || []).filter(item => item !== label)
                      field.onChange(newValue)
                    }}
                  />
                )}
              />
            ))}
          </Grid>

          <Grid size={{ xs: 12 }}>
            <Typography variant='body2' className='font-small'>
              Spider Questionnaire
            </Typography>
            {dataAccessAttributes['questionnaire'].map(label => (
              <Controller
                key={label}
                name='questionnaireAccess'
                control={control}
                render={({ field }) => (
                  <LabeledCheckbox
                    {...field}
                    label={label}
                    value={label}
                    checked={field.value?.includes(label) as boolean}
                    onChange={e => {
                      const newValue = e.target.checked
                        ? [...(field.value || []), label]
                        : (field.value || []).filter(item => item !== label)
                      field.onChange(newValue)
                    }}
                  />
                )}
              />
            ))}
          </Grid>
        </Grid>
      </CardContent>
    </>
  )
}

export default DataAccessApplicationContent
