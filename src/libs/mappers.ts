import { ApplicationStatus, DataField } from '@prisma/client'

// data field mappers
const demographicFieldMap: Record<string, DataField> = {
  Age: DataField.AGE,
  Sex: DataField.SEX,
  Gender: DataField.GENDER,
  'Gender Same as Sex': DataField.ISSEXMATCHINGGENDER,
  Ethnicity: DataField.ETHNICITY,
  'Geographical Location': DataField.RESIDENCECOUNTRY,
  Diagnosis: DataField.DIAGNOSIS,
  'Person who Give Diagnosis': DataField.DIAGNOSEDBY,
  'Activity Levels/Exercises': DataField.ACTIVITYLEVEL,
  'Education Levels': DataField.EDUCATION,
  'Employment Status': DataField.EMPLOYMENT,
  'Excercise Levels': DataField.ACTIVITYLEVEL,
  Medications: DataField.MEDICATIONS,
  'Other Conditions': DataField.OTHERCONDITIONS
}

const questionnaireFieldMap: Record<string, DataField> = {
  'Single episode questionnaire': DataField.SINGLEEPISODE,
  'Longitudinal data (multiple questionnaires over time)': DataField.LONGITUDINAL
}

export function mapDataAccessFields(selectedValues: string[], fieldType: 'demographic' | 'questionnaire') {
  const fieldMap = fieldType === 'demographic' ? demographicFieldMap : questionnaireFieldMap

  return selectedValues.map(value => fieldMap[value]).filter((value): value is DataField => value !== undefined)
}

const reverseDemographicFieldMap: Record<string, string> = Object.fromEntries(
  Object.entries(demographicFieldMap).map(([key, value]) => [value, key])
) as Record<string, string>

const reverseQuestionnaireFieldMap: Record<string, string> = Object.fromEntries(
  Object.entries(questionnaireFieldMap).map(([key, value]) => [value, key])
) as Record<string, string>

export function reverseMapDataAccessFields(selectedValues: string[], fieldType: 'demographic' | 'questionnaire') {
  const reverseFieldMap = fieldType === 'demographic' ? reverseDemographicFieldMap : reverseQuestionnaireFieldMap

  return selectedValues.map(value => reverseFieldMap[value]).filter((value): value is string => value !== undefined)
}

// application status
export const stringToApplicationStatus = (statusStr: string): ApplicationStatus => {
  const upperCaseStatus = statusStr.toUpperCase()

  if (upperCaseStatus === 'APPROVED') return ApplicationStatus.APPROVED
  if (upperCaseStatus === 'PENDING') return ApplicationStatus.PENDING
  if (upperCaseStatus === 'REJECTED') return ApplicationStatus.REJECTED

  // Default case
  console.warn(`Invalid application status: ${statusStr}, defaulting to PENDING`)
  
return ApplicationStatus.PENDING
}
