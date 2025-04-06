'use client'

import { useSearchParams } from 'next/navigation'

import Result from '@/views/Result'

const Page = () => {
  // Get the answers from the URL
  const searchParams = useSearchParams()
  const answers = searchParams.get('data')

  // Decode and parse the answers
  const parsedAnswers = answers ? JSON.parse(decodeURIComponent(answers)) : null

  // Calculate averages for each domain
  console.log('Parsed Data:', parsedAnswers)

  for (const x in parsedAnswers) {
    console.log(x, Object.values(parsedAnswers[x]))
  }

  return <Result />
}

export default Page
