import {
  object,
  string,
  minLength,
  email,
  pipe,
  nonEmpty,
  regex,
  optional,
  boolean,
  array,
  number,
  integer
} from 'valibot'

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
  age: pipe(
    string('Your age must be a number'),
    nonEmpty('Please Enter Your Age'),
    regex(/^\d+$/, 'Your age must be a number')
  ),
  sex_at_birth: pipe(string(), nonEmpty('Please Select')),
  gender: pipe(string(), nonEmpty('Please Select')),
  gender_same_as_sex: pipe(boolean()),
  ethnicity: pipe(string(), nonEmpty('Please Select')),
  country: pipe(string(), nonEmpty('Please Select Country')),
  employment_status: pipe(string(), nonEmpty('Please Select')),
  education_level: pipe(string(), nonEmpty('Please Select')),
  activity_level: pipe(string(), nonEmpty('Please Select')),
  minutes_of_exercise: pipe(
    string('You must enter an estimate'),
    nonEmpty('Please enter minutes of exercise'),
    regex(/^\d+$/, 'Your estimation must be a number')
  ),
  diagnosis_confirmed: pipe(string(), nonEmpty('Please Select if confirmed')),
  healthcare_professional: pipe(string(), nonEmpty('Please Select Healthcare Professional')), // Optional in case user is not receiving treatment
  taking_medications: pipe(string(), nonEmpty('Please Select Yes or No')),
  medications: optional(pipe(string())), // Optional if user is not taking medications
  other_conditions: optional(pipe(string())) // Optional field
})

export const NeuromusculoskeletalSchema = object({
  1: pipe(string(), nonEmpty('Please Select')),
  2: pipe(string(), nonEmpty('Please Select')),
  3: pipe(string(), nonEmpty('Please Select')),
  4: pipe(string(), nonEmpty('Please Select')),
  5: pipe(string(), nonEmpty('Please Select'))
})

export const PainSchema = object({
  6: pipe(string(), nonEmpty('Please Select')),
  7: pipe(string(), nonEmpty('Please Select')),
  8: pipe(string(), nonEmpty('Please Select')),
  9: pipe(string(), nonEmpty('Please Select'))
})

export const FatigueSchema = object({
  10: pipe(string(), nonEmpty('Please Select')),
  11: pipe(string(), nonEmpty('Please Select')),
  12: pipe(string(), nonEmpty('Please Select'))
})

export const GastrointestinalSchema = object({
  13: pipe(string(), nonEmpty('Please Select')),
  14: pipe(string(), nonEmpty('Please Select')),
  15: pipe(string(), nonEmpty('Please Select')),
  16: pipe(string(), nonEmpty('Please Select'))
})

export const CardiacDysautonomiaSchema = object({
  17: pipe(string(), nonEmpty('Please Select')),
  18: pipe(string(), nonEmpty('Please Select')),
  19: optional(array(string())),
  20: pipe(string(), nonEmpty('Please Select'))
})

export const UrogenitalSchema = object({
  21: pipe(string(), nonEmpty('Please Select')),
  22: pipe(string(), nonEmpty('Please Select')),
  23: pipe(string(), nonEmpty('Please Select')),
  24: pipe(string(), nonEmpty('Please Select')),
  25: pipe(string(), nonEmpty('Please Select'))
})

export const AnxietySchema = object({
  26: pipe(string(), nonEmpty('Please Select')),
  27: pipe(string(), nonEmpty('Please Select')),
  28: pipe(string(), nonEmpty('Please Select'))
})

export const DepressionSchema = object({
  29: pipe(string(), nonEmpty('Please Select')),
  30: pipe(string(), nonEmpty('Please Select')),
  31: pipe(string(), nonEmpty('Please Select'))
})

export const PerceivedSpidergramScoreBlock = object({
  score: pipe(number(), integer())
})

export const PerceivedSpidergramSchema = object({
  Anxiety: PerceivedSpidergramScoreBlock,
  'Cardiac Dysautonomia': PerceivedSpidergramScoreBlock,
  Depression: PerceivedSpidergramScoreBlock,
  Fatigue: PerceivedSpidergramScoreBlock,
  Gastrointestinal: PerceivedSpidergramScoreBlock,
  Neuromusculoskeletal: PerceivedSpidergramScoreBlock,
  Pain: PerceivedSpidergramScoreBlock,
  Urogenital: PerceivedSpidergramScoreBlock
})
export const QuestionnaireSchema = object({
  Anxiety: AnxietySchema,
  'Cardiac Dysautonomia': CardiacDysautonomiaSchema,
  Depression: DepressionSchema,
  Fatigue: FatigueSchema,
  Gastrointestinal: GastrointestinalSchema,
  Neuromusculoskeletal: NeuromusculoskeletalSchema,
  Pain: PainSchema,
  Spidergram: optional(PerceivedSpidergramSchema),
  Urogenital: UrogenitalSchema
})
