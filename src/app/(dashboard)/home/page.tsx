import { Box, Button, Grid2, Typography } from '@mui/material'

import RechartsRadarChart from '@/components/charts/recharts/RechartsRadarChart'

import '@fontsource/inter'

// npm install @fontsource/inter REMEMBER TO RUN THIS

export default function Page() {
  return (
    <div>
      <div>
        <Typography
          variant='h1'
          sx={{
            color: '#433C50',
            textAlign: 'center',
            fontFamily: 'Inter',
            fontFeatureSettings: " 'liga' off, 'clig' off",
            fontStyle: 'normal',
            fontWeight: 800,
            lineHeight: '44px',
            letterSpacing: '3px',
            pt: 3,
            pb: 15
          }}
        >
          The Spider Questionnaire
        </Typography>
        <br />
        <Grid2 container>
          <Grid2 size={3} sx={{ pt: 10 }}>
            <Typography variant='h6' align={'right'}>
              Neuromusculoskeletal
            </Typography>
            <Typography variant='body2' align={'right'}>
              Symptoms in your muscles, joints and nerves
            </Typography>
            <br />
            <Typography variant='h6' align={'right'}>
              Urogenital
            </Typography>
            <Typography variant='body2' align={'right'}>
              Symptoms in your bladder and genitals
            </Typography>
            <br />
            <Typography variant='h6' align={'right'}>
              Anxiety
            </Typography>
            <Typography variant='body2' align={'right'}>
              Symptoms of worry and anxiety
            </Typography>
            <br />
            <Typography variant='h6' align={'right'}>
              Depression
            </Typography>
            <Typography variant='body2' align={'right'}>
              Symptoms of sadness and depression
            </Typography>
          </Grid2>
          <Grid2 size={6}>
            <RechartsRadarChart />
          </Grid2>
          <Grid2 size={3} sx={{ pt: 10 }}>
            <Typography variant='h6' align={'left'}>
              Pain
            </Typography>
            <Typography variant='body2' align={'left'}>
              Symptoms of pain in your body
            </Typography>
            <br />
            <Typography variant='h6' align={'left'}>
              Fatigue
            </Typography>
            <Typography variant='body2' align={'left'}>
              Symptoms of feeling tired physically & mentally
            </Typography>
            <br />
            <Typography variant='h6' align={'left'}>
              Gastrointestinal
            </Typography>
            <Typography variant='body2' align={'left'}>
              Symptoms with digestion and your bowels
            </Typography>
            <br />
            <Typography variant='h6' align={'left'}>
              Cardiac dysautonomia
            </Typography>
            <Typography variant='body2' align={'left'}>
              Symptoms of your heart
            </Typography>
          </Grid2>
        </Grid2>
        <Typography variant='body1' align={'center'} sx={{ pt: 10 }}>
          The Spider is a questionnaire created for people with Hypermobility Spectrum Disorders (HSD) or Hypermobile
          Ehlers-Danlos Syndrome (hEDS). It has eight sections that assesses the different symptoms people with HSD/hEDS
          may have.
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 10 }}>
          <Button variant='contained' color='primary' href='/about'>
            Take The Test
          </Button>
        </Box>
      </div>
      <div>
        <Box sx={{ padding: 0, margin: 0, backgroundColor: '#F4F5FA', width: '100%', boxSizing: 'border-box' }}>
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
              <Box component='img' src='/images/ppef.png' alt='PPEF' sx={{ width: 161, height: 88 }} />
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
      </div>
    </div>
  )
}
