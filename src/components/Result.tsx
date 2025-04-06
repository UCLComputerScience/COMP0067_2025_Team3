'use client';

import { useRef, useState } from 'react';
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
} from '@mui/material';

import '@fontsource/outfit';

import RechartsRadarChart from '@/components/charts/recharts/RechartsRadarChart';
import { exportToPdf } from '@/utils/pdfUtils';

interface DataEntry {
  subject: string;
  [date: string]: string | number;
}

interface PerceivedSpidergramData {
  subject: string;
  value: number;
}

interface DomainScore {
  domain: string;
  totalScore: number;
  averageScore: number;
}

interface Props {
  data?: DataEntry[];
  domainData?: DomainScore[];
  perceivedSpidergramData?: PerceivedSpidergramData[];
  date: string;
  patientName?: string;
}

const Result = ({
  data = [],
  domainData = [],
  perceivedSpidergramData = [],
  date,
  patientName
}: Props) => {
  const rowNumbers = [5, 4, 3, 3, 4, 4, 3, 3];
  const [showPerceived, setShowPerceived] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  // Filter out the perceived spidergram item (it's merged manually)
  const filteredData = data.filter(item => item.subject !== 'Perceived Spidergram');

  // Handle PDF export
  const handleExport = async () => {
    if (!contentRef.current) return;

    setIsExporting(true);
    try {
      await exportToPdf(contentRef.current, {
        filename: `results-${date}.pdf`,
        orientation: 'portrait',
        onComplete: () => setIsExporting(false)
      });
    } catch (error) {
      console.error('Export failed:', error);
      setIsExporting(false);
    }
  };

  // Handle toggle switch
  const handleSwitchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setShowPerceived(event.target.checked);
  };

  // Merge perceived data into filteredData
  const mergedData = filteredData.map(entry => {
    const subject = entry.subject.toLowerCase().trim();
    const match = perceivedSpidergramData.find(
      item => item.subject.toLowerCase().trim() === subject
    );
    return {
      ...entry,
      'Perceived score': match?.value ?? ''
    };
  });

  const ifPerceivedExists = mergedData.every(item => item['Perceived score'] !== '');

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
          {ifPerceivedExists && (
            <FormGroup>
              <FormControlLabel
                control={<Switch checked={showPerceived} onChange={handleSwitchChange} />}
                label='Display perceived spidergram'
              />
            </FormGroup>
          )}
        </Box>
      </Box>

      {!showPerceived && <RechartsRadarChart legend={false} data={filteredData} />}
      {showPerceived && <RechartsRadarChart legend={false} data={mergedData} />}

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
                  <TableCell align='right' sx={{ fontFamily: 'Outfit' }}>
                    Total/{rowNumbers[0]}:
                  </TableCell>
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
  );
};

export default Result;
