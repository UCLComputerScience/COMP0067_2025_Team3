import React from 'react'

import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'

jest.mock('next-auth/react', () => ({
  useSession: () => ({ data: { user: { id: 'u1' } } })
}))

const pushMock = jest.fn()

jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: pushMock })
}))

const toastError = jest.fn()
const toastSuccess = jest.fn()

jest.mock('react-toastify', () => ({
  toast: {
    error: (msg: string) => toastError(msg),
    success: (msg: string) => toastSuccess(msg)
  }
}))

jest.mock('../src/actions/researcher/applicationAction', () => ({
  createApplication: jest.fn(),
  updateApplication: jest.fn()
}))

import DataAccessApplicationForm from '../../src/components/DataAccessApplicationForm'
import { createApplication, updateApplication } from '../../src/actions/researcher/applicationAction'

describe('DataAccessApplicationForm', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('Fails when an empty submission is made and displays a toast', async () => {
    render(<DataAccessApplicationForm />)

    // Click the Submit button
    fireEvent.click(screen.getByRole('button', { name: /Submit/i }))

    // The form's onSubmit wrapper should toast an error
    await waitFor(() => {
      expect(toastError).toHaveBeenCalledWith(
        'Oops! Some fields need attention. Please check your input and try again.'
      )
    })

    // And no API should have been called
    expect(createApplication).not.toHaveBeenCalled()
    expect(updateApplication).not.toHaveBeenCalled()
  })
})
