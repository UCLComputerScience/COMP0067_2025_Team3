'use server'

import { prisma } from '@/prisma/client'

export async function savePatientInfo(data: {
  userId: string
  submissionId: string
  age: number
  sex: string
  gender: string
  isSexMatchingGender: boolean
  ethnicity: string
  residenceCountry: string
  employment: string
  education: string
  activityLevel: string
  weeklyExerciseMinutes: number
  diagnosis: string
  diagnosedBy: string
  medications: string
  otherConditions: string
}) {
  const { userId, ...rest } = data

  try {
    const existing = await prisma.patientInfo.findFirst({
      where: { userId }
    })

    if (existing) {
      await prisma.patientInfo.update({
        where: { id: existing.id },
        data: rest
      })
    } else {
      await prisma.patientInfo.create({
        data: {
          userId,
          ...rest
        }
      })
    }

    return { success: true }
  } catch (err) {
    console.error('Failed to save patient info:', err)

    return { success: false, error: 'Database error' }
  }
}
