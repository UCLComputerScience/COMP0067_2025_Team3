import { Role } from '@prisma/client'
import { v4 as uuidv4 } from 'uuid'

import bcrypt from 'bcryptjs'

import { prisma } from '../client'
import {
  generateRandomApplicationInformation,
  generateRandomClincianInformation,
  generateRandomPatientInfo,
  generateRandomPatientInformation,
  generateRandomResearcherInformation
} from './seedHelpers'

const patient1SubmissionUuid1 = uuidv4()
const responseValues = [0, 25, 50, 75, 100]

const getRandomResponseValue = () => {
  const randomIndex = Math.floor(Math.random() * responseValues.length)

  return responseValues[randomIndex]
}

// Function to generate a random date within the last 30 days
function getRandomDateWithinDays(days: number = 30): Date {
  const now = new Date()
  const pastDate = new Date(now.getTime() - days * 24 * 60 * 60 * 1000) // Days in the past

  return new Date(pastDate.getTime() + Math.random() * (now.getTime() - pastDate.getTime()))
}

async function createQuestionResponses(
  patientId: string,
  submissionId: string = uuidv4(),
  timestamp: Date = getRandomDateWithinDays() // Generate random date
) {
  const questions = await prisma.question.findMany({
    select: { id: true, domain: true }
  })

  const responsesData = questions.map(question => ({
    userId: patientId,
    questionId: question.id,
    submissionId,
    score: getRandomResponseValue(),
    label: '',
    domain: question.domain,
    createdAt: timestamp // Assigning random timestamp
  }))

  const createdResponses = await prisma.response.createMany({
    data: responsesData
  })

  console.log(
    `Created ${createdResponses.count} responses for patient ${patientId} - submissionId: ${submissionId} at ${timestamp}.`
  )
}

async function generateMultiplePatientsWithResponses(num_patient = 2) {
  const hashedPassword = await bcrypt.hash('1234567', 10)

  for (let i = 0; i < num_patient; i++) {
    const submissionId = uuidv4()
    const patientBasicInfo = generateRandomPatientInformation(1)[0]
    const patientDemoData = generateRandomPatientInfo(submissionId)

    const patient = await prisma.user.create({
      data: {
        ...patientBasicInfo,
        hashedPassword: hashedPassword
      }
    })

    const patientDemo = await prisma.patientInfo.create({
      data: {
        ...patientDemoData,
        userId: patient.id
      }
    })

    await createQuestionResponses(patient.id, submissionId)
    await createQuestionResponses(patient.id)
    await createQuestionResponses(patient.id)
    await createQuestionResponses(patient.id)

    console.log(patient, patientDemo)
  }
}

async function generateMultipleClinicians(num_clinciian = 2) {
  const hashedPassword = await bcrypt.hash('1234567', 10)

  for (let i = 0; i < num_clinciian; i++) {
    const clinicianData = generateRandomClincianInformation(1)[0]

    const clinician = await prisma.user.create({
      data: {
        ...clinicianData,
        hashedPassword: hashedPassword
      }
    })

    console.log(clinician)
  }
}

async function generateMultipleResearcher(num_researcher = 2) {
  const hashedPassword = await bcrypt.hash('1234567', 10)

  for (let i = 0; i < num_researcher; i++) {
    const researcherData = generateRandomResearcherInformation(1)[0]

    const researcher = await prisma.user.create({
      data: {
        ...researcherData,
        hashedPassword: hashedPassword
      }
    })

    const randomValue = Math.random()
    const hasApplication = randomValue > 0.5

    if (hasApplication) {
      const applicationData = generateRandomApplicationInformation(researcher.id)

      const application = await prisma.application.create({
        data: {
          ...applicationData
        }
      })

      console.log('generated application:', application)
    }

    console.log(researcher)
  }
}

export async function initialiseAdmin() {
  const hashedPassword = await bcrypt.hash('1234567', 10)

  await prisma.user.create({
    data: {
      email: 'admin1@mail.com',
      hashedPassword: hashedPassword,
      firstName: 'admin1',
      lastName: 'admin1',
      role: Role.ADMIN
    }
  })
}

export async function initialiseUsersAndResponses() {
  const hashedPassword = await bcrypt.hash('1234567', 10)

  const patient1 = await prisma.user.create({
    data: {
      email: 'patient1@mail.com',
      hashedPassword: hashedPassword,
      firstName: 'patient1',
      lastName: 'patient1',
      agreedForResearch: true,
      dateOfBirth: new Date('1997-01-05'),
      role: Role.PATIENT
    }
  })

  const patientInfo1Data = generateRandomPatientInfo(patient1SubmissionUuid1)

  const patientInfo1 = await prisma.patientInfo.create({
    data: {
      ...patientInfo1Data,
      userId: patient1.id
    }
  })

  const clinician1 = await prisma.user.create({
    data: {
      email: 'clinician1@mail.com',
      hashedPassword: hashedPassword,
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
      hashedPassword: hashedPassword,
      firstName: 'researcher1',
      lastName: 'researcher1',
      institution: 'UCL',
      role: Role.RESEARCHER
    }
  })

  const admin1 = await prisma.user.create({
    data: {
      email: 'admin1@mail.com',
      hashedPassword: hashedPassword,
      firstName: 'admin1',
      lastName: 'admin1',
      role: Role.ADMIN
    }
  })

  console.log(patient1, clinician1, researcher1, patientInfo1, admin1)
  await createQuestionResponses(patient1.id, patient1SubmissionUuid1)
  await createQuestionResponses(patient1.id)
  await createQuestionResponses(patient1.id)
  await createQuestionResponses(patient1.id)

  // generate more patient data
  await generateMultiplePatientsWithResponses(5)
  await generateMultipleClinicians(5)
  await generateMultipleResearcher(5)
}
