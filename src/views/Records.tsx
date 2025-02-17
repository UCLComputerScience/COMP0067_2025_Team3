'use client'

import { Data } from '@/app/(dashboard)/my-records/page'
import TrendCharts from '@/components/charts/TrendCharts'
import RecordListTable from '@/components/record-list-table'
import { Box, Typography } from '@mui/material'
import React, { useEffect } from 'react'
import { toast } from 'react-toastify'

interface Props {
  data: Data[]
}

type DataItem = {
  submissionId: string
  date: string
  neuromusculoskeletal: number
  pain: number
  fatigue: number
  gastrointestinal: number
  cardiacDysautonomia: number
  urogenital: number
  anxiety: number
  depression: number
}

type TransformedDataItem = {
  subject: string
  [date: string]: string | number
}

const transformData = (data: DataItem[]): TransformedDataItem[] => {
  const subjects: (keyof Omit<DataItem, 'submissionId' | 'date'>)[] = [
    'neuromusculoskeletal',
    'pain',
    'fatigue',
    'gastrointestinal',
    'cardiacDysautonomia',
    'urogenital',
    'anxiety',
    'depression'
  ]

  // Group submissions by formatted date and sort by submission time
  const groupedByDate: Record<string, DataItem[]> = {}

  data.forEach(item => {
    const formattedDate = formatDate(item.date) // Convert to MM/DD/YYYY
    if (!groupedByDate[formattedDate]) {
      groupedByDate[formattedDate] = []
    }
    groupedByDate[formattedDate].push(item)
  })

  // Sort each date's submissions by timestamp
  Object.keys(groupedByDate).forEach(date => {
    groupedByDate[date].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
  })

  const result: TransformedDataItem[] = subjects.map(subject => {
    const transformed: TransformedDataItem = { subject: capitalizeFirstLetter(subject) }

    Object.entries(groupedByDate).forEach(([formattedDate, submissions]) => {
      submissions.forEach((item, index) => {
        const uniqueKey = submissions.length > 1 ? `${formattedDate} - ${index + 1}` : formattedDate
        transformed[uniqueKey] = item[subject]
      })
    })

    return transformed
  })

  return result
}

// Function to format date to MM/DD/YYYY
const formatDate = (dateString: string): string => {
  const date = new Date(dateString)
  const month = (date.getMonth() + 1).toString().padStart(2, '0') // Months are 0-indexed
  const day = date.getDate().toString().padStart(2, '0')
  const year = date.getFullYear()

  return `${month}/${day}/${year}`
}

// Helper function to capitalize the first letter of each word in the subject
const capitalizeFirstLetter = (str: string): string => {
  return str.replace(/([A-Z])/g, ' $1').replace(/^./, str[0].toUpperCase())
}

const Records = ({ data }: Props) => {
  const [selected, setSelected] = React.useState<readonly string[]>([])
  const [chartData, setChartData] = React.useState<TransformedDataItem[]>()

  useEffect(() => {
    setChartData(transformData(data.slice(0, 2)))
  }, [])

  const handleDisplayDataOnClick = (numSelected: number) => {
    if (numSelected > 3) {
      toast.warn('You can display a maximum of 3 questionnaire data.')
    } else {
      const selectedData = transformData(data.filter(e => selected.includes(e.submissionId)))
      setChartData(selectedData)
    }
  }

  return (
    <>
      <Typography variant='h2' gutterBottom sx={{ ml: 2, mb: 3 }}>
        My Records
      </Typography>
      <Box component='div' sx={{ mb: 6 }}>
        <TrendCharts data={chartData} />
      </Box>
      <RecordListTable
        data={data}
        selected={selected}
        setSelected={setSelected}
        handleDisplayDataOnClick={handleDisplayDataOnClick}
      />
    </>
  )
}

export default Records
