'use client'

import Card from '@mui/material/Card'
import Button from '@mui/material/Button'
import CardActions from '@mui/material/CardActions'
import DataAccessApplicationContent from './DataAccessApplicationContent'
import DialogsAlert from './DialogsAlert'
import { object, minLength, string, pipe, nonEmpty, array, file, InferInput, date } from 'valibot'

import { useForm } from 'react-hook-form'
import { valibotResolver } from '@hookform/resolvers/valibot'

import { createApplication } from '@/actions/researcher/applicationAction'

export type FormValues = InferInput<typeof schema>

const schema = object({
  researchTitle: pipe(
    string(),
    nonEmpty('This field is required'),
    minLength(3, 'Research Title must be at least 3 characters long')
  ),
  researchQuestion: pipe(
    string(),
    nonEmpty('This field is required'),
    minLength(3, 'Research Question must be at least 3 characters long')
  ),
  institution: pipe(string(), nonEmpty('This field is required')),
  summary: pipe(
    string(),
    nonEmpty('This field is required'),
    minLength(8, 'Summary must be at least 8 characters long')
  ),
  documents: pipe(array(file()), nonEmpty('This field is required')),
  demographicDataAccess: pipe(array(string())),
  questionnaireAccess: pipe(array(string())),
  dateRange: object({
    expectedStartDate: pipe(date()),
    expectedEndDate: pipe(date())
  })
})

const DataAccessApplicationForm = () => {
  const {
    control,
    reset,
    handleSubmit,
    formState: { errors }
  } = useForm<FormValues>({
    resolver: valibotResolver(schema),
    defaultValues: {
      researchTitle: '',
      researchQuestion: '',
      institution: '',
      summary: '',
      documents: [],
      demographicDataAccess: [],
      questionnaireAccess: [],
      dateRange: { expectedStartDate: undefined, expectedEndDate: undefined }
    }
  })

  const onSubmit = async (data: FormValues) => {
    console.log('submitting?')
    const formData = new FormData()

    const { dateRange, ...rest } = data
    if (dateRange.expectedStartDate) {
      formData.append('expectedStartDate', dateRange.expectedStartDate.toISOString())
    }
    if (dateRange.expectedEndDate) {
      formData.append('expectedEndDate', dateRange.expectedEndDate.toISOString())
    }

    Object.entries(rest).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        value.forEach(item => formData.append(key, item))
      } else if (value && typeof value === 'object') {
        Object.entries(value).forEach(([subKey, subValue]) => {
          formData.append(`${key}[${subKey}]`, subValue as string | Blob)
        })
      } else {
        formData.append(key, value as string | Blob)
      }
    })

    await createApplication(formData)
  }

  return (
    <Card>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DataAccessApplicationContent control={control} errors={errors} />
        <CardActions>
          <Button type='submit' variant='contained' className='mie-2'>
            Submit
          </Button>
          <DialogsAlert
            triggerButtonLabel='Reset'
            dialogTitle='Confirm Form Reset'
            dialogText='Please note that resetting the form will erase all entered data and cannot be undone.'
            confirmButtonLabel='Yes, Reset'
            cancelButtonLabel='Cancel'
            onConfirm={() => reset()}
          />
        </CardActions>
      </form>
    </Card>
  )
}

export default DataAccessApplicationForm
