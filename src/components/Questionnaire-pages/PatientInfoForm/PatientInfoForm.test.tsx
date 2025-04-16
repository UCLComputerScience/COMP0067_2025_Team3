import { render, screen } from '@testing-library/react'

import '@testing-library/jest-dom'

import PatientInfoForm from './PatientInfoForm'

test('form renders with empty fields', async () => {
  render(<PatientInfoForm handleNext={jest.fn()} />)

  const inputs = await screen.findAllByRole('textbox')

  screen.logTestingPlaygroundURL()
  expect(inputs[0]).toHaveValue('') // Age
  expect(inputs[1]).toHaveValue('') // Minutes of exercise
  expect(inputs[2]).toHaveValue('') // Medications
  expect(inputs[3]).toHaveValue('') // Other conditions
})
