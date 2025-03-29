'use server'

import { prisma } from '@/prisma/client'

export async function fetchQuestionsByDomain(domain: string) {
  const questions = await prisma.question.findMany({
    where: {
      domain: domain
    },
    select: {
      id: true,
      domain: true,
      question: true,
      note: true
    }
  })

  return questions
}
