'use client'

import * as React from 'react'

import { useState } from 'react'

import { Box, Grid2, Typography, Radio } from '@mui/material'

import Tooltip from '@mui/material/Tooltip'

import styles from './styles.module.css'

function Question({ question, note, selectedValue, onValueChange }) {
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
            onChange={() => onValueChange('Null')}
          />
        </Grid2>
        <Grid2 size={1.71}>
          <Radio
            className={styles.question_button}
            checked={selectedValue === '0'}
            onChange={() => onValueChange('0')}
          />
        </Grid2>
        <Grid2 size={1.71}>
          <Radio
            className={styles.question_button}
            checked={selectedValue === '25'}
            onChange={() => onValueChange('25')}
          />
        </Grid2>
        <Grid2 size={1.71}>
          <Radio
            className={styles.question_button}
            checked={selectedValue === '50'}
            onChange={() => onValueChange('50')}
          />
        </Grid2>
        <Grid2 size={1.71}>
          <Radio
            className={styles.question_button}
            checked={selectedValue === '75'}
            onChange={() => onValueChange('75')}
          />
        </Grid2>
        <Grid2 size={1.71}>
          <Radio
            className={styles.question_button}
            checked={selectedValue === '100'}
            onChange={() => onValueChange('100')}
          />
        </Grid2>
      </Grid2>
    </Box>
  )
}

export default Question
