'use client'
import { useEffect, useState } from 'react'
import * as React from 'react'

import { useRouter } from 'next/navigation'

import { v4 as uuidv4 } from 'uuid'
import { Button, Grid2, Typography, Box, Tooltip } from '@mui/material'
import { safeParse } from 'valibot'
import { useSession } from 'next-auth/react'

import { toast } from 'react-toastify'

import { submitResponses } from '@/actions/submit-response/submission-action'
import { fetchQuestionsByDomain } from '@/actions/questionnaire/userAction'
import styles from './styles.module.css'
import Question from '@/components/Questionnaire-pages/Question/Question'
import {
  QuestionnaireSchema,
  NeuromusculoskeletalSchema,
  PainSchema,
  FatigueSchema,
  GastrointestinalSchema,
  CardiacDysautonomiaSchema,
  UrogenitalSchema,
  AnxietySchema,
  DepressionSchema
} from '@/actions/formValidation'
import '@fontsource/inter'

interface QuestionPageProps {
  domain: string
  handleNext: () => void
  handlePrev: () => void
}

interface QuestionType {
  id: number
  domain: string
  question: string
  note: string | null
}

export default function QuestionPage({ domain, handleNext, handlePrev }: QuestionPageProps) {
  const router = useRouter()
  const { data: session } = useSession()
  const userRole = session?.user?.role || 'GUEST'
  let userId = ''

  if (session) {
    userId = session.user.id
  }

  const [questions, setQuestions] = useState<QuestionType[]>([])
  const [answers, setAnswers] = useState<Record<string, Record<number, string | string[]>>>({})

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const fetchedQuestions = await fetchQuestionsByDomain(domain)

        setQuestions(fetchedQuestions)
      } catch (error) {
        console.error('Error fetching questions:', error)
      }
    }

    fetchQuestions()
  }, [domain])

  // Handle the checkboxes for question 19
  const handleCheckboxChange = (domain: string, id: number, event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value

    setAnswers(prev => {
      const domainAnswers = prev[domain] || {}
      const current = Array.isArray(domainAnswers[id]) ? domainAnswers[id] : []

      const updated = current.includes(value) ? current.filter(v => v !== value) : [...current, value]

      return {
        ...prev,
        [domain]: {
          ...domainAnswers,
          [id]: updated
        }
      }
    })
  }

  // Handle the radio buttons throughout
  const handleRadioChange = (domain: string, id: number, event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value

    setAnswers(prev => {
      const domainAnswers = prev[domain] || {}

      return {
        ...prev,
        [domain]: {
          ...domainAnswers,
          [id]: value
        }
      }
    })
  }

  const validatePage = () => {
    switch (domain) {
      case 'Neuromusculoskeletal':
        const nmskResult = safeParse(NeuromusculoskeletalSchema, answers[domain])

        if (nmskResult.success) {
          console.log('Success!', nmskResult.output)
          handleNext()
        } else {
          console.log('Validation Errors:', nmskResult.issues)
          toast.error('Please fill out all Questions')
        }

        break

      case 'Pain':
        const painResult = safeParse(PainSchema, answers[domain])

        if (painResult.success) {
          console.log('Success!', painResult.output)
          handleNext()
        } else {
          console.log('Validation Errors:', painResult.issues)
          toast.error('Please fill out all Questions')
        }

        break

      case 'Fatigue':
        const fatigueResult = safeParse(FatigueSchema, answers[domain])

        if (fatigueResult.success) {
          console.log('Success!', fatigueResult.output)
          handleNext()
        } else {
          console.log('Validation Errors:', fatigueResult.issues)
          toast.error('Please fill out all Questions')
        }

        break

      case 'Gastrointestinal':
        const gastrointestinalResult = safeParse(GastrointestinalSchema, answers[domain])

        if (gastrointestinalResult.success) {
          console.log('Success!', gastrointestinalResult.output)
          handleNext()
        } else {
          console.log('Validation Errors:', gastrointestinalResult.issues)
          toast.error('Please fill out all Questions')
        }

        break

      case 'Cardiac Dysautonomia':
        const cardiacDysautonomiaResult = safeParse(CardiacDysautonomiaSchema, answers[domain])

        if (cardiacDysautonomiaResult.success) {
          console.log('Success!', cardiacDysautonomiaResult.output)
          handleNext()
        } else {
          console.log('Validation Errors:', cardiacDysautonomiaResult.issues)
          toast.error('Please fill out all Questions')
        }

        break

      case 'Urogenital':
        const urogenitalResult = safeParse(UrogenitalSchema, answers[domain])

        if (urogenitalResult.success) {
          console.log('Success!', urogenitalResult.output)
          handleNext()
        } else {
          console.log('Validation Errors:', urogenitalResult.issues)
          toast.error('Please fill out all Questions')
        }

        break

      case 'Anxiety':
        const anxietyResult = safeParse(AnxietySchema, answers[domain])

        if (anxietyResult.success) {
          console.log('Success!', anxietyResult.output)
          handleNext()
        } else {
          console.log('Validation Errors:', anxietyResult.issues)
          toast.error('Please fill out all Questions')
        }

        break

      case 'Depression':
        const depressionResult = safeParse(DepressionSchema, answers[domain])

        if (depressionResult.success) {
          console.log('Success!', depressionResult.output)
          submitData()
        } else {
          console.log('Validation Errors:', depressionResult.issues)
          toast.error('Please fill out all Questions')
        }

        break
    }
  }

  // Data submission function
  const submitData = async () => {
    const submissionId = uuidv4()

    const flatAnswers = Object.values(answers).reduce((acc, domainObj) => {
      return { ...acc, ...domainObj }
    }, {})

    const validationResult = safeParse(QuestionnaireSchema, flatAnswers)

    if (validationResult.success) {
      const allFormattedAnswers = Object.entries(answers).flatMap(([domain, questionSet]) => {
        return Object.entries(questionSet).map(([questionId, value]) => {
          const score = Array.isArray(value) ? value.length * 20 : isNaN(Number(value)) ? 0 : Number(value)

          return {
            userId,
            domain,
            questionId: Number(questionId),
            score,
            label: String(score),
            submissionId
          }
        })
      })

      if (userRole === 'PATIENT') {
        const result = await submitResponses(allFormattedAnswers)

        if (result.success) {
          toast.success('Successfully submitted responses, redirecting to records page')
          setTimeout(() => {
            router.push('/my-records')
          }, 2000)
        } else {
          toast.error('Failed to submit responses')
        }
      } else if (userRole !== 'PATIENT') {
        toast.success('Successfully submitted responses')
        setTimeout(() => {
          router.push('/home')
        }, 2000)
      }
    } else {
      toast.error('There is an issue with your questionnaire answers')
    }
  }

  // Submission logic
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    submitData()
  }

  return (
    <Box>
      <Typography
        sx={{
          fontFamily: 'Outfit',
          fontSize: '48px',
          fontWeight: '600',
          lineHeight: '68px',
          padding: '20px'
        }}
      >
        {domain}
      </Typography>

      <Typography
        sx={{
          fontFamily: 'Inter',
          fontSize: '24px',
          fontWeight: '400',
          lineHeight: '28px',
          paddingBottom: '79px'
        }}
      >
        How much have these symptoms impacted your daily life during the past ONE month?
      </Typography>

      <Grid2 container spacing={2}>
        <Grid2 size={1.71}></Grid2>
        <Grid2 size={1.71}>
          <Typography className={styles.options}>Not Present (0)</Typography>
        </Grid2>
        <Grid2 size={1.71}>
          <Typography className={styles.options}>No Impact (0)</Typography>
        </Grid2>
        <Grid2 size={1.71}>
          <Typography className={styles.options}>Mild Impact (25)</Typography>
        </Grid2>
        <Grid2 size={1.71}>
          <Typography className={styles.options}>
            Moderate
            <br />
            Impact (50)
          </Typography>
        </Grid2>
        <Grid2 size={1.71}>
          <Typography className={styles.options}>
            Marked
            <br />
            Impact (75)
          </Typography>
        </Grid2>
        <Grid2 size={1.71}>
          <Typography className={styles.options}>Disabling (100)</Typography>
        </Grid2>
      </Grid2>

      <form onSubmit={handleSubmit}>
        {questions.map(q => (
          <div key={q.id}>
            {q.id === 19 && (
              <Grid2 container spacing={2}>
                <Grid2 size={2}></Grid2>
                <Grid2 size={2}>
                  <Typography className={styles.options}>
                    In warm
                    <br />
                    environments(20)
                  </Typography>
                </Grid2>
                <Grid2 size={2}>
                  <Typography className={styles.options}>
                    After a
                    <br />
                    meal (20)
                  </Typography>
                </Grid2>
                <Grid2 size={2}>
                  <Typography className={styles.options}>
                    Right after
                    <br />
                    straining{' '}
                    <Tooltip title={'e.g during or shortly after a toilet visit, lifting heavy items, ...)'}>
                      <i className='   ri-information-line' />
                    </Tooltip>{' '}
                    (20)
                  </Typography>
                </Grid2>
                <Grid2 size={2}>
                  <Typography className={styles.options}>
                    During or right
                    <br />
                    after physical
                    <br />
                    activity{' '}
                    <Tooltip title={'e.g. walking, taking stairs, cycling, ...'}>
                      <i className='   ri-information-line' />
                    </Tooltip>{' '}
                    (20)
                  </Typography>
                </Grid2>
                <Grid2 size={2}>
                  <Typography className={styles.options}>
                    Other
                    <br />
                    20
                  </Typography>
                </Grid2>
              </Grid2>
            )}

            {q.id === 25 && (
              <Grid2 container spacing={2}>
                <Grid2 size={2}></Grid2>
                <Grid2 size={2}>
                  <Typography className={styles.options}>Never (0)</Typography>
                </Grid2>
                <Grid2 size={2}>
                  <Typography className={styles.options}>1-2 Times (33.3)</Typography>
                </Grid2>
                <Grid2 size={2}>
                  <Typography className={styles.options}>3 Times (66.6)</Typography>
                </Grid2>
                <Grid2 size={2}>
                  <Typography className={styles.options}>Over 3 times (100)</Typography>
                </Grid2>
                <Grid2 size={2}></Grid2>
              </Grid2>
            )}

            <Question
              key={q.id}
              id={q.id}
              question={q.question}
              selectedValue={q.id === 19 ? answers[domain]?.[q.id] || [] : answers[domain]?.[q.id] || ''}
              onValueChange={e =>
                q.id === 19 ? handleCheckboxChange(domain, q.id, e) : handleRadioChange(domain, q.id, e)
              }
              {...(q.note !== null ? { note: q.note } : {})}
            />
            <br />
          </div>
        ))}

        <Grid2 container sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Grid2 size={6}>
            <Button onClick={handlePrev} variant='contained'>
              Previous
            </Button>
          </Grid2>
          <Box display='flex' justifyContent='flex-end'>
            {domain === 'Depression' ? (
              <Button onClick={validatePage} variant='contained'>
                Submit
              </Button>
            ) : (
              <Button onClick={validatePage} variant='contained'>
                Next
              </Button>
            )}
          </Box>
        </Grid2>
      </form>
    </Box>
  )
}
