'use client'

import { useState } from 'react'

import { useRouter } from 'next/navigation'

import { Stepper, Step, StepLabel, Typography, Box } from '@mui/material'

import { safeParse } from 'valibot'

import { toast } from 'react-toastify'

import PatientInfoForm from '@/components/Questionnaire-pages/PatientInfoForm/PatientInfoForm'
import StepperCustomDot from '@/components/stepper-dot'
import StepperWrapper from '@/@core/styles/stepper'
import QuestionPage from '@/components/Questionnaire-pages/QuestionnairePage'
import PerceivedSpidergram from '@/components/charts/PerceivedSpidergram'
import { QuestionnaireSchema } from '@/actions/formValidation'

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
    // Validate answers using questionnaire schema
    const submitAnswers = safeParse(QuestionnaireSchema, answers)

    if (submitAnswers.success) {
      // Calculate the average score for each domain
      const allFormattedAnswers = Object.entries(answers).map(([domain, questionSet]) => {
        // Calculate the average score for other domains
        const scores = Object.values(questionSet).map(value =>
          Array.isArray(value) ? value.length * 20 : isNaN(Number(value)) ? 0 : Number(value)
        )

        const totalScore = scores.reduce((sum, score) => sum + score, 0)
        const averageScore = scores.length > 0 ? totalScore / scores.length : 0

        return {
          domain,
          averageScore: Math.round(averageScore) // Round to nearest integer if needed
        }
      })

      // Flatten the array (Spidergram returns an array, others return objects)
      const formattedAnswers = allFormattedAnswers.flat()

      console.log('Formatted Answers:', formattedAnswers)

      // Send the formatted answers to the result page
      router.push(`/result?data=${encodeURIComponent(JSON.stringify(formattedAnswers))}`)
    } else {
      toast.error('Please fill all the required fields before submitting.')
    }
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
