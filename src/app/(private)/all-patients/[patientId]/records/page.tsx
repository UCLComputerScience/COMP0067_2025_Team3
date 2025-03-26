
import { redirect } from 'next/navigation'

import { getServerSession } from 'next-auth'

import { Role } from '@prisma/client'

import { authOptions } from '@/libs/auth'

import { prisma } from '@/prisma/client'

import Records from '@/views/Records'

type PageProps = {
    params: {
      patientId: string
    }
  }

const getResponseDataByUser = async (userId: string) => {
  const responses = await prisma.response.groupBy({
    by: ['domain', 'submissionId'],
    where: { userId },
    _avg: { score: true },
    _min: { createdAt: true }
  })

  const groupedResults: Record<string, any> = {}

  responses.forEach((res) => {
    const { submissionId, domain, _avg, _min } = res

    if (!groupedResults[submissionId]) {
      groupedResults[submissionId] = {
        createdAt: _min.createdAt!,
        domains: {}
      }
    }

    groupedResults[submissionId].domains[domain] = {
      averageScore: _avg.score!
    }
  })

  return Object.entries(groupedResults)
    .map(([submissionId, submission]) => ({
      submissionId,
      date: submission.createdAt,
      neuromusculoskeletal: submission.domains['Neuromusculoskeletal']?.averageScore,
      pain: submission.domains['Pain']?.averageScore,
      fatigue: submission.domains['Fatigue']?.averageScore,
      gastrointestinal: submission.domains['Gastrointestinal']?.averageScore,
      cardiacDysautonomia: submission.domains['Cardiac Dysautonomia']?.averageScore,
      urogenital: submission.domains['Urogenital']?.averageScore,
      anxiety: submission.domains['Anxiety']?.averageScore,
      depression: submission.domains['Depression']?.averageScore
    }))
    .sort((a, b) => b.date.getTime() - a.date.getTime())
}

const Page = async ({ params }: PageProps) => {
  const session = await getServerSession(authOptions)

  if (!session?.user || session.user.role !== Role.CLINICIAN) {
    redirect('/not-found')
  }
  
  const data = await getResponseDataByUser(params.patientId)

  return <Records data={data} />
}

export default Page
