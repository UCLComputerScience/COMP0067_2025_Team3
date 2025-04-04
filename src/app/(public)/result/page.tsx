'use client'

import { useSearchParams } from 'next/navigation'

import Result from '@/views/Result'

const Page = () => {
  const searchParams = useSearchParams()
  const answers = searchParams.get('data')

  console.log('Search Params:', searchParams.toString())
  console.log('Raw Answers:', answers)
  const parsedAnswers = answers ? JSON.parse(decodeURIComponent(answers)) : null

  console.log('Parsed Data:', parsedAnswers)

  return <Result />
}

export default Page
