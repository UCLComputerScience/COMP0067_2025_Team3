// Record types for listing multiple records
export interface Data {
  submissionId: string
  date: Date
  neuromusculoskeletal: number
  pain: number
  fatigue: number
  gastrointestinal: number
  cardiacDysautonomia: number
  urogenital: number
  anxiety: number
  depression: number
}

// Domain score for a single record
export interface DomainScore {
  domain: string
  totalScore: number
  averageScore: number
}

// For grouping by domains in getResponseDataByUser
export interface DomainAverageScore {
  averageScore: number
}

export interface SubmissionResult {
  createdAt: Date
  domains: Record<string, DomainAverageScore>
}

// Raw record data from database
export interface RecordData {
  score: number
  domain: string
  createdAt: Date
  label?: string
  user?: {
    firstName: string
    lastName: string
  }
}

// Spidergram data format
export interface SpidergramValue {
  subject: string
  value: number
}

// Complete result for a single record view
export interface RecordResult {
  scores: DomainScore[] // This matches the SingleRecordProps.data format
  formattedDate: string // This matches the SingleRecordProps.date format
  patientName: string // This matches the SingleRecordProps.patientName format
  perceivedSpidergramValues: SpidergramValue[] // This matches the SingleRecordProps.perceivedSpidergramData format
}
