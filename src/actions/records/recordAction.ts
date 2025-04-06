'use server'

import { notFound } from 'next/navigation'

import { capitalize } from 'lodash'

import { prisma } from '@/prisma/client'
import type { Data, SubmissionResult } from '@/types/RecordTypes'

export const getResponseDataByUser = async (userId: string): Promise<Data[]> => {
  const responses = await prisma.response.groupBy({
    by: ['domain', 'submissionId'],
    where: {
      userId
    },
    _avg: {
      score: true
    },
    _min: {
      createdAt: true
    }
  })

  const groupedResults: Record<string, SubmissionResult> = {}

  responses.forEach(result => {
    if (!groupedResults[result.submissionId]) {
      groupedResults[result.submissionId] = {
        createdAt: result._min.createdAt!,
        domains: {}
      }
    }

    groupedResults[result.submissionId].domains[result.domain] = {
      averageScore: Number(result._avg.score!.toFixed(2))
    }
  })

  const formattedData: Data[] = Object.entries(groupedResults).map(([submissionId, submissionData]) => {
    const { createdAt, domains } = submissionData

    return {
      submissionId,
      date: createdAt,
      neuromusculoskeletal: domains['Neuromusculoskeletal']?.averageScore,
      pain: domains['Pain']?.averageScore,
      fatigue: domains['Fatigue']?.averageScore,
      gastrointestinal: domains['Gastrointestinal']?.averageScore,
      cardiacDysautonomia: domains['Cardiac Dysautonomia']?.averageScore,
      urogenital: domains['Urogenital']?.averageScore,
      anxiety: domains['Anxiety']?.averageScore,
      depression: domains['Depression']?.averageScore
    }
  })

  return formattedData.sort((a, b) => b.date.getTime() - a.date.getTime())
}

export async function getSingleRecordProps(submissionId: string) {
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

  return {
    scores,
    formattedDate,
    patientName,
    perceivedSpidergramValues
  }
}

async function getRecords(submissionId: string) {
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

function calculateScores(records: { score: number; domain: string }[]) {
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

function getPerceivedSpidergramValues(records: { score: number; domain: string; label: string }[]) {
  const perceivedSpidergramRecords = records.filter(record => record.domain === 'Perceived Spidergram')

  return perceivedSpidergramRecords.map(record => ({
    subject: record.label,
    value: record.score
  }))
}

async function getPatientFullName(submissionId: string) {
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
