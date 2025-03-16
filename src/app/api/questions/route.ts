import { NextResponse } from 'next/server'

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET() {
  const questions = await prisma.question.findMany({
    select: {
      id: true,
      domain: true,
      question: true,
      note: true
    }
  })

  return NextResponse.json(questions)
}
