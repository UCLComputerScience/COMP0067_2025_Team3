import { safeParse } from 'valibot'

import { describe, it, expect } from '@jest/globals'

import { InfoSchema } from '@/actions/formValidation'

describe('InfoSchema Validation', () => {
  it('Check for validating correct data', () => {
    const data = {
      age: '25',
      sex_at_birth: 'Woman',
      gender: 'Female',
      gender_same_as_sex: true,
      ethnicity: 'White English',
      country: 'United Kingdom',
      employment_status: 'In education',
      education_level: 'Undergraduate degree',
      activity_level: 'Very active',
      minutes_of_exercise: '60',
      diagnosis_confirmed: 'Yes',
      healthcare_professional: 'Rheumatologist',
      taking_medications: 'Yes',
      medications: 'Medication A, Medication B',
      other_conditions: 'Condition A, Condition B'
    }

    const result = safeParse(InfoSchema, data)

    expect(result.success).toBe(true)
  })

  it('Check for validating incorrect data with missing fields', () => {
    const data = {
      age: 'twenty',
      sex_at_birth: 'Woman',
      gender: 'Female',
      gender_same_as_sex: true,
      ethnicity: '',
      country: 'United Kingdom',
      employment_status: 'In education',
      education_level: 'Undergraduate degree',
      activity_level: 'Very active',
      minutes_of_exercise: '20',
      diagnosis_confirmed: 'Yes',
      healthcare_professional: 'Rheumatologist',
      taking_medications: '',
      medications: 'Medication A, Medication B',
      other_conditions: 'Condition A, Condition B'
    }

    const result = safeParse(InfoSchema, data)

    expect(result.success).toBe(false)
    const messages = result.issues?.map(issue => issue.message)

    expect(messages).toEqual(['Your age must be a number', 'Please Select', 'Please Select Yes or No'])
  })

  it('Check that an empty form cannot be submitted', () => {
    const data = {
      age: '',
      sex_at_birth: '',
      gender: '',
      gender_same_as_sex: true,
      ethnicity: '',
      country: '',
      employment_status: '',
      education_level: '',
      activity_level: '',
      minutes_of_exercise: '',
      diagnosis_confirmed: '',
      healthcare_professional: '',
      taking_medications: '',
      medications: '',
      other_conditions: ''
    }

    const result = safeParse(InfoSchema, data)

    expect(result.success).toBe(false)
  })
})
