import { object, string, minLength, email, pipe, nonEmpty, regex, optional } from 'valibot'

// User Profile Validation
export const userProfileSchema = object({
  firstName: pipe(string(), minLength(2, 'First name must be at least 2 characters long')),
  lastName: pipe(string(), minLength(2, 'Last name must be at least 2 characters long')),
  email: pipe(string(), nonEmpty('Please enter your email.'), email('Invalid email address'))
})

// Password Change Validation
export const passwordSchema = object({
  currentPassword: pipe(string(), nonEmpty('Please enter your current password.')),
  newPassword: pipe(
    string(),
    nonEmpty('Please enter your new password.'),
    minLength(8, 'New password must be at least 8 characters long'),
    regex(/[a-z]/, 'Must contain at least one lowercase letter'),
    regex(/[A-Z]/, 'Must contain at least one uppercase letter'),
    regex(/[0-9!@#$%^&*]/, 'Must contain at least one number or symbol')
  ),
  confirmPassword: pipe(string(), nonEmpty('Please confirm your new password.'))
})

// Patient Info Validation
export const InfoSchema = object({
  age: pipe(string('Your age must be a number')),
  sex_at_birth: pipe(string(), nonEmpty('Please Select')),
  gender: pipe(string(), nonEmpty('Please Select')),
  gender_same_as_sex: pipe(string(), nonEmpty('Please Select')),
  ethnicity: pipe(string(), nonEmpty('Please Select')),
  country: pipe(string(), nonEmpty('Please Select Country')),
  employment_status: pipe(string(), nonEmpty('Please Select')),
  education_level: pipe(string(), nonEmpty('Please Select')),
  activity_level: pipe(string(), nonEmpty('Please Select')),
  minutes_of_exercise: pipe(string(), nonEmpty('Please Select')),
  diagnosis_confirmed: pipe(string(), nonEmpty('Please Select if confirmed')),
  healthcare_professional: pipe(string(), nonEmpty('Please Select Healthcare Professional')),
  receiving_treatment: pipe(string(), nonEmpty('Please Select Yes or No')),
  treatment: optional(pipe(string(), nonEmpty('Please Input Treatment'))), // Optional in case user is not receiving treatment
  taking_medications: pipe(string(), nonEmpty('Please Select Yes or No')),
  medications: optional(pipe(string())), // Optional if user is not taking medications
  other_conditions: optional(pipe(string(), nonEmpty('Please Enter If you have other conditions'))) // Optional field
})

export const QuestionnaireSchema = object({})
