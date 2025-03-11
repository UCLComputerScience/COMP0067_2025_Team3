'use client'

import * as React from 'react'

import { useState } from 'react'

import { Box, Grid2, Typography, Radio } from '@mui/material'

import styles from './styles.module.css'

import Tooltip from '@mui/material/Tooltip'

function Question({ question, note }) {
  const [selectedValue, setSelectedValue] = useState('')

  const handleChange = (value: string) => {
    setSelectedValue(value)
  }

  return (
    <Box>
      <Grid2 container spacing={2}>
        <Grid2 size={1.71}>
          <Typography className={styles.question}>
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
            checked={selectedValue === 'Null'}
            onChange={() => handleChange('Null')}
          />
        </Grid2>
        <Grid2 size={1.71}>
          <Radio
            className={styles.question_button}
            checked={selectedValue === '0'}
            onChange={() => handleChange('0')}
          />
        </Grid2>
        <Grid2 size={1.71}>
          <Radio
            className={styles.question_button}
            checked={selectedValue === '25'}
            onChange={() => handleChange('25')}
          />
        </Grid2>
        <Grid2 size={1.71}>
          <Radio
            className={styles.question_button}
            checked={selectedValue === '50'}
            onChange={() => handleChange('50')}
          />
        </Grid2>
        <Grid2 size={1.71}>
          <Radio
            className={styles.question_button}
            checked={selectedValue === '75'}
            onChange={() => handleChange('75')}
          />
        </Grid2>
        <Grid2 size={1.71}>
          <Radio
            className={styles.question_button}
            checked={selectedValue === '100'}
            onChange={() => handleChange('100')}
          />
        </Grid2>
      </Grid2>
    </Box>
  )
}

export default Question
