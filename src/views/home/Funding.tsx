'use client'

import { Box, Typography, Grid2 } from '@mui/material'

const Funding = () => {
  return (
    <section>
      <Box
        sx={{
          paddingBottom: 20,
          margin: 0,
          width: '100%',
          boxSizing: 'border-box',
          backgroundColor: 'var(--mui-palette-customColors-bodyBg)'
        }}
      >
        <Typography variant='body1' align={'center'} sx={{ padding: 15 }}>
          RESEARCH FUNDING
        </Typography>
        <Grid2 container spacing={10} justifyContent={'center'}>
          <Grid2>
            <Box
              component='img'
              src='/images/assoc-of-paediatrics.png'
              alt='Assoc-of-paediatrics'
              sx={{ width: 186, height: 74, objectFit: 'contain' }}
            />
          </Grid2>
          <Grid2>
            <Box
              component='img'
              src='/images/ehler-danlos-soc.png'
              alt='Ehlers-danlos-society'
              sx={{ width: 158, height: 88, objectFit: 'contain' }}
            />
          </Grid2>
          <Grid2>
            <Box
              component='img'
              src='/images/EDS.png'
              alt='EDS'
              sx={{ width: 148, height: 88, objectFit: 'contain' }}
            />
          </Grid2>
          <Grid2>
            <Box component='img' src='/images/PPEF.png' alt='PPEF' sx={{ width: 161, height: 88 }} />
          </Grid2>
        </Grid2>
        <Typography variant='body1' align={'center'} sx={{ padding: 15 }}>
          RECRUITMENT SUPPORT
        </Typography>
        <Grid2 container spacing={10} justifyContent={'center'}>
          <Grid2>
            <Box component='img' src='/images/EDS.png' alt='EDS' sx={{ width: 179, height: 76 }} />
          </Grid2>
          <Grid2>
            <Box
              component='img'
              src='/images/ehler-danlos-soc.png'
              alt='Ehlers-danlos-society'
              sx={{ width: 177, height: 86 }}
            />
          </Grid2>
          <Grid2>
            <Box
              component='img'
              src='/images/central-health-physiotherapy.png'
              alt='Central Health Physiotherapy'
              sx={{ width: 186, height: 78 }}
            />
          </Grid2>
          <Grid2>
            <Box
              component='img'
              src='/images/hypermobility-syndromes-association.png'
              alt='Assoc-of-paediatrics'
              sx={{ width: 311, height: 75 }}
            />
          </Grid2>
        </Grid2>
      </Box>
    </section>
  )
}

export default Funding
