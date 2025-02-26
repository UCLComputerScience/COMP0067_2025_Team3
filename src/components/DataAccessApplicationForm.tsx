'use client'

// React Imports
import { useEffect, useState } from 'react'

// MUI Imports
import Card from '@mui/material/Card'
import Button from '@mui/material/Button'

import CardActions from '@mui/material/CardActions'

// Styled Component Imports
import DataAccessApplicationContent from './DataAccessApplicationContent'
import DialogsAlert from './DialogsAlert'

type FormDataType = {
  researchTitle: string
  researchQuestion: string
  instituion: string
  expectedStartDate: Date | null | undefined
  expectedEndDate: Date | null | undefined
  summary: string
  documents?: File[]
  demographicDataAccess: string[]
  questionnaireAccess: string[]
}

const DataAccessApplicationForm = () => {
  // States
  const [formData, setFormData] = useState<FormDataType>({
    researchTitle: '',
    researchQuestion: '',
    instituion: '',
    expectedStartDate: null,
    expectedEndDate: null,
    summary: '',
    documents: [],
    demographicDataAccess: [],
    questionnaireAccess: []
  })

  useEffect(() => {
    console.log(formData)
  }, [formData])

  const handleReset = () => {
    setFormData({
      researchTitle: '',
      researchQuestion: '',
      instituion: '',
      expectedStartDate: null,
      expectedEndDate: null,
      summary: '',
      documents: [],
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

  const handleFilesChanges = (files: File[]) => {
    setFormData(prev => {
      const updatedData = { ...prev }
      updatedData.documents = files

      return updatedData
    })
  }

  return (
    <Card>
      <form onSubmit={e => e.preventDefault()}>
        <DataAccessApplicationContent
          formData={formData}
          setFormData={setFormData}
          handleCheckboxChange={handleCheckboxChange}
          handleFilesChanges={handleFilesChanges}
        />
        <CardActions>
          <Button type='submit' variant='contained' className='mie-2'>
            Submit
          </Button>
          <DialogsAlert
            triggerButtonLabel={'Reset'}
            dialogTitle={'Confirm Form Reset'}
            dialogText={'Please note that resetting the form will erase all entered data and cannot be undone.'}
            confirmButtonLabel={'Yes, Reset'}
            cancelButtonLabel={'Cancel'}
            onConfirm={() => handleReset()}
          />
        </CardActions>
      </form>
    </Card>
  )
}

export default DataAccessApplicationForm
