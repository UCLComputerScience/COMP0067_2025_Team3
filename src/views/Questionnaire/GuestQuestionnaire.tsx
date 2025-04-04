'use client'

import { useState } from 'react'

import { useRouter } from 'next/navigation'

import { Stepper, Step, StepLabel, Typography, Box } from '@mui/material'

import PatientInfoForm from '@/components/Questionnaire-pages/PatientInfoForm/PatientInfoForm'
import StepperCustomDot from '@/components/stepper-dot'
import StepperWrapper from '@/@core/styles/stepper'
import QuestionPage from '@/components/Questionnaire-pages/QuestionnairePage'
import PerceivedSpidergram from '@/components/charts/PerceivedSpidergram'

const steps = [
  { title: 'Pain' },
  { title: 'Fatigue and Sleep' },
  { title: 'NMSK' },
  { title: 'Gastrointestinal' },
  { title: 'Cardiac Dysautonomia' },
  { title: 'Urogenital' },
  { title: 'Anxiety' },
  { title: 'Depression' },
  { title: 'Perceived Spidergram' }
]

const domainMap = [
  'Pain',
  'Fatigue',
  'Neuromusculoskeletal',
  'Gastrointestinal',
  'Cardiac Dysautonomia',
  'Urogenital',
  'Anxiety',
  'Depression',
  'Spidergram'
]

const stepperStyle = {
  backgroundColor: 'var(--mui-palette-customColors-bodyBg)',
  padding: 20
}

const Questionnaire = () => {
  const router = useRouter()
  const [activeStep, setActiveStep] = useState<number>(0)
  const [answers, setAnswers] = useState<Record<string, Record<number | string, any>>>({})

  const currentDomain = domainMap[activeStep]

  const handleUpdate = (domain: string, updated: Record<number | string, any>) => {
    setAnswers(prev => ({
      ...prev,
      [domain]: updated
    }))
  }

  const handleNext = () => setActiveStep(prev => prev + 1)
  const handlePrev = () => setActiveStep(prev => (prev > 0 ? prev - 1 : 0))

  const HandleSubmit = () => {
    console.log('Answers', answers)
    router.push(`/result?data=${encodeURIComponent(JSON.stringify(answers))}`)
  }

  const getStepContent = () => {
    if (currentDomain === 'Info') {
      return <PatientInfoForm handleNext={handleNext} />
    }

    if (currentDomain === 'Spidergram') {
      return (
        <PerceivedSpidergram
          values={answers['Spidergram'] || {}}
          onUpdate={updated => handleUpdate('Spidergram', updated)}
          onBack={handlePrev}
          onSubmit={HandleSubmit}
        />
      )
    }

    return (
      <QuestionPage
        domain={currentDomain}
        answers={answers[currentDomain] || {}}
        onUpdate={updated => handleUpdate(currentDomain, updated)}
        handleNext={handleNext}
        handlePrev={handlePrev}
      />
    )
  }

  return (
    <StepperWrapper sx={{ width: '100%' }}>
      <Stepper activeStep={activeStep} sx={stepperStyle}>
        {steps.map((step, index) => (
          <Step key={index} onClick={() => setActiveStep(index)}>
            <StepLabel slots={{ stepIcon: StepperCustomDot }}>
              <div className='step-label cursor-pointer'>
                <Typography className='step-title' color='text.primary'>
                  {step.title}
                </Typography>
              </div>
            </StepLabel>
          </Step>
        ))}
      </Stepper>

      <Box mt={4}>{getStepContent()}</Box>
    </StepperWrapper>
  )
}

export default Questionnaire
