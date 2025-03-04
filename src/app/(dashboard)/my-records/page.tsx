import { prisma } from '@/prisma/client'
import { groupBy } from 'lodash'

// Component
import Records from '@/views/Records'

// Auth
import { getServerSession } from 'next-auth'
import { authOptions } from '@/libs/auth'

export interface Data {
  submissionId: string
  date: string
  neuromusculoskeletal: number
  pain: number
  fatigue: number
  gastrointestinal: number
  cardiacDysautonomia: number
  urogenital: number
  anxiety: number
  depression: number
}

const flattenSubmissionData = (
  data: Record<string, { createdAt: string; domains: Record<string, { averageScore: number }> }>
): Data[] => {
  return Object.entries(data).map(([submissionId, submissionData]) => {
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
}

const getResponseDataByUser = async (userId: string) => {
  const responses = await prisma.response.findMany({
    where: { userId },
    select: {
      id: true,
      createdAt: true,
      userId: true,
      score: true,
      label: true,
      submissionId: true,
      question: {
        select: { domain: true }
      }
    },
    orderBy: {
      createdAt: 'desc'
    }
  })

  const groupedBySubmission = groupBy(responses, response => response.submissionId)

  const result: Record<string, { createdAt: string; domains: Record<string, { averageScore: number }> }> = {}

  for (const [submissionId, responsesInSubmission] of Object.entries(groupedBySubmission)) {
    const createdAt = responsesInSubmission[0]?.createdAt.toISOString()

    const groupedByDomain = groupBy(responsesInSubmission, response => response.question.domain)

    const domainScores: Record<string, { averageScore: number }> = {}

    for (const [domain, responsesInDomain] of Object.entries(groupedByDomain)) {
      const averageScore =
        responsesInDomain.reduce((sum, response) => sum + response.score, 0) / responsesInDomain.length

      domainScores[domain] = { averageScore }
    }

    result[submissionId] = {
      createdAt,
      domains: domainScores
    }
  }

  return flattenSubmissionData(result)
}

const Page = async () => {
  const session = await getServerSession(authOptions)

  // debug, and secure the end point and remove this later.
  console.log(session)
  if (!session?.user?.id) {
    return <p>Unauthorized</p>
  }
  const data = await getResponseDataByUser(session.user.id)

  return <Records data={data} />
}

export default Page
