import { DataField } from '@prisma/client'

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
