'use client'

import { Typography, Grid2, Box, Button } from '@mui/material'

import { useSession } from 'next-auth/react'

import RechartsRadarChart from '@/components/charts/recharts/RechartsRadarChart'

const Intro = () => {
  const { data: session } = useSession()
  const role = session?.user.role

  return (
    // bg-backgroundPaper
    <section className=' pt-10 px-4'>
      <Typography
        variant='h1'
        sx={{
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
        <Button variant='contained' color='primary' href={role === 'PATIENT' ? '/my-questionnaire' : '/questionnaire'}>
          Take The Test
        </Button>
      </Box>
    </section>
  )
}

export default Intro
