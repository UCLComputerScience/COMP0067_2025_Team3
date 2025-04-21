// __tests__/PatientInfoForm.integration.test.tsx
import React from 'react'

import { render, screen, waitFor, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'

jest.mock('valibot', () => {
  const actual = jest.requireActual('valibot')

  return { ...actual, safeParse: jest.fn() }
})
import * as valibot from 'valibot'

jest.mock('next-auth/react', () => ({
  useSession: () => ({ data: { user: { id: 'u1' } } })
}))
import { getUserDemographicAndClinical } from '../../src/actions/all-users/userAction'

jest.mock('../../src/actions/all-users/userAction')
import { savePatientInfo } from '../../src/actions/submit-response/info-submission-action'

jest.mock('../../src/actions/submit-response/info-submission-action')

import PatientInfoForm from '../../src/components/Questionnaire-pages/PatientInfoForm/PatientInfoForm'

describe('PatientInfoForm integration', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    ;(getUserDemographicAndClinical as jest.Mock).mockResolvedValue({
      age: '30',
      sex: 'Female',
      gender: 'Woman',
      isSexMatchingGender: true,
      ethnicity: 'White',
      residenceCountry: 'United Kingdom',
      employment: 'In education',
      education: 'College or university',
      activityLevel: 'Moderately active',
      weeklyExerciseMinutes: 120,
      diagnosis: 'Hypermobility Spectrum Disorder',
      diagnosedBy: 'Rheumatologist',
      medications: '',
      otherConditions: ''
    })
  })

  test('Valid answers succesfully submit and progress to the next page', async () => {
    const handleNext = jest.fn()

    window.alert = jest.fn()
    ;(valibot.safeParse as jest.Mock).mockReturnValue({ success: true, output: {} })
    ;(savePatientInfo as jest.Mock).mockResolvedValue({ success: true })

    render(<PatientInfoForm handleNext={handleNext} />)

    await waitFor(() => screen.getByRole('dialog'))
    fireEvent.click(screen.getByRole('button', { name: /OK/i }))

    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument())

    fireEvent.click(screen.getByRole('button', { name: /Next/i }))

    await waitFor(() => {
      expect(valibot.safeParse).toHaveBeenCalled()
      expect(savePatientInfo).toHaveBeenCalled()
      expect(window.alert).toHaveBeenCalledWith('Data saved successfully')
      expect(handleNext).toHaveBeenCalledTimes(1)
    })
  })

  test('Errors shown when validation fails', async () => {
    const handleNext = jest.fn()

    window.alert = jest.fn()
    ;(valibot.safeParse as jest.Mock).mockReturnValue({
      success: false,
      issues: [{ path: ['age'], message: 'Your age must be a number' }]
    })

    render(<PatientInfoForm handleNext={handleNext} />)

    await waitFor(() => screen.getByRole('dialog'))
    fireEvent.click(screen.getByRole('button', { name: /OK/i }))

    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument())

    fireEvent.click(screen.getByRole('button', { name: /Next/i }))

    await waitFor(() => {
      expect(handleNext).not.toHaveBeenCalled()
      expect(window.alert).toHaveBeenCalledWith('Please fill out all fields correctly')
      expect(screen.getByText('Your age must be a number')).toBeInTheDocument()
    })
  })

  test('Renders an empty form when no data is available', async () => {
    const handleNext = jest.fn()

    window.alert = jest.fn()
    ;(getUserDemographicAndClinical as jest.Mock).mockResolvedValue(null)

    render(<PatientInfoForm handleNext={handleNext} />)

    await waitFor(() => screen.getByRole('dialog'))
    fireEvent.click(screen.getByRole('button', { name: /OK/i }))

    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument())

    // Check that all fields, except gender matching sex, are empty

    const emptyFields = screen.getAllByDisplayValue('')
    const filledField = screen.getAllByDisplayValue('true')

    expect(emptyFields.length).toBe(14)
    expect(filledField.length).toBe(1)
  })
})
