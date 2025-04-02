'use server'

import { prisma } from '@/prisma/client'

interface ResponseData {
  userId: string
  questionId: number
  score: number
  label: string
  domain: string
  submissionId: string
}

export async function submitResponses(responses: ResponseData[]) {
  try {
    await prisma.response.createMany({
      data: responses,
      skipDuplicates: true
    })
  } catch (error) {
    console.error('Error submitting responses:', error)
    throw new Error('Failed to submit responses')
  }
}
