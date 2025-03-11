import * as React from 'react'

import { Button, Grid2, Typography, Box } from '@mui/material'

import styles from './styles.module.css'

import Question from '@/components/Question/Question'

import Tooltip from '@mui/material/Tooltip'

const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

export default async function QuestionPage({ domain, nextPage, previousPage }) {
  const questions = await prisma.Question.findMany({
    where: { domain },
    select: {
      question: true,
      note: true
    }
  })

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
        {questions.map((questions, i) => (
          <div key={i}>
            <Question question={questions.question} note={questions.note} />
            <br />
          </div>
        ))}
      </form>
      <Grid2 container sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Grid2 size={6}>
          <Button href={previousPage} variant='contained'>
            Previous
          </Button>
        </Grid2>
        <Box display='flex' justifyContent='flex-end'>
          <Button href={nextPage} variant='contained'>
            Next
          </Button>
        </Box>
      </Grid2>
    </Box>
  )
}
