'use server'

import { prisma } from '@/prisma/client'
import { capitalize } from 'lodash'

export async function getPatientFullNameByPatientId(patientId: string) {
  const name = await prisma.user.findUnique({
    where: {
      id: patientId
    },
    select: {
      firstName: true,
      lastName: true
    }
  })

  if (!name) {
    return ''
  }

  return `${capitalize(name.firstName)} ${capitalize(name.lastName)}`
}

export async function getRecordDateBySubmissionId(submissionId: string) {
  try {
    const date = await prisma.response.findFirst({
      where: {
        submissionId: submissionId
      },
      select: {
        createdAt: true
      }
    })

    if (!date) {
      return ''
    }

    const formattedDate = new Date(date.createdAt).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    })

    return formattedDate
  } catch (error) {
    console.error(error)
  }
}
