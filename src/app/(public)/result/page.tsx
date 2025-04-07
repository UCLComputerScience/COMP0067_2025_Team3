'use client'

import { useSearchParams } from 'next/navigation'

import Result from '@/components/Result'

// Functions to get the correct data to pass to the SingleRecord
function getData(data: any) {
  return data
    .filter(entry => entry.domain !== 'Spidergram')
    .map(entry => ({
      subject: entry.domain,
      value: entry.averageScore
    }))
}

function getDomainData(data) {
  return data
    .filter(entry => entry.domain !== 'Spidergram')
    .map(entry => ({
      domain: entry.domain,
      totalScore: entry.totalScore,
      averageScore: entry.averageScore
    }))
}

function getPerceivedSpidergramData(data) {
  const spidergramData = data.find(entry => entry.domain === 'Spidergram')

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
