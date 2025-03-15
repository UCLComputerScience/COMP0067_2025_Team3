'use client'

import React, { useEffect } from 'react'

import { Box } from '@mui/material'

import { toast } from 'react-toastify'

import type { Data } from '@/app/(private)/my-records/page'
import TrendCharts from '@/components/charts/TrendCharts'
import RecordListTable from '@/components/record-list-table'
import { formatDate } from '@/utils/dateUtils'

interface Props {
  data: Data[]
}

type DataItem = {
  submissionId: string
  date: string | Date
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

//TODO: sorted by date in asc order for better trend graph display.
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

  // Group submissions by formatted date
  const groupedByDate: Record<string, DataItem[]> = {}

  data.forEach(item => {
    const formattedDate = formatDate(item.date)

    if (!groupedByDate[formattedDate]) {
      groupedByDate[formattedDate] = []
    }

    groupedByDate[formattedDate].push(item)
  })

  const result: TransformedDataItem[] = subjects.map(subject => {
    const transformed: TransformedDataItem = { subject: capitalizeFirstLetter(subject) }

    Object.keys(groupedByDate).forEach(formattedDate => {
      const submissions = groupedByDate[formattedDate]

      submissions.forEach((item, index) => {
        // Unique key if there are multiple submissions on the same date
        const uniqueKey = submissions.length > 1 ? `${formattedDate} - ${index + 1}` : formattedDate

        transformed[uniqueKey] = item[subject]
      })
    })

    return transformed
  })

  return result
}

// Helper function to capitalize the first letter of each word in the subject, so work for
const capitalizeFirstLetter = (str: string): string => {
  return str.replace(/([A-Z])/g, ' $1').replace(/^./, str[0].toUpperCase())
}

const Records = ({ data }: Props) => {
  const [selected, setSelected] = React.useState<readonly string[]>([])
  const [chartData, setChartData] = React.useState<TransformedDataItem[]>()

  useEffect(() => {
    if (data) {
      setChartData(transformData(data.slice(0, 2)))
    }
  }, [data])

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
