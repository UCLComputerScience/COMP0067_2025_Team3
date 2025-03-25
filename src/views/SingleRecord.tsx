'use client'

import Result from '@/components/Result'

interface RecordProps {
  data: { domain: string; totalScore: number; averageScore: number }[]
  date: string
}

const Record = ({ data, date }: RecordProps) => {
  // Convert to the expected format
  const formattedData = data.map(({ domain, averageScore }) => ({
    subject: domain,
    [date]: averageScore
  }))

  return <Result data={formattedData} domainData={data} date={date} />
}

export default Record
