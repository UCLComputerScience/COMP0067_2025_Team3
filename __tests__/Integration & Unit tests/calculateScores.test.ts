/* For this test to run temporarily export async the caluclateScores function in '../../src/actions/records/recordAction'

import { describe, it, expect } from '@jest/globals'

import { calculateScores } from '../../src/actions/records/recordAction'

describe('calculateScores', () => {
  it('returns correct average scores and totals for single domain', async () => {
    const records = [
      { score: 20, domain: 'Pain' },
      { score: 20, domain: 'Pain' },
      { score: 30, domain: 'Pain' },
      { score: 30, domain: 'Pain' }
    ]

    const result = await calculateScores(records)

    expect(result).toEqual([{ domain: 'Pain', totalScore: 100, averageScore: 25 }])
  })

  it('returns correct average scores for a full test answer set', async () => {
    const records = [
      { score: 20, domain: 'Pain' },
      { score: 20, domain: 'Pain' },
      { score: 30, domain: 'Pain' },
      { score: 30, domain: 'Pain' },
      { score: 20, domain: 'Fatigue' },
      { score: 20, domain: 'Fatigue' },
      { score: 20, domain: 'Fatigue' },
      { score: 50, domain: 'Neuromusculoskeletal' },
      { score: 50, domain: 'Neuromusculoskeletal' },
      { score: 50, domain: 'Neuromusculoskeletal' },
      { score: 50, domain: 'Neuromusculoskeletal' },
      { score: 50, domain: 'Neuromusculoskeletal' },
      { score: 25, domain: 'Gastrointestinal' },
      { score: 25, domain: 'Gastrointestinal' },
      { score: 25, domain: 'Gastrointestinal' },
      { score: 25, domain: 'Gastrointestinal' },
      { score: 25, domain: 'Cardiac Dysautonomia' },
      { score: 25, domain: 'Cardiac Dysautonomia' },
      { score: 60, domain: 'Cardiac Dysautonomia' },
      { score: 25, domain: 'Cardiac Dysautonomia' },
      { score: 25, domain: 'Urogenital' },
      { score: 25, domain: 'Urogenital' },
      { score: 25, domain: 'Urogenital' },
      { score: 25, domain: 'Urogenital' },
      { score: 66.6, domain: 'Urogenital' },
      { score: 25, domain: 'Anxiety' },
      { score: 25, domain: 'Anxiety' },
      { score: 25, domain: 'Anxiety' },
      { score: 25, domain: 'Depression' },
      { score: 25, domain: 'Depression' },
      { score: 25, domain: 'Depression' }
    ]

    const result = await calculateScores(records)

    expect(result).toEqual([
      { domain: 'Pain', totalScore: 100, averageScore: 25 },
      { domain: 'Fatigue', totalScore: 60, averageScore: 20 },
      { domain: 'Neuromusculoskeletal', totalScore: 250, averageScore: 50 },
      { domain: 'Gastrointestinal', totalScore: 100, averageScore: 25 },
      { domain: 'Cardiac Dysautonomia', totalScore: 135, averageScore: 33.75 },
      { domain: 'Urogenital', totalScore: 166.6, averageScore: 33.32 },
      { domain: 'Anxiety', totalScore: 75, averageScore: 25 },
      { domain: 'Depression', totalScore: 75, averageScore: 25 }
    ])
  })

  it('returns empty array for no records', async () => {
    const result = await calculateScores([])

    expect(result).toEqual([])
  })
})
  */
