'use client'

// react
import { useState, useEffect, useMemo } from 'react'

// MUI
import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  FormControl,
  FormControlLabel,
  FormHelperText,
  IconButton,
  Radio,
  RadioGroup,
  Tooltip,
  Typography,
  Alert
} from '@mui/material'
import Grid from '@mui/material/Grid2'

// Form validation
import { useForm, Controller } from 'react-hook-form'
import { object, string, array, date } from 'valibot'
import type { InferInput } from 'valibot'
import { valibotResolver } from '@hookform/resolvers/valibot'

// component
import { toast } from 'react-toastify'

import { useSession } from 'next-auth/react'

import DateRangePicker from './DateRangePicker'
import LabeledCheckbox from './LabeledCheckbox'

// utils
import { DATA_ACCESS_ATTRIBUTES } from '@/constants'
import { reverseMapDataAccessFields, mapDataAccessFields } from '@/libs/mappers'
import {
  generatePatientDemographicDataExport,
  generateQuestionnaireResponseExport
} from '@/actions/researcher/downloadActions'
import { downloadFile } from '@/utils/downloadUtils'
import Link from './Link'
import { getApplicationBasicInfoByResearcherId } from '@/actions/researcher/applicationAction'

interface Props {
  dataAccess: {
    createdAt: Date
    updatedAt: Date
    dataFields: string[]
    hasAccess: boolean
    expiresAt: Date
    startFrom: Date
  } | null
  defaultFormValues: DownloadFormValues
}

// Tooltips for questionnaire types
const questionnaireTooltips = {
  'Single episode questionnaire': 'Provides the most recent questionnaire response from each patient.',
  'Longitudinal data (multiple questionnaires over time)':
    'Includes all questionnaire responses across multiple time points.'
}

// Define the validation schema
const downloadFormSchema = object({
  demographicDataAccess: array(string()),
  questionnaireType: string(),
  dateRange: object({
    expectedStartDate: date('Start date is required'),
    expectedEndDate: date('End date is required')
  }),
  exportFormat: string()
})

export type DownloadFormValues = InferInput<typeof downloadFormSchema>

