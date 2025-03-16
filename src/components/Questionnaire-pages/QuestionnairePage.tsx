'use client'

import { useEffect, useState } from 'react'

import * as React from 'react'

import { Button, Grid2, Typography, Box } from '@mui/material'

import styles from './styles.module.css'

import Question from '@/components/Questionnaire-pages/Question/Question'

// Define Props for the Quesiton Page
interface QuestionPageProps {
  domain: string
  handleNext: () => void
  handlePrev: () => void
}

export default function QuestionPage({ domain, handleNext, handlePrev }: QuestionPageProps) {
  const [questions, setQuestions] = useState([])
  const [answers, setAnswers] = useState({})

  useEffect(() => {
    fetch('/api/questions')
      .then(res => res.json())
      .then(data => {
        const filteredQuestions = data.filter(q => q.domain.includes(domain))

        setQuestions(filteredQuestions)
      })
  }, [domain])

  const handleRadioChange = ({ questionId, value }) => {
    setAnswers(prevAnswers => ({
      ...prevAnswers,
      [questionId]: value
    }))
  }

  return (
    <Box>
      <Typography variant='h1'>{domain}</Typography>
      <br />
      <Typography variant='body1'>
        How much have these symptoms impacted your daily life during the past ONE month?
      </Typography>
      <br />
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
        {questions.map(questions => (
          <div key={questions.id}>
            <Question
              onValueChange={event => handleRadioChange(questions.id, event)}
              selectedValue={answers[questions.id] || ''}
              question={questions.question}
              note={questions.note}
            />
            <br />
          </div>
        ))}
      </form>
      <Grid2 container sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Grid2 size={6}>
          <Button onClick={handlePrev} variant='contained'>
            Previous
          </Button>
        </Grid2>
        <Box display='flex' justifyContent='flex-end'>
          {domain === 'Depression' ? (
            <Button variant='contained' onClick={() => console.log(answers)}>
              Submit
            </Button>
          ) : (
            <Button onClick={handleNext} variant='contained'>
              Next
            </Button>
          )}
        </Box>
      </Grid2>
    </Box>
  )
}
