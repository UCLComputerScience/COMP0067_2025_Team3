// demographic
const SEX_OPTIONS = ['Female', 'Male', 'Intersex'] as const

const GENDER_OPTIONS = [
  'Woman',
  'Man',
  'Non-binary/Non-conforming',
  'Unsure how to describe myself',
  'Prefer not to say'
] as const

const GENDER_SAME_AS_SEX_OPTIONS = ['Yes', 'No', 'Prefer not to say'] as const

const ETHNICITY_OPTIONS = [
  'White',
  'Mixed/Multiple ethnic groups',
  'Asian/Asian British',
  'Black/African/Caribbean/Black British',
  'Other'
] as const

const DIAGNOSIS_OPTIONS = [
  'Hypermobility Spectrum Disorder',
  'Hypermobile Ehlers Danlos Syndrome',
  'Hypermobile Ehlers Danlos Syndrome'
] as const

const SPECIALIST_OPTIONS = [
  'Rheumatologist',
  'General Practitioner',
  'Geneticist',
  'Paediatrician',
  'Physiotherapist',
  'Orthopaedic Consultant',
  'Other'
] as const

// clincial
const ACTIVITY_LEVEL_OPTIONS = [
  'Not very active',
  'Somewhat active',
  'Moderately active',
  'Very active',
  'Prefer not to say'
] as const

const EMPLOYMENT_STATUS_OPTIONS = [
  'Employed (full time)',
  'Employed (part time)',
  'Self employed',
  'In education',
  'Not currently working',
  'Unable to work due to ill health',
  'Prefer not to say'
] as const

const EDUCATION_LEVEL_OPTIONS = [
  'Primary school',
  'Secondary school up to 16 years of age',
  'Higher or secondary or further education (A-Levels, BTEC etc)',
  'College or university',
  'Post-graduate degree',
  'Prefer not to say'
] as const

const DATA_ACCESS_ATTRIBUTES = {
  demographic: [
    'Age',
    'Gender',
    'Sex',
    'Gender Same as Sex',
    'Ethnicity',
    'Geographical Location',
    'Diagnosis',
    'Person who Give Diagnosis',
    'Activity Levels/Exercises',
    'Education Levels',
    'Employment Status',
    'Medications',
    'Other Conditions'
  ],
  questionnaire: ['Single episode questionnaire', 'Longitudinal data (multiple questionnaires over time)']
} as const

export {
  SEX_OPTIONS,
  GENDER_OPTIONS,
  GENDER_SAME_AS_SEX_OPTIONS,
  ETHNICITY_OPTIONS,
  SPECIALIST_OPTIONS,
  ACTIVITY_LEVEL_OPTIONS,
  EMPLOYMENT_STATUS_OPTIONS,
  EDUCATION_LEVEL_OPTIONS,
  DIAGNOSIS_OPTIONS,
  DATA_ACCESS_ATTRIBUTES
}
