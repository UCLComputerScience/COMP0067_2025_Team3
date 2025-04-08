'use client'

import { useSearchParams } from 'next/navigation'

import Result from '@/components/Result'

interface ParsedAnswer {
  domain: string
  averageScore?: number
  totalScore?: number
  scores?: { [key: string]: number }
}

const todayDate = new Date().toLocaleDateString('en-GB', {
  day: '2-digit',
  month: '2-digit',
  year: 'numeric'
})

// Functions to get the correct data to pass to the Result component
function getData(data: ParsedAnswer[]) {
  return data
    .filter(entry => entry.domain !== 'Spidergram')
    .map(entry => ({
      subject: entry.domain,
      [todayDate]: entry.averageScore ?? 0
    }))
}

function getDomainData(data: ParsedAnswer[]) {
  return data
    .filter(entry => entry.domain !== 'Spidergram')
    .map(entry => ({
      domain: entry.domain,
      totalScore: entry.totalScore ?? 0,
      averageScore: entry.averageScore ?? 0
    }))
}

function getPerceivedSpidergramData(data: ParsedAnswer[]) {
  const spidergramData = data.find(entry => entry.domain === 'Spidergram')

  if (!spidergramData || !Array.isArray(spidergramData.scores)) return []

  return spidergramData?.scores
}

const Page = () => {
  // Get the answers from the URL
  const searchParams = useSearchParams()
  const answers = searchParams.get('data')

  // Decode and parse the answers
  const parsedAnswers = answers ? JSON.parse(decodeURIComponent(answers)) : null

  console.log('Parsed Answers:', parsedAnswers)

  // Now change the parsed answer into the correct format for the SingleRecord component

  /*
  console.log('Parsed Data:', parsedAnswers)
  console.log(getData(parsedAnswers))
  console.log(getDomainData(parsedAnswers))
  console.log(getPerceivedSpidergramData(parsedAnswers))*/

  return (
    <Result
      data={getData(parsedAnswers)}
      domainData={getDomainData(parsedAnswers)}
      perceivedSpidergramData={getPerceivedSpidergramData(parsedAnswers)}
      date={new Date().toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'long',
        year: 'numeric'
      })}
      patientName={'Guest'}
    />
  )
}

export default Page
