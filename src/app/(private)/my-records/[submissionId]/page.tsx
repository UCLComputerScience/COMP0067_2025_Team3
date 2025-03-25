// MUI
import { notFound } from 'next/navigation'

// Prisma
import { prisma } from '@/prisma/client'

import Record from '@/views/SingleRecord'

interface PageProps {
  params: {
    submissionId: string
  }
}

const getRecords = async (submissionId: string) => {   
  const records = await prisma.response.findMany({
    where: { submissionId },
    select: {
      score: true,
      domain: true,
      createdAt: true
    }
  })

  return records
}

const calculateScores = (records: { score: number; domain: string }[]) => {
  const domainScores: Record<string, { total: number; count: number }> = {}

  records.forEach(({ score, domain }) => {
    if (!domainScores[domain]) {
      domainScores[domain] = { total: 0, count: 0 }
    }

    domainScores[domain].total += score
    domainScores[domain].count += 1
  })

  return Object.entries(domainScores).map(([domain, { total, count }]) => ({
    domain,
    totalScore: total,
    averageScore: total / count
  }))
}

const Page = async ({ params }: PageProps) => {
  const { submissionId } = params
  const records = await getRecords(submissionId)

  if (!records || records.length === 0) {
    notFound()
  }

  const scores = calculateScores(records)
  const submissionDate = records[0].createdAt

  const formattedDate = new Date(submissionDate).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  });

  // Pass user data to the client component
  return <Record data={scores} date={formattedDate} />
}

export default Page
