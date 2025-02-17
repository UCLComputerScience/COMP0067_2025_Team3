'use client'
import { Card, CardContent, Grid2, Typography } from '@mui/material'
import CustomLegend from './CustomLegend'
import RechartsBarChart from './recharts/RechartsBarChart'
import RechartsRadarChart from './recharts/RechartsRadarChart'
import SelectedMenu from '../menu/SelectedMenu'
import { SetStateAction, useEffect, useState } from 'react'

interface DataEntry {
  subject: string
  [date: string]: string | number
}

interface Props {
  data?: DataEntry[]
}

interface DomainData {
  date: string
  total: number
}

const convertToDomainData = (data: DataEntry) => {
  return Object.entries(data)
    .filter(([key]) => key !== 'subject')
    .map(([date, total]) => ({
      date,
      total: total as number
    }))
}

const demoData = [
  {
    subject: 'Neuromusculoskeletal',
    '04/06/2024': 41,
    '06/04/2025': 65
  },
  {
    subject: 'Pain',
    '04/06/2024': 64,
    '06/04/2025': 46
  },
  {
    subject: 'Urogenital',
    '04/06/2024': 81,
    '06/04/2025': 42
  },
  {
    subject: 'Anxiety',
    '04/06/2024': 60,
    '06/04/2025': 25
  },
  {
    subject: 'Depression',
    '04/06/2024': 42,
    '06/04/2025': 58
  },
  {
    subject: 'Fatigue',
    '04/06/2024': 33,
    '06/04/2025': 76
  },
  {
    subject: 'Gastrointestinal',
    '04/06/2024': 23,
    '06/04/2025': 43
  },
  {
    subject: 'Cardiac Dysautonomia',
    '04/06/2024': 23,
    '06/04/2025': 43
  }
]

const TrendCharts = ({ data = demoData }: Props) => {
  const [options, setOptions] = useState<string[]>([])
  const [domainData, setDomainData] = useState<DomainData[]>([])
  const [selectedDomainIndex, setSelectedDomainIndex] = useState<number>(0)
  const [keys, setKeys] = useState<string[]>([])

  useEffect(() => {
    console.log(data)
    setOptions(
      data.reduce<string[]>((acc, e) => {
        acc.push(e.subject)
        return acc
      }, [])
    )
  }, [])

  useEffect(() => {
    const currKeys = Object.keys(data[0]).filter(e => e !== 'subject')
    setKeys(currKeys)
  }, [data])

  useEffect(() => {
    const foundEntry = data.find(e => e.subject === options[selectedDomainIndex])

    if (foundEntry) {
      const transformedDomainData = convertToDomainData(foundEntry)
      setDomainData(transformedDomainData)
    } else {
      console.warn('No matching subject found')
    }
  }, [selectedDomainIndex, data])

  return (
    <>
      <Card>
        <CardContent>
          <Grid2 container>
            <Grid2 size={7} sx={{ mb: 8 }}>
              <Typography variant='h5'>Total Trend by Domains</Typography>
            </Grid2>
            <Grid2 size={5} sx={{ mb: 8 }}>
              <SelectedMenu
                options={options}
                selectedIndex={selectedDomainIndex}
                setSelectedIndex={setSelectedDomainIndex}
              />
            </Grid2>
            <Grid2 size={7}>
              <RechartsRadarChart legend={false} data={data} />
            </Grid2>
            <Grid2 size={5}>
              <RechartsBarChart legend={false} data={domainData} />
            </Grid2>
            <Grid2 size={12} sx={{ mt: 8 }}>
              <CustomLegend keys={keys} colors={['#16B1FF', '#8C57FF', '#56CA00']} />
            </Grid2>
          </Grid2>
        </CardContent>
      </Card>
    </>
  )
}

export default TrendCharts
