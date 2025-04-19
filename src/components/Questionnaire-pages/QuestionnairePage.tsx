// Updated QuestionPage.tsx with lifted state
'use client'
import { useEffect, useState } from 'react'

import { Button, Grid2, Typography, Box } from '@mui/material'
import { safeParse } from 'valibot'
import { toast } from 'react-toastify'

import { fetchQuestionsByDomain } from '@/actions/questionnaire/userAction'
import styles from './styles.module.css'
import Question from '@/components/Questionnaire-pages/Question/Question'
import {
  NeuromusculoskeletalSchema,
  PainSchema,
  FatigueSchema,
  GastrointestinalSchema,
  CardiacDysautonomiaSchema,
  UrogenitalSchema,
  AnxietySchema,
  DepressionSchema
} from '@/actions/formValidation'

interface QuestionPageProps {
  domain: string
  answers: Record<number, string | string[]>
  onUpdate: (updated: Record<number, string | string[]>) => void
  handleNext: () => void
  handlePrev: () => void
}

interface QuestionType {
  id: number
  domain: string
  question: string
  note: string | null
}

export default function QuestionPage({ domain, answers, onUpdate, handleNext, handlePrev }: QuestionPageProps) {
  const [questions, setQuestions] = useState<QuestionType[]>([])
  const [errors, setErrors] = useState<Record<number, string>>({})

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

  const handleCheckboxChange = (id: number, event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value
    const current = Array.isArray(answers[id]) ? (answers[id] as string[]) : []
    const updated = current.includes(value) ? current.filter(v => v !== value) : [...current, value]

    onUpdate({ ...answers, [id]: updated })
  }

  const handleRadioChange = (id: number, event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value

    onUpdate({ ...answers, [id]: value })
  }

  const validatePage = () => {
    const domainSchemas = {
      Neuromusculoskeletal: NeuromusculoskeletalSchema,
      Pain: PainSchema,
      Fatigue: FatigueSchema,
      Gastrointestinal: GastrointestinalSchema,
      'Cardiac Dysautonomia': CardiacDysautonomiaSchema,
      Urogenital: UrogenitalSchema,
      Anxiety: AnxietySchema,
      Depression: DepressionSchema
    }

    const schema = domainSchemas[domain as keyof typeof domainSchemas]

    if (!schema) {
      setErrors({})

      return handleNext()
    }

    const result = safeParse(schema, answers)

    if (result.success) {
      console.log('Success!', result.output)
      setErrors({})
      handleNext()
    } else {
      const pageErrors = result.issues.reduce(
        (acc, issue) => {
          const key = (issue.path ?? []).map(p => (typeof p === 'object' && 'key' in p ? p.key : String(p))).join('.')

          acc[key] = issue.message

          return acc
        },
        {} as Record<string, string>
      )

      setErrors(pageErrors)
      console.log('Validation Errors:', result.issues)
      toast.error('Please fill out all Questions')
    }
  }

  return (
    <Box>
      <Typography sx={{ fontFamily: 'Outfit', fontSize: '48px', fontWeight: 600, lineHeight: '68px', padding: '20px' }}>
        {domain}
      </Typography>
      <Typography
        sx={{ fontFamily: 'Inter', fontSize: '24px', fontWeight: 400, lineHeight: '28px', paddingBottom: '79px' }}
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

      <form>
        {questions.map(q => (
          <div key={q.id} id={q.id.toString()}>
            {q.id === 19 && (
              <Grid2 container spacing={2}>
                <Grid2 size={2}></Grid2>
                {[
                  'In warm\nenvironments(20)',
                  'After a\nmeal (20)',
                  'Right after\nstraining (20)',
                  'During or right\nafter physical\nactivity (20)',
                  'Other\n20'
                ].map((label, idx) => (
                  <Grid2 size={2} key={idx}>
                    <Typography className={styles.options}>{label}</Typography>
                  </Grid2>
                ))}
              </Grid2>
            )}

            {q.id === 25 && (
              <Grid2 container spacing={2}>
                <Grid2 size={2}></Grid2>
                {['Never (0)', '1-2 Times (33.3)', '3 Times (66.6)', 'Over 3 times (100)'].map((label, idx) => (
                  <Grid2 size={2} key={idx}>
                    <Typography className={styles.options}>{label}</Typography>
                  </Grid2>
                ))}
                <Grid2 size={2}></Grid2>
              </Grid2>
            )}

            <Question
              key={q.id}
              id={q.id}
              question={q.question}
              selectedValue={q.id === 19 ? answers[q.id] || [] : answers[q.id] || ''}
              onValueChange={e => (q.id === 19 ? handleCheckboxChange(q.id, e) : handleRadioChange(q.id, e))}
              error={errors[q.id]}
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
            <Button onClick={validatePage} variant='contained'>
              Next
            </Button>
          </Box>
        </Grid2>
      </form>
    </Box>
  )
}
