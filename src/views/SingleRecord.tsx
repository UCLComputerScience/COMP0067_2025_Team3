'use client'

import Result from '@/components/Result'

interface RecordProps {
  data: { domain: string; totalScore: number; averageScore: number }[]
  date: string
  PerceivedSpidergramData: any // Replace 'any' with the correct type if known
}

const Record = ({ data, date, PerceivedSpidergramData }: RecordProps) => {
  // Convert to the expected format
  const formattedData = data.map(({ domain, averageScore }) => ({
    subject: domain,
    [date]: averageScore
  }))

  return <Result data={formattedData} domainData={data} date={date} perceivedSpidergramData={PerceivedSpidergramData} />
}

export default Record
