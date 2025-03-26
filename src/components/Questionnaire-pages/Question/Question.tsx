'use client'

import * as React from 'react'
// eslint-disable-next-line import/no-unresolved
import '@fontsource/outfit'

import { Box, Grid2, Typography, Radio } from '@mui/material'

import Tooltip from '@mui/material/Tooltip'

import styles from './styles.module.css'

// Define Props for the Question Component
interface QuestionProps {
  question: string
  note?: string
  selectedValue: string
  onValueChange: (event: React.ChangeEvent<HTMLInputElement>) => void
}

function Question({ question, note, selectedValue, onValueChange }: QuestionProps) {
  return (
    <Box sx={{ padding: '15px' }}>
      <Grid2 container spacing={2}>
        <Grid2 size={1.71}>
          <Typography className={styles.question} sx={{ fontFamily: 'Outfit' }}>
            {question}
            {'  '}
            {note && (
              <Tooltip title={note}>
                <i className='   ri-information-line' />
              </Tooltip>
            )}
          </Typography>
        </Grid2>
        <Grid2 size={1.71}>
          <Radio
            className={styles.question_button}
            value='Null'
            checked={selectedValue === 'Null'}
            onChange={onValueChange}
          />
        </Grid2>
        <Grid2 size={1.71}>
          <Radio
            className={styles.question_button}
            value='0'
            checked={selectedValue === '0'}
            onChange={onValueChange}
          />
        </Grid2>
        <Grid2 size={1.71}>
          <Radio
            className={styles.question_button}
            value='25'
            checked={selectedValue === '25'}
            onChange={onValueChange}
          />
        </Grid2>
        <Grid2 size={1.71}>
          <Radio
            className={styles.question_button}
            value='50'
            checked={selectedValue === '50'}
            onChange={onValueChange}
          />
        </Grid2>
        <Grid2 size={1.71}>
          <Radio
            className={styles.question_button}
            value='75'
            checked={selectedValue === '75'}
            onChange={onValueChange}
          />
        </Grid2>
        <Grid2 size={1.71}>
          <Radio
            className={styles.question_button}
            value='100'
            checked={selectedValue === '100'}
            onChange={onValueChange}
          />
        </Grid2>
      </Grid2>
    </Box>
  )
}

export default Question
