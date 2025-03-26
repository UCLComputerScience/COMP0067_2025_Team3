'use client'

import * as React from 'react'

import '@fontsource/outfit'

import { Box, Grid2, Typography, Radio, Checkbox } from '@mui/material'

import Tooltip from '@mui/material/Tooltip'

import styles from './styles.module.css'

// Define Props for the Question Component
interface QuestionProps {
  id: number
  question: string
  note?: string
  selectedValue: string | string[]
  onValueChange: (event: React.ChangeEvent<HTMLInputElement>) => void
}

function Question({ id, question, note, selectedValue, onValueChange }: QuestionProps) {
  if (id === 19) {
    const selected = Array.isArray(selectedValue) ? selectedValue : []

    const options = [
      'In warm environments',
      'After a meal',
      'Right after straining',
      'During or after physical activity',
      'Other'
    ]

    return (
      <Box sx={{ padding: '15px' }}>
        <Grid2 container spacing={2}>
          <Grid2 size={2}>
            <Typography className={styles.question} sx={{ fontFamily: 'Outfit' }}>
              {question}
              {note && (
                <Tooltip title={note}>
                  <i className='ri-information-line' />
                </Tooltip>
              )}
            </Typography>
          </Grid2>
          {options.map(label => (
            <Grid2 key={label} size={2} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Checkbox value={label} checked={selected.includes(label)} onChange={onValueChange} />
            </Grid2>
          ))}
        </Grid2>
      </Box>
    )
  }

  // Special formatting for question 25
  else if (id === 25) {
    return (
      <Box sx={{ padding: '15px' }}>
        <Grid2 container spacing={2}>
          <Grid2 size={2}>
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
          <Grid2 size={2}>
            <Radio
              className={styles.question_button}
              value='0'
              checked={selectedValue === '0'}
              onChange={onValueChange}
            />
          </Grid2>
          <Grid2 size={2}>
            <Radio
              className={styles.question_button}
              value='33.3'
              checked={selectedValue === '33.3'}
              onChange={onValueChange}
            />
          </Grid2>
          <Grid2 size={2}>
            <Radio
              className={styles.question_button}
              value='66.6'
              checked={selectedValue === '66.6'}
              onChange={onValueChange}
            />
          </Grid2>
          <Grid2 size={2}>
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
  } else {
    // Standard question
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
}

export default Question
