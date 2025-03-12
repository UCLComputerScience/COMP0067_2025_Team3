'use client'

// MUI
import Card from '@mui/material/Card'
import Button from '@mui/material/Button'
import CardActions from '@mui/material/CardActions'
import { CardHeader } from '@mui/material'
import DataAccessApplicationContent from './DataAccessApplicationContent'
import DialogsAlert from './DialogsAlert'
import { useRouter } from 'next/navigation'

// Components
import { createApplication, updateApplication } from '@/actions/researcher/applicationAction'
import { toast } from 'react-toastify'

// Form validation
import { useForm } from 'react-hook-form'
import { object, minLength, string, pipe, nonEmpty, array, file, InferInput, date, custom } from 'valibot'
import { valibotResolver } from '@hookform/resolvers/valibot'
import { useSession } from 'next-auth/react'
import { useEffect } from 'react'

export type FormValues = InferInput<typeof schema> & { applicationId?: number }

interface Props {
  formValues?: any
  title?: string
  subheader?: string
  onCancel?: () => void
  submitTypes?: 'create' | 'update'
}

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
    expectedStartDate: pipe(date('This field is required')),
    expectedEndDate: pipe(date('This field is required'))
  })
})

const emptyFormDefaultValue = {
  researchTitle: '',
  researchQuestion: '',
  institution: '',
  summary: '',
  documents: [],
  demographicDataAccess: [],
  questionnaireAccess: [],
  dateRange: { expectedStartDate: null, expectedEndDate: null }
}

const DataAccessApplicationForm = ({
  formValues = emptyFormDefaultValue,
  title = 'Data Access Application',
  subheader = 'Add your study here to apply for using our research data.',
  onCancel,
  submitTypes = 'create'
}: Props) => {
  const { data: session } = useSession()
  const router = useRouter()

  const {
    control,
    reset,
    handleSubmit,
    formState: { errors, isValid }
  } = useForm<FormValues>({
    resolver: valibotResolver(schema),
    defaultValues: formValues
  })

  useEffect(() => {
    console.log(formValues)
    reset(formValues)
  }, [formValues, reset])

  const onSubmit = async (data: FormValues) => {
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

    try {
      if (submitTypes === 'create') {
        const success = await createApplication(formData, session?.user?.id as string)
        if (success) {
          toast.success('🎉 Your data application was created successfully!')
          router.push('/my-profile')
        } else {
          toast.error('Application creation failed')
        }
      } else if (submitTypes === 'update') {
        const success = await updateApplication(formData, session?.user?.id as string, formValues.applicationId)
        if (success) {
          toast.success('🎉 Your data application was updated successfully!')
          router.push(`/my-profile`)
        } else {
          toast.error('Application update failed')
        }
      }
    } catch (error) {
      console.error('Error submitting the form:', error)
      toast.error('An error occurred while submitting your application. Please try again later.')
    }
  }

  return (
    <Card>
      <form
        onSubmit={e => {
          e.preventDefault()
          if (!isValid) {
            toast.error('Oops! Some fields need attention. Please check your input and try again.')
          }
          handleSubmit(onSubmit)()
        }}
      >
        <CardHeader title={title} subheader={subheader} />
        <DataAccessApplicationContent control={control} errors={errors} />
        <CardActions>
          <Button type='submit' variant='contained' className='mie-2'>
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
          {onCancel && (
            <DialogsAlert
              triggerButtonLabel='Cancel and Return to View'
              dialogTitle='Confirm Cancellation of Edits'
              dialogText='Any unsaved changes will be lost if you return to the view without saving your edits.'
              confirmButtonLabel='Yes, Cancel'
              cancelButtonLabel='Keep Editing'
              onConfirm={() => onCancel()}
            />
          )}
        </CardActions>
      </form>
    </Card>
  )
}

export default DataAccessApplicationForm
