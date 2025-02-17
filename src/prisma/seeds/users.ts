import { prisma } from '../client'
import { Role } from '@prisma/client'
import { time } from 'console'
import { v4 as uuidv4 } from 'uuid'

const patient1SubmissionUuid1 = uuidv4()
const responseValues = [0, 25, 50, 75, 100]

const getRandomResponseValue = () => {
  const randomIndex = Math.floor(Math.random() * responseValues.length)
  return responseValues[randomIndex]
}

async function createQuestionResponses(patientId: string, submissionId: string = uuidv4()) {
  const questions = await prisma.question.findMany({
    select: {
      id: true
    }
  })

  const responsesData = questions.map(question => {
    return {
      userId: patientId,
      questionId: question.id,
      submissionId: submissionId,
      score: getRandomResponseValue(),
      label: ''
    }
  })

  const createdResponses = await prisma.response.createMany({
    data: responsesData
  })

  console.log(`Created ${createdResponses.count} responses for patient1 - submissionId: ${submissionId}.`)
}

export async function initialiseUsersAndResponses() {
  const patient1 = await prisma.user.create({
    data: {
      email: 'patient1@mail.com',
      hashedPassword: '',
      firstName: 'patient1',
      lastName: 'patient1',
      agreedForResearch: true,
      dateOfBirth: new Date('1997-01-05'),
      role: Role.PATIENT
    }
  })

  const clinician1 = await prisma.user.create({
    data: {
      email: 'clinician1@mail.com',
      hashedPassword: '',
      firstName: 'clinician1',
      lastName: 'clinician1',
      profession: 'General Practitioner',
      registrationNumber: 'PH123456',
      institution: 'UCLH',
      role: Role.CLINICIAN
    }
  })

  const researcher1 = await prisma.user.create({
    data: {
      email: 'researcher1@mail.com',
      hashedPassword: '',
      firstName: 'researcher1',
      lastName: 'researcher1',
      institution: 'UCL',
      role: Role.RESEARCHER
    }
  })

  const patientInfo1 = await prisma.patientInfo.create({
    data: {
      userId: patient1.id,
      submissionId: patient1SubmissionUuid1,
      age: 21,
      sex: 'intersex',
      gender: 'Prefer not to say',
      isSexMatchingGender: false,
      ethnicity: 'Asian/Asian British',
      residenceCountry: 'United Kingdom',
      education: 'college or university',
      activityLevel: 'not very active',
      weeklyExerciseMinutes: 30,
      diagnosis: 'Hypermobility Spectrum Disorder',
      diagnosedBy: 'General Practitioner'
    }
  })

  console.log(patient1, clinician1, researcher1, patientInfo1)
  await createQuestionResponses(patient1.id, patient1SubmissionUuid1)
  await createQuestionResponses(patient1.id)
  await createQuestionResponses(patient1.id)
  await createQuestionResponses(patient1.id)
}
