'use client'

import { useState } from 'react'

import { Stepper, Step, StepLabel, Typography, Box } from '@mui/material'
import { v4 as uuidv4 } from 'uuid'

import { useSession } from 'next-auth/react'

import PatientInfoForm from '@/components/Questionnaire-pages/PatientInfoForm/PatientInfoForm'
import StepperCustomDot from '@/components/stepper-dot'
import StepperWrapper from '@/@core/styles/stepper'
import QuestionPage from '@/components/Questionnaire-pages/QuestionnairePage'
import PerceivedSpidergram from '@/components/charts/PerceivedSpidergram'
import { submitResponses } from '@/actions/submit-response/submission-action'

const steps = [
  { title: 'Info' },
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
  'Info',
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
  const { data: session } = useSession()
  const userId = session?.user?.id || ''
  const [activeStep, setActiveStep] = useState<number>(0)
  const [answers, setAnswers] = useState<Record<string, Record<number | string, any>>>({})
  const [submissionId] = useState(uuidv4())

  const currentDomain = domainMap[activeStep]

  const handleUpdate = (domain: string, updated: Record<number | string, any>) => {
    setAnswers(prev => ({
      ...prev,
      [domain]: updated
    }))
  }

  const handleNext = () => setActiveStep(prev => prev + 1)
  const handlePrev = () => setActiveStep(prev => (prev > 0 ? prev - 1 : 0))

  const handleSubmit = async () => {
    const allFormattedAnswers = Object.entries(answers).flatMap(([domain, questionSet]) => {
      if (domain === 'Spidergram') {
        return Object.entries(questionSet).map(([label, entry]: [string, any]) => ({
          userId,
          questionId: 32,
          score: entry.score,
          label,
          domain: 'Perceived Spidergram',
          submissionId
        }))
      } else {
        return Object.entries(questionSet).map(([questionId, value]) => {
          const score = Array.isArray(value) ? value.length * 20 : isNaN(Number(value)) ? 0 : Number(value)

          return {
            userId,
            questionId: Number(questionId),
            score,
            label: String(score),
            domain,
            submissionId
          }
        })
      }
    })

    console.log('Formatted Answers:', allFormattedAnswers)

    const result = await submitResponses(allFormattedAnswers)
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
          onSubmit={handleSubmit}
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
