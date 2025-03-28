'use client'

// React imports
import { useState, useEffect } from 'react'

import { useRouter } from 'next/navigation'

import { useSession } from 'next-auth/react'

// MUI imports
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import CardActions from '@mui/material/CardActions'
import CardContent from '@mui/material/CardContent'
import CardHeader from '@mui/material/CardHeader'
import FormControl from '@mui/material/FormControl'
import FormHelperText from '@mui/material/FormHelperText'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import Select from '@mui/material/Select'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import Grid from '@mui/material/Grid2'
import { capitalize, Chip } from '@mui/material'

// Form validation
import { useForm, Controller } from 'react-hook-form'
import { object, string, array, date, optional } from 'valibot'
import type { InferInput } from 'valibot'
import { valibotResolver } from '@hookform/resolvers/valibot'

// Components
import { toast } from 'react-toastify'

import { ApplicationStatus } from '@prisma/client'

import LabeledCheckbox from '../LabeledCheckbox'
import DialogsAlert from '../DialogsAlert'
import DateRangePicker from '../DateRangePicker'

// Constants and types
import { DATA_ACCESS_ATTRIBUTES } from '@/constants'
import { getChipColor } from '../study-list'

import { processStudyForm } from '@/actions/admin/applicationActions'

interface Props {
  formValues?: AdminStudyFormValues
  applicationId: number
  researcherId: string
}

const adminStudySchema = object({
  message: optional(string()),
  status: string(),
  demographicDataAccess: array(string()),
  questionnaireAccess: array(string()),
  dateRange: object({
    expectedStartDate: optional(date('Start date is required')),
    expectedEndDate: optional(date('End date is required'))
  })
})

export type AdminStudyFormValues = InferInput<typeof adminStudySchema>

const defaultFormValues = {
  message: '',
  status: ApplicationStatus.PENDING,
  demographicDataAccess: [] as string[],
  questionnaireAccess: [] as string[],
  dateRange: {
    expectedStartDate: undefined,
    expectedEndDate: undefined
  }
}

const AdminStudyProcessForm = ({ formValues = defaultFormValues, researcherId, applicationId }: Props) => {
  const { data: session } = useSession()
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const {
    control,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isDirty }
  } = useForm<AdminStudyFormValues>({
    resolver: valibotResolver(adminStudySchema),
    defaultValues: formValues
  })

  const currentStatus = watch('status')
  const showDataAccessSections = currentStatus === ApplicationStatus.APPROVED
  const showAdminMessage = currentStatus === ApplicationStatus.REJECTED

  useEffect(() => {
    reset(formValues)
  }, [formValues, reset])

  const onSubmit = async (data: AdminStudyFormValues) => {
    if (!session?.user?.id) {
      toast.error('You must be logged in to update study data')

      return
    }

    setLoading(true)

    try {
      console.log(data)
      await processStudyForm(researcherId, applicationId, data)
      toast.success('Admin decision saved successfully!')

      // Reset form state
      reset(data, { keepDirty: false })
      router.push(`/all-users/${researcherId}`)
    } catch (error) {
      console.error('Error updating study data:', error)
      toast.error('An error occurred while updating data access application...')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className='w-full'>
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardHeader title='Admin Decision' />
        <CardContent>
          <Grid container spacing={5}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <FormControl fullWidth error={!!errors.status}>
                <InputLabel id='status-select-label'>Decision</InputLabel>
                <Controller
                  name='status'
                  control={control}
                  render={({ field }) => (
                    <Select
                      {...field}
                      label='Decision'
                      labelId='status-select-label'
                      disabled={loading}
                      error={!!errors.status}
                    >
                      {Object.values(ApplicationStatus) // set default to PENDING...
                        .filter(status => status !== ApplicationStatus.PENDING)
                        .map(status => (
                          <MenuItem key={status} value={status}>
                            <Chip
                              label={capitalize(status.toLowerCase())}
                              variant='tonal'
                              color={getChipColor(status)}
                              size='small'
                            />
                          </MenuItem>
                        ))}
                    </Select>
                  )}
                />
                {errors.status && <FormHelperText>{errors.status.message}</FormHelperText>}
              </FormControl>
            </Grid>
            {/* Only show message sections if status is REJECT */}
            {showAdminMessage && (
              <Grid size={12}>
                <Controller
                  name='message'
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      rows={4}
                      multiline
                      label='Message'
                      disabled={loading}
                      error={!!errors.message}
                      helperText={errors.message?.message}
                    />
                  )}
                />
              </Grid>
            )}

            {/* Only show data access sections if status is APPROVED */}
            {showDataAccessSections && (
              <>
                <Grid size={12}>
                  <Typography variant='body2' className='font-small mt-4'>
                    Demographic Data
                  </Typography>
                  {DATA_ACCESS_ATTRIBUTES['demographic'].map(label => (
                    <Controller
                      key={label}
                      name='demographicDataAccess'
                      control={control}
                      render={({ field }) => (
                        <LabeledCheckbox
                          {...field}
                          label={label}
                          value={label}
                          checked={Array.isArray(field.value) && field.value.includes(label)}
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
                <Grid size={12}>
                  <Typography variant='body2' className='font-small mt-4'>
                    Spider Questionnaire
                  </Typography>
                  {DATA_ACCESS_ATTRIBUTES['questionnaire'].map(label => (
                    <Controller
                      key={label}
                      name='questionnaireAccess'
                      control={control}
                      render={({ field }) => (
                        <LabeledCheckbox
                          {...field}
                          label={label}
                          value={label}
                          checked={Array.isArray(field.value) && field.value.includes(label)}
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
                <Grid size={{ xs: 12, sm: 6 }}>
                  <FormControl
                    fullWidth
                    error={Boolean(errors.dateRange?.expectedStartDate || errors.dateRange?.expectedEndDate)}
                  >
                    <Controller
                      name='dateRange'
                      control={control}
                      render={({ field }) => (
                        <DateRangePicker
                          value={{
                            expectedStartDate: field.value?.expectedStartDate as Date | null,
                            expectedEndDate: field.value?.expectedEndDate as Date | null
                          }}
                          onChange={dates => {
                            field.onChange({
                              expectedStartDate: dates.expectedStartDate,
                              expectedEndDate: dates.expectedEndDate
                            })
                          }}
                          label='Data access valid duration'
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
              </>
            )}
          </Grid>
        </CardContent>
        <CardActions>
          <Button type='submit' variant='contained' className='mie-2' disabled={!isDirty || loading}>
            Submit
          </Button>
          <DialogsAlert
            triggerButtonLabel='Reset'
            dialogTitle='Confirm Form Reset'
            dialogText='Resetting the form will erase all entered data and cannot be undone.'
            confirmButtonLabel='Yes, Reset'
            cancelButtonLabel='Cancel'
            onConfirm={() => reset()}
          />
        </CardActions>
      </form>
    </Card>
  )
}

export default AdminStudyProcessForm
