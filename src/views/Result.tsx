import { Typography } from '@mui/material'

import RechartsRadarChart from '@/components/charts/recharts/RechartsRadarChart'

const Result = () => {
  return (
    <>
      <Typography variant='h3'>Date</Typography>
      <Typography variant='h3'>Total Score</Typography>
      <RechartsRadarChart />
    </>
  )
}

export default Result
