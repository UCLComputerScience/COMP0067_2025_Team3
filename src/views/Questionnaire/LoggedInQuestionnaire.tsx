'use client'

import { useState } from 'react'

import { Stepper, Step, StepLabel, Typography } from '@mui/material'

import PatientInfoForm from '@/components/Questionnaire-pages/PatientInfoForm/PatientInfoForm'
import StepperCustomDot from '@/components/stepper-dot'
import StepperWrapper from '@/@core/styles/stepper'
import QuestionPage from '@/components/Questionnaire-pages/QuestionnairePage'

const steps = [
  { title: 'Info' },
  { title: 'Pain' },
  { title: 'Fatigue and Sleep' },
  { title: 'NMSK' },
  { title: 'Gastrointestinal' },
  { title: 'Cardiac Dysautonomia' },
  { title: 'Urogenital' },
  { title: 'Anxiety' },
  { title: 'Depression' }
]

const stepperStyle = {
  backgroundColor: 'var(--mui-palette-customColors-bodyBg)',
  padding: 20
}

const getStepContent = (step: number, handleNext: () => void, handlePrev: () => void) => {
  switch (step) {
    case 0:
      return <PatientInfoForm handleNext={handleNext} />
    case 1:
      return <QuestionPage domain={'Pain'} handleNext={handleNext} handlePrev={handlePrev} />
    case 2:
      return <QuestionPage domain={'Fatigue'} handleNext={handleNext} handlePrev={handlePrev} />
    case 3:
      return <QuestionPage domain={'Neuromusculoskeletal'} handleNext={handleNext} handlePrev={handlePrev} />
    case 4:
      return <QuestionPage domain={'Gastrointestinal'} handleNext={handleNext} handlePrev={handlePrev} />
    case 5:
      return <QuestionPage domain={'Cardiac Dysautonomia'} handleNext={handleNext} handlePrev={handlePrev} />
    case 6:
      return <QuestionPage domain={'Urogenital'} handleNext={handleNext} handlePrev={handlePrev} />
    case 7:
      return <QuestionPage domain={'Anxiety'} handleNext={handleNext} handlePrev={handlePrev} />
    case 8:
      return <QuestionPage domain={'Depression'} handleNext={handleNext} handlePrev={handlePrev} />
    default:
      return null
  }
}

const Questionnaire = () => {
  // States
  const [activeStep, setActiveStep] = useState<number>(0)

  // Handle Stepper
  const handleNext = () => {
    setActiveStep(activeStep + 1)
  }

  const handlePrev = () => {
    if (activeStep !== 0) {
      setActiveStep(activeStep - 1)
    }
  }

  return (
    <StepperWrapper sx={{ width: '100%' }}>
      <Stepper activeStep={activeStep} sx={stepperStyle}>
        {steps.map((step, index) => {
          return (
            <Step key={index} onClick={() => setActiveStep(index)}>
              <StepLabel
                slots={{
                  stepIcon: StepperCustomDot
                }}
              >
                <div className='step-label cursor-pointer'>
                  <Typography className='step-title' color='text.primary'>
                    {step.title}
                  </Typography>
                </div>
              </StepLabel>
            </Step>
          )
        })}
      </Stepper>
      {getStepContent(activeStep, handleNext, handlePrev)}
    </StepperWrapper>
  )
}

export default Questionnaire
