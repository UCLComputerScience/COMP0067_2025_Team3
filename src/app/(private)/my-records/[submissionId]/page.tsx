'use client'

// MUI
import { notFound } from 'next/navigation'

// Prisma
import { capitalize } from 'lodash'
import { prisma } from '@/prisma/client'

import SingleRecord from '@/views/SingleRecord'

interface PageProps {
  params: Promise<{
    submissionId: string
  }>
}

const getRecords = async (submissionId: string) => {
  const records = await prisma.response.findMany({
    where: { submissionId },
    select: {
      score: true,
      domain: true,
      createdAt: true,
      label: true
    }
  })

  return records
}

// From perceived-spidergram branch
const getPerceivedSpidergramValues = (records: { score: number; domain: string; label: string }[]) => {
  const perceivedSpidergramRecords = records.filter(record => record.domain === 'Perceived Spidergram')

  return perceivedSpidergramRecords.map(record => ({
    subject: record.label,
    value: record.score
  }))
}

// From main branch
const getPatientFullName = async (submissionId: string) => {
  const names = await prisma.response.findFirst({
    where: {
      submissionId
    },
    select: {
      user: {
        select: {
          firstName: true,
          lastName: true
        }
      }
    }
  })

  if (!names) {
    return ''
  }

  return `${capitalize(names.user.firstName)} ${capitalize(names.user.lastName)}`
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
    averageScore: Number((total / count).toFixed(2))
  }))
}

const Page = async ({ params }: PageProps) => {
  const { submissionId } = await params

  const records = await getRecords(submissionId)
  if (!records || records.length === 0) {
    notFound()
  }

  const patientName = await getPatientFullName(submissionId)
  const perceivedSpidergramValues = getPerceivedSpidergramValues(records)
  const scores = calculateScores(records)
  const submissionDate = records[0].createdAt

  const formattedDate = new Date(submissionDate).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  })

  return (
    <SingleRecord
      data={scores}
      date={formattedDate}
      patientName={patientName}
      perceivedSpidergramData={perceivedSpidergramValues}
    />
  )
}

export default Page

