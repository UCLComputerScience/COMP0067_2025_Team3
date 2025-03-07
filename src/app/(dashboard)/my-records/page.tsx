import { prisma } from '@/prisma/client'
import { groupBy } from 'lodash'

// Component
import Records from '@/views/Records'

// Auth
import { getServerSession } from 'next-auth'
import { authOptions } from '@/libs/auth'

export interface Data {
  submissionId: string
  date: Date
  neuromusculoskeletal: number
  pain: number
  fatigue: number
  gastrointestinal: number
  cardiacDysautonomia: number
  urogenital: number
  anxiety: number
  depression: number
}

interface DomainScore {
  averageScore: number
}

interface SubmissionResult {
  createdAt: Date
  domains: Record<string, DomainScore>
}

const getResponseDataByUser = async (userId: string) => {
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
      averageScore: result._avg.score!
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

const Page = async () => {
  const session = await getServerSession(authOptions)

  // debug, and secure the end point and remove this later.
  console.log('session:', session)
  if (!session?.user?.id) {
    return <p>Unauthorized</p>
  }
  const data = await getResponseDataByUser(session.user.id)

  return <Records data={data} />
}

export default Page