const DownloadCard = ({ dataAccess, defaultFormValues }: Props) => {
  const { data: session } = useSession()
  const [loading, setLoading] = useState(false)
  const [studyBasicInfo, setStudyBasicInfo] = useState<any>(null)

  useEffect(() => {
    if (!session || !session.user) {
      return
    }

    const getStudyBasicInfo = async () => {
      const basicInfo = await getApplicationBasicInfoByResearcherId(session.user.id!)

      console.log(basicInfo)
      setStudyBasicInfo(basicInfo)
    }

    getStudyBasicInfo()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const hasValidAccess = useMemo(() => {
    if (!dataAccess || !dataAccess.hasAccess) return false

    const now = new Date()
    const expiryDate = new Date(dataAccess.expiresAt)

    return now < expiryDate
  }, [dataAccess])

  const accessibleFields = useMemo(() => {
    if (!dataAccess || !dataAccess.dataFields) return { demographic: [], questionnaire: [] }

    return {
      demographic: reverseMapDataAccessFields(dataAccess.dataFields, 'demographic'),
      questionnaire: reverseMapDataAccessFields(dataAccess.dataFields, 'questionnaire')
    }
  }, [dataAccess])

  const {
    control,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isDirty, isValid }
  } = useForm<DownloadFormValues>({
    resolver: valibotResolver(downloadFormSchema),
    defaultValues: defaultFormValues,
    mode: 'onChange'
  })

  useEffect(() => {
    if (hasValidAccess && accessibleFields.questionnaire.length > 0) {
      reset({
        ...defaultFormValues,
        questionnaireType: accessibleFields.questionnaire[0]
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasValidAccess, accessibleFields, reset])

  const isFieldDisabled = (fieldName: string, fieldType: 'demographic' | 'questionnaire') => {
    if (!hasValidAccess) return true

    const accessibleFieldsList = accessibleFields[fieldType]

    return !accessibleFieldsList.includes(fieldName)
  }

  const onSubmit = async (data: DownloadFormValues) => {
    setLoading(true)

    try {
      const demographicFields = mapDataAccessFields(data.demographicDataAccess, 'demographic')
      const questionnaireFields = mapDataAccessFields([data.questionnaireType], 'questionnaire')

      const requestData = {
        demographicFields,
        questionnaireFields,
        startDate: data.dateRange.expectedStartDate,
        endDate: data.dateRange.expectedEndDate,
        format: data.exportFormat
      }

      console.log('request data:', requestData)

      if (!studyBasicInfo || !studyBasicInfo.id) {
        return
      }

      const questionnaireResult = await generateQuestionnaireResponseExport(requestData, studyBasicInfo.id)

      if (questionnaireResult.message) {
        toast.warn(questionnaireResult.message)
      } else {
        await downloadFile(
          questionnaireResult,
          `questionnaire_data_${new Date().toISOString().split('T')[0]}_${requestData.questionnaireFields[0].toLowerCase()}.${questionnaireResult.fileExtension}`
        )
      }

      if (data.demographicDataAccess.length > 0) {
        if (!studyBasicInfo || !studyBasicInfo.id) {
          return
        }

        const demographicResult = await generatePatientDemographicDataExport(requestData, studyBasicInfo.id)

        if (demographicResult.message) {
          toast.warn(demographicResult.message)
        } else {
          await downloadFile(
            demographicResult,
            `demographic_data_${new Date().toISOString().split('T')[0]}.${demographicResult.fileExtension}`
          )
          toast.success('Data export completed successfully!')
        }
      }
    } catch (error) {
      console.error('Error exporting data:', error)
      toast.error('An error occurred while exporting data')
    } finally {
      setLoading(false)
    }
  }

  const currentQuestionnaireType = watch('questionnaireType')
  const selectedDemographicFields = watch('demographicDataAccess')

  return (
    <Card className='w-full'>
      <CardHeader
        title='Download Data'
        subheader={
          studyBasicInfo
            ? studyBasicInfo.title && studyBasicInfo.numPatientConsent >= 0
              ? `Download the Spider Questionnaire data for your research project, "${studyBasicInfo.title}". Currently, ${studyBasicInfo.numPatientConsent} participants have agreed to share their data for your research.`
              : 'Download the Spider Questionnaire data for your research project.'
            : 'Loading data...'
        }
        className='pb-4'
      />
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent>
          {!hasValidAccess && (
            <Alert severity='warning' sx={{ mb: 6 }}>
              {!dataAccess?.hasAccess ? (
                <>
                  You do not have access to download data.{' '}
                  <Link href='/my-profile/new-study-application' style={{ textDecoration: 'underline' }}>
                    Request access here
                  </Link>
                  .
                </>
              ) : (
                'Your data access has expired.'
              )}
            </Alert>
          )}

          <Grid container spacing={4}>
            {/* Demographic Data Section */}
            <Grid size={12}>
              <Typography variant='h6' sx={{ mb: 2, fontWeight: 600 }}>
                Demographic Data
              </Typography>
              <FormControl error={!!errors.demographicDataAccess}>
                <div>
                  {DATA_ACCESS_ATTRIBUTES.demographic.map(label => (
                    <Controller
                      key={label}
                      name='demographicDataAccess'
                      control={control}
                      render={({ field }) => (
                        <LabeledCheckbox
                          label={label}
                          value={label}
                          name={label}
                          disable={isFieldDisabled(label, 'demographic')}
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
                </div>
                {errors.demographicDataAccess && (
                  <FormHelperText error>{errors.demographicDataAccess.message}</FormHelperText>
                )}
              </FormControl>
            </Grid>

            {/* Spider Questionnaire Section */}
            <Grid size={12}>
              <Typography variant='h6' sx={{ mb: 2, fontWeight: 600 }}>
                Spider Questionnaire
              </Typography>
              <FormControl error={!!errors.questionnaireType} fullWidth>
                <Controller
                  name='questionnaireType'
                  control={control}
                  render={({ field }) => (
                    <RadioGroup {...field} aria-label='questionnaire-type' className='flex flex-col'>
                      {DATA_ACCESS_ATTRIBUTES.questionnaire.map(label => (
                        <div key={label} className='flex items-center'>
                          <FormControlLabel
                            value={label}
                            control={<Radio />}
                            label={label}
                            disabled={isFieldDisabled(label, 'questionnaire')}
                          />
                          <Tooltip title={questionnaireTooltips[label]} arrow placement='right'>
                            <IconButton aria-label='information' size='small' sx={{ mr: 1 }}>
                              <i className='ri-information-line' />
                            </IconButton>
                          </Tooltip>
                        </div>
                      ))}
                    </RadioGroup>
                  )}
                />
                {errors.questionnaireType && <FormHelperText error>{errors.questionnaireType.message}</FormHelperText>}
              </FormControl>
            </Grid>

            {/* Date Range Section */}
            <Grid size={{ xs: 12, sm: 6 }}>
              <Typography variant='h6' sx={{ mb: 2, fontWeight: 600 }}>
                Data Range
              </Typography>
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
                      label='Select data date range'
                      disabled={!hasValidAccess}
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

            {/* Export Format Section */}
            <Grid size={12}>
              <Typography variant='h6' sx={{ mb: 2, fontWeight: 600 }}>
                Export Format
              </Typography>
              <FormControl error={!!errors.exportFormat} fullWidth>
                <Controller
                  name='exportFormat'
                  control={control}
                  render={({ field }) => (
                    <RadioGroup {...field} row aria-label='export-format'>
                      <FormControlLabel value='JSON' control={<Radio disabled={!hasValidAccess} />} label='JSON' />
                      <FormControlLabel
                        value='XLSX'
                        control={<Radio disabled={!hasValidAccess} />}
                        label='Excel (XLSX)'
                      />
                      <FormControlLabel value='CSV' control={<Radio disabled={!hasValidAccess} />} label='CSV' />
                    </RadioGroup>
                  )}
                />
                {errors.exportFormat && <FormHelperText error>{errors.exportFormat.message}</FormHelperText>}
              </FormControl>
            </Grid>
          </Grid>
        </CardContent>
        <CardActions>
          <Button
            type='submit'
            variant='contained'
            color='primary'
            size='large'
            disabled={
              !hasValidAccess ||
              loading ||
              !isDirty ||
              !isValid ||
              selectedDemographicFields.length === 0 ||
              !currentQuestionnaireType
            }
          >
            {loading ? (
              'Exporting...'
            ) : (
              <>
                <i className='ri-download-2-line mr-4' />
                Export
              </>
            )}
          </Button>
        </CardActions>
      </form>
    </Card>
  )
}

export default DownloadCard
