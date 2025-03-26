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
      data: responses
    })

    return { success: true }
  } catch (error) {
    console.error(' Failed to save responses:', error)

    return { success: false, error: 'Database error' }
  }
}
