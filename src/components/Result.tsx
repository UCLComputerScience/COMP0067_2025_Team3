// TO DO: DISPLAY PERCEIVED SPIDERGRAM AND EXPORT

'use client'

import { Card, CardContent, Typography, Box, Button, FormGroup, FormControlLabel, Switch, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material'

import RechartsRadarChart from '@/components/charts/recharts/RechartsRadarChart'

interface DataEntry {
  subject: string
  [date: string]: string | number
}

interface DomainScore {
  domain: string
  totalScore: number
  averageScore: number
}

interface Props {
  data?: DataEntry[]
  domainData?: DomainScore[]
  date: string
}

const Result = ({ data = [], domainData = [], date }: Props) => {

  const rowNumbers = [5, 4, 3, 3, 4, 4, 3, 3];

  return (
    <div className="p-8 space-y-6">
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 3 }}>
        <Box>
          <Typography variant='h2' gutterBottom>
             {date}
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 1 }}>
          <Button variant="contained" color="primary" startIcon={<i className="ri-download-2-fill" />}>
            Export
          </Button>
          <FormGroup>
            <FormControlLabel control={<Switch />} label="Display perceived spidergram" />
          </FormGroup>
        </Box>
      </Box>

      <RechartsRadarChart legend={false} data={data} />

      <Card>
        <CardContent>
          <Typography variant="h5" gutterBottom>
            Domain Scores
          </Typography>
            <TableContainer component={Paper} sx={{ width: '100%' }}>
            <Table sx={{ width: '100%' }}>
              <TableHead>
                <TableRow>
                <TableCell>Domain</TableCell>
                <TableCell align="right">Total</TableCell>
                <TableCell align="right"></TableCell>
                <TableCell align="right">Average</TableCell>
                </TableRow>
              </TableHead>
            <TableBody>
                {domainData.map(({ domain, totalScore, averageScore }, index) => (
                <TableRow key={index} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                    <TableCell component="th" scope="row">{domain}</TableCell>
                    <TableCell align="right">{totalScore}</TableCell>
                    <TableCell align="right">Total/{rowNumbers[index]}:</TableCell>
                    <TableCell align="right">{averageScore.toFixed(2)}</TableCell>
                </TableRow>
                ))}
            </TableBody>
            </Table>
        </TableContainer>
        </CardContent>
      </Card>
    </div>
  )
}

export default Result
