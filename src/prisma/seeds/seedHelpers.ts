import { ApplicationStatus, Role } from '@prisma/client'
import { faker } from '@faker-js/faker'

import {
  ACTIVITY_LEVEL_OPTIONS,
  DIAGNOSIS_OPTIONS,
  EDUCATION_LEVEL_OPTIONS,
  ETHNICITY_OPTIONS,
  GENDER_OPTIONS,
  SEX_OPTIONS,
  SPECIALIST_OPTIONS
} from '@/constants'

/*
  single helper functions
*/

const responseValues = [0, 25, 50, 75, 100]

export const generateRandomAge = (min: number = 13, max: number = 65): number => {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

export const generateRandomOptions = (options: readonly string[]): string => {
  const randomIndex = Math.floor(Math.random() * options.length)

  
return options[randomIndex]
}

/*
  Basic User Information
*/

// patients
// for patient account
export const generateRandomPatientInformation = (count: number) => {
  return Array.from({ length: count }).map(() => ({
    email: faker.internet.email(),
    hashedPassword: faker.internet.password(),
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    dateOfBirth: faker.date.birthdate({ mode: 'age', min: 18, max: 65 }),
    role: Role.PATIENT,
    agreedForResearch: faker.datatype.boolean(),
    hospitalNumber: faker.vehicle.vrm()
  }))
}

// for the questionnaire
export const generateRandomPatientInfo = (submissionId: string) => {
  const sex = generateRandomOptions(SEX_OPTIONS)
  const gender = generateRandomOptions(GENDER_OPTIONS)
  const isSexMatchingGender = sex === gender

  return {
    submissionId,
    age: generateRandomAge(),
    sex,
    gender,
    isSexMatchingGender,
    ethnicity: generateRandomOptions(ETHNICITY_OPTIONS),
    residenceCountry: faker.location.country(),
    education: generateRandomOptions(EDUCATION_LEVEL_OPTIONS),
    activityLevel: generateRandomOptions(ACTIVITY_LEVEL_OPTIONS),
    weeklyExerciseMinutes: 30,
    diagnosis: generateRandomOptions(DIAGNOSIS_OPTIONS),
    diagnosedBy: generateRandomOptions(SPECIALIST_OPTIONS),
    medications: faker.lorem.sentence(),
    otherMedications: faker.lorem.sentence()
  }
}

// Clinicians
export const generateRandomClincianInformation = (count: number) => {
  return Array.from({ length: count }).map(() => ({
    email: faker.internet.email(),
    hashedPassword: '',
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    phoneNumber: faker.phone.number(),
    address: faker.location.streetAddress(),
    role: Role.CLINICIAN,
    profession: generateRandomOptions(SPECIALIST_OPTIONS),
    registrationNumber: faker.vehicle.vrm(),
    institution: 'UCLH'
  }))
}

// Researcher
export const generateRandomResearcherInformation = (count: number) => {
  return Array.from({ length: count }).map(() => ({
    email: faker.internet.email(),
    hashedPassword: '',
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    phoneNumber: faker.phone.number(),
    address: faker.location.streetAddress(),
    role: Role.RESEARCHER,
    institution: 'UCLH'
  }))
}

// Application
export const generateRandomApplicationInformation = (userId: string) => {
  const randomNumber = Math.floor(Math.random() * 1000) + 1

  const statuses = Object.values(ApplicationStatus)
  const randomStatus = statuses[Math.floor(Math.random() * statuses.length)]

  
return {
    userId,
    title: `Random Research Title ${randomNumber}`,
    question: faker.lorem.sentence(),
    institution: 'UCLH',
    expectedStartDate: faker.date.future(),
    expectedEndDate: faker.date.future(),
    summary: faker.lorem.paragraph(3),
    status: randomStatus
  }
}

/* 
  Patient Responses 
*/
export const getRandomResponseValue = () => {
  const randomIndex = Math.floor(Math.random() * responseValues.length)

  
return responseValues[randomIndex]
}

// Function to generate a random date within the last 30 days
export function getRandomDateWithinDays(days: number = 30): Date {
  const now = new Date()
  const pastDate = new Date(now.getTime() - days * 24 * 60 * 60 * 1000) // Days in the past

  
return new Date(pastDate.getTime() + Math.random() * (now.getTime() - pastDate.getTime()))
}
