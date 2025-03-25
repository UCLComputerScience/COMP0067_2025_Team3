'use server'

import { prisma } from '@/prisma/client'
import { DataField } from '@prisma/client'
import { mkConfig, generateCsv } from 'export-to-csv'
import { mimeType } from 'valibot'
import * as XLSX from 'xlsx'

interface RequestData {
  demographicFields: DataField[]
  questionnaireFields: DataField[]
  startDate: Date
  endDate: Date
  format: string
}

interface ExportResult {
  data: string
  mimeType: string
  fileExtension: string
  message?: string
}

const demographicFieldsMapping: { [key: string]: string } = {
  [DataField.AGE]: 'age',
  [DataField.SEX]: 'sex',
  [DataField.GENDER]: 'gender',
  [DataField.ISSEXMATCHINGGENDER]: 'isSexMatchingGender',
  [DataField.ETHNICITY]: 'ethnicity',
  [DataField.RESIDENCECOUNTRY]: 'residenceCountry',
  [DataField.DIAGNOSIS]: 'diagnosis',
  [DataField.DIAGNOSEDBY]: 'diagnosedBy',
  [DataField.ACTIVITYLEVEL]: 'activityLevel',
  [DataField.EDUCATION]: 'education',
  [DataField.EMPLOYMENT]: 'employment',
  [DataField.MEDICATIONS]: 'medications',
  [DataField.OTHERCONDITIONS]: 'otherConditions'
}

const csvConfig = mkConfig({ useKeysAsHeaders: true })

export const getEarlisetResponseDate = async () => {
  const date = await prisma.response.findFirst({
    select: {
      createdAt: true
    },
    orderBy: {
      createdAt: 'asc'
    }
  })

  return date?.createdAt
}

export const generateQuestionnaireResponseExport = async (requestData: RequestData): Promise<ExportResult> => {
  const fetchResponses = async (isLongitudinal: boolean) => {
    const baseWhere = {
      createdAt: {
        gte: requestData.startDate,
        lte: requestData.endDate
      },
      user: {
        agreedForResearch: true
      }
    }

    if (isLongitudinal) {
      return await prisma.response.findMany({
        where: baseWhere
      })
    } else {
      const latestSubmission = (await prisma.$queryRaw`
        SELECT DISTINCT ON ("userId") "userId", "submissionId", "createdAt"
        FROM "Response"
        WHERE "createdAt" >= ${requestData.startDate}
        AND "createdAt" <= ${requestData.endDate}
        AND "userId" IN (SELECT "id" FROM "User" WHERE "agreedForResearch" = true)
        ORDER BY "userId", "createdAt" DESC
      `) as { userId: string; submissionId: string; createdAt: Date }[]

      console.log('latest submission:', latestSubmission)

      if (latestSubmission.length === 0) {
        return []
      }

      return await prisma.response.findMany({
        where: {
          ...baseWhere,
          OR: latestSubmission.map(submission => ({
            userId: submission.userId,
            submissionId: submission.submissionId
          }))
        }
      })
    }
  }

  const isLongitudinal = requestData.questionnaireFields[0] === DataField.LONGITUDINAL
  const responses = await fetchResponses(isLongitudinal)

  if (responses.length === 0) {
    return {
      message: 'No responses found for the selected time period.',
      data: '',
      mimeType: '',
      fileExtension: ''
    }
  }

  const formattedResponses = responses.map(response => ({
    ...response,
    createdAt: response.createdAt.toISOString()
  }))

  switch (requestData.format) {
    case 'CSV':
      const csvOutput = generateCsv(csvConfig)(formattedResponses)
      return {
        data: csvOutput.toString(),
        mimeType: 'text/csv;charset=utf-8;',
        fileExtension: 'csv'
      }

    case 'JSON':
      return {
        data: JSON.stringify(formattedResponses, null, 2),
        mimeType: 'application/json',
        fileExtension: 'json'
      }

    case 'XLSX':
      const worksheet = XLSX.utils.json_to_sheet(formattedResponses)
      const workbook = XLSX.utils.book_new()
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Responses')

      const xlsxOutput = XLSX.write(workbook, { type: 'binary', bookType: 'xlsx' })
      const base64data = Buffer.from(xlsxOutput, 'binary').toString('base64')

      return {
        data: base64data,
        mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        fileExtension: 'xlsx'
      }

    default:
      throw new Error(`Unsupported format: ${requestData.format}`)
  }
}

export const generatePatientDemographicDataExport = async (requestData: RequestData): Promise<ExportResult> => {
  const selectedFields = requestData.demographicFields.reduce(
    (acc, field) => {
      if (demographicFieldsMapping[field]) {
        acc[demographicFieldsMapping[field]] = true
      }

      return acc
    },
    {} as Record<string, boolean>
  )
  const demographicInfos = await prisma.patientInfo.findMany({
    where: {
      user: {
        agreedForResearch: true
      }
    },
    select: {
      updatedAt: true,
      id: true,
      userId: true,
      submissionId: true,
      ...selectedFields
    }
  })

  const formattedDemographicInfos = demographicInfos.map(demo => ({
    ...demo,
    updatedAt: demo.updatedAt.toISOString()
  }))

  switch (requestData.format) {
    case 'CSV':
      const csvOutput = generateCsv(csvConfig)(formattedDemographicInfos)
      return {
        data: csvOutput.toString(),
        mimeType: 'text/csv;charset=utf-8;',
        fileExtension: 'csv'
      }

    case 'JSON':
      return {
        data: JSON.stringify(formattedDemographicInfos, null, 2),
        mimeType: 'application/json',
        fileExtension: 'json'
      }

    case 'XLSX':
      const worksheet = XLSX.utils.json_to_sheet(formattedDemographicInfos)
      const workbook = XLSX.utils.book_new()
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Demographics')

      const xlsxOutput = XLSX.write(workbook, { type: 'binary', bookType: 'xlsx' })

      const base64data = Buffer.from(xlsxOutput, 'binary').toString('base64')

      return {
        data: base64data,
        mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        fileExtension: 'xlsx'
      }

    default:
      throw new Error(`Unsupported format: ${requestData.format}`)
  }
}

export const generateQuestionsExport = async () => {
  // only have CSV format for now
  const questions = await prisma.question.findMany()
  const csvOutput = generateCsv(csvConfig)(questions)
  return {
    data: csvOutput.toString(),
    mimeType: 'text/csv;charset=utf-8;',
    fileExtension: 'csv'
  }
}
