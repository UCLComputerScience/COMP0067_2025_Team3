'use client'

// MUI
import {
  Card,
  CardContent,
  Typography,
  Box,
  Button,
  FormGroup,
  FormControlLabel,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper
} from '@mui/material'

// Style
import '@fontsource/outfit'

// react
import { useRef, useState } from 'react'

// component
import RechartsRadarChart from '@/components/charts/recharts/RechartsRadarChart'

// utils
import { exportToPdf } from '@/utils/pdfUtils'

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
  patientName?: string
}

const Result = ({ data = [], domainData = [], date, patientName }: Props) => {
  const rowNumbers = [5, 4, 3, 3, 4, 4, 3, 3]
  const [showPerceived, setShowPerceived] = useState(false)
  const contentRef = useRef<HTMLDivElement>(null)
  const [isExporting, setIsExporting] = useState(false)

  const handleExport = async () => {
    if (!contentRef.current) return

    setIsExporting(true)
    try {
      await exportToPdf(contentRef.current, {
        filename: `results-${date}.pdf`,
        orientation: 'portrait',
        onComplete: () => setIsExporting(false)
      })
    } catch (error) {
      console.error('Export failed:', error)
      setIsExporting(false)
    }
  }

  return (
    <div className='p-8 space-y-6' ref={contentRef}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 3 }}>
        <Box>
          <Typography variant='h2' gutterBottom sx={{ fontFamily: 'Outfit' }}>
            {date}
          </Typography>
          {patientName && (
            <Typography variant='h4' gutterBottom sx={{ fontFamily: 'Outfit' }}>
              {patientName}
            </Typography>
          )}
        </Box>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 1 }}>
          <Button
            className='no-print'
            variant='contained'
            color='primary'
            startIcon={<i className='ri-download-2-fill' />}
            onClick={handleExport}
            disabled={isExporting}
          >
            {isExporting ? 'Exporting...' : 'Export'}
          </Button>
          <FormGroup>
            <FormControlLabel
              control={<Switch checked={showPerceived} onChange={e => setShowPerceived(e.target.checked)} />}
              label='Display perceived spidergram'
            />
          </FormGroup>
        </Box>
      </Box>

      <RechartsRadarChart legend={false} data={data} />

      <Card>
        <CardContent>
          <Typography variant='h5'>Domain Scores</Typography>
          <TableContainer component={Paper} sx={{ width: '100%', boxShadow: 'none', mt: 4 }}>
            <Table sx={{ width: '100%' }}>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontFamily: 'Outfit' }}>Domain</TableCell>
                  <TableCell align='right' sx={{ fontFamily: 'Outfit' }}>
                    Total
                  </TableCell>
                  <TableCell align='right'></TableCell>
                  <TableCell align='right' sx={{ fontFamily: 'Outfit' }}>
                    Average
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {domainData.map(({ domain, totalScore, averageScore }, index) => (
                  <TableRow hover key={index} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                    <TableCell component='th' scope='row' sx={{ fontFamily: 'Outfit' }}>
                      {domain}
                    </TableCell>
                    <TableCell align='right' sx={{ fontFamily: 'Outfit' }}>
                      {totalScore}
                    </TableCell>
                    <TableCell align='right' sx={{ fontFamily: 'Outfit' }}>
                      Total/{rowNumbers[index]}:
                    </TableCell>
                    <TableCell align='right' sx={{ fontFamily: 'Outfit' }}>
                      {averageScore.toFixed(2)}
                    </TableCell>
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
