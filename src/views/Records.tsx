'use client'

import React, { useEffect } from 'react'

import { Box } from '@mui/material'

import { toast } from 'react-toastify'

import type { Data } from '@/types/RecordTypes'
import TrendCharts from '@/components/charts/TrendCharts'
import RecordListTable from '@/components/record-list-table'
import { formatDate } from '@/utils/dateUtils'

interface Props {
  data: Data[]
  isShowRecordList?: boolean
  isTrendChartVertical?: boolean
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
        const uniqueKey = submissions.length > 1 ? `${formattedDate} - ${index + 1}` : formattedDate

        transformed[uniqueKey] = item[subject]
      })
    })

    return transformed
  })

  return result
}

const capitalizeFirstLetter = (str: string): string => {
  return str.replace(/([A-Z])/g, ' $1').replace(/^./, str[0].toUpperCase())
}

const Records = ({ data, isShowRecordList = true, isTrendChartVertical = false }: Props) => {
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
    } else if (numSelected === 0) {
      toast.warn('Please select at least one questionnaire to display.')
    } else {
      const selectedData = transformData(data.filter(e => selected.includes(e.submissionId)))

      setChartData(selectedData)
    }
  }

  return (
    <>
      <Box component='div' sx={{ mb: 4 }}>
        <TrendCharts data={chartData} isVertical={isTrendChartVertical} />
      </Box>
      {isShowRecordList && (
        <RecordListTable
          data={data}
          selected={selected}
          setSelected={setSelected}
          handleDisplayDataOnClick={handleDisplayDataOnClick}
        />
      )}
    </>
  )
}

export default Records
