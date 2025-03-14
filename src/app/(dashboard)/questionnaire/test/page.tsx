import React from 'react'

import { Radio, RadioGroup, FormControlLabel, FormControl, Grid2 } from '@mui/material'

export default function RadioButtonGroup() {
  return (
    <FormControl component='fieldset'>
      <Grid2 container spacing={20} justifyContent='space-between'>
        <p>Questions</p>
        <RadioGroup row name='radio-buttons-group' defaultValue='option1'>
          <Grid2>
            <FormControlLabel value='option1' control={<Radio />} label='Option 1' />
          </Grid2>
          <Grid2>
            <FormControlLabel value='option2' control={<Radio />} label='Option 2' />
          </Grid2>
          <Grid2>
            <FormControlLabel value='option3' control={<Radio />} label='Option 3' />
          </Grid2>
          <Grid2>
            <FormControlLabel value='option4' control={<Radio />} label='Option 4' />
          </Grid2>
          <Grid2>
            <FormControlLabel value='option5' control={<Radio />} label='Option 5' />
          </Grid2>
          <Grid2>
            <FormControlLabel value='option6' control={<Radio />} label='Option 6' />
          </Grid2>
        </RadioGroup>
      </Grid2>
    </FormControl>
  )
}
