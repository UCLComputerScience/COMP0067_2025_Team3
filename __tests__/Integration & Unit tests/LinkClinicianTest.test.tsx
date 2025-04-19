import React from 'react'

import { render, screen, fireEvent, waitFor, within } from '@testing-library/react'
import '@testing-library/jest-dom'

const pushMock = jest.fn()

jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: pushMock })
}))

const toastSuccess = jest.fn()
const toastError = jest.fn()

jest.mock('react-toastify', () => ({
  toast: {
    success: (msg: string) => toastSuccess(msg),
    error: (msg: string) => toastError(msg)
  }
}))

jest.mock('../src/actions/patientSettings/userActions', () => ({
  saveNewClinician: jest.fn()
}))
import { saveNewClinician } from '../../src/actions/patientSettings/userActions'

jest.mock('../src/actions/email/sendInvite', () => ({
  sendInviteEmail: jest.fn()
}))
import { sendInviteEmail } from '../../src/actions/email/sendInvite'

import ClinicianLinkPage from '../../src/views/AddClinician'

const testPatientId = { id: 'p123' }

const dummyClinicians = [
  {
    id: 'c1',
    firstName: 'William',
    lastName: 'Byrd',
    institution: 'University of Oxford',
    email: 'dom@lincoln-cathedral.ac.uk'
  },
  {
    id: 'c2',
    firstName: 'Orlando',
    lastName: 'Gibbons',
    institution: 'University of Cambridge',
    email: 'dom@kings-cambridg.ac.uk'
  }
]

describe('ClinicianLinkPage', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('Search, select, and save an existing clinician', async () => {
    render(<ClinicianLinkPage id={testPatientId} cliniciansList={dummyClinicians} />)
    ;(saveNewClinician as jest.Mock).mockResolvedValue({ success: true })

    fireEvent.click(screen.getByRole('button', { name: /Search/i }))
    await screen.findByText(/Results/)

    fireEvent.click(screen.getByText('Orlando Gibbons'))

    fireEvent.click(screen.getByRole('button', { name: /Save/i }))

    await waitFor(() => {
      expect(saveNewClinician).toHaveBeenCalledWith('c2', 'p123')
      expect(toastSuccess).toHaveBeenCalledWith('Clinician added successfully')
      expect(pushMock).toHaveBeenCalledWith('/my-profile/')
    })
  })

  test('Send an invitation', async () => {
    render(<ClinicianLinkPage id={testPatientId} cliniciansList={dummyClinicians} />)
    ;(sendInviteEmail as jest.Mock).mockResolvedValue({ success: true })

    fireEvent.click(screen.getByRole('button', { name: /Search/i }))
    await screen.findByText(/Results/)

    fireEvent.click(screen.getByRole('button', { name: /Invite them to create an account/i }))

    const dialog = await screen.findByRole('dialog')
    const { getByLabelText, getByRole } = within(dialog)

    fireEvent.change(getByLabelText(/^First Name$/i), { target: { value: 'Thomas' } })
    fireEvent.change(getByLabelText(/^Last Name$/i), { target: { value: 'Tomkins' } })
    fireEvent.change(getByLabelText(/^Email$/i), { target: { value: 'TT@magdalen-oxf.ac.uk' } })

    fireEvent.click(getByRole('button', { name: /Send Invitation/i }))

    await waitFor(() => {
      expect(sendInviteEmail).toHaveBeenCalledWith('Thomas Tomkins', 'TT@magdalen-oxf.ac.uk', 'p123')
      expect(toastSuccess).toHaveBeenCalledWith('Invitation sent successfully')
      expect(screen.queryByText(/Invite Clinician/i)).toBeNull()
    })
  })

  test('Fails on a submission of only email', async () => {
    render(<ClinicianLinkPage id={testPatientId} cliniciansList={dummyClinicians} />)
    ;(sendInviteEmail as jest.Mock).mockResolvedValue({ success: false })

    fireEvent.click(screen.getByRole('button', { name: /Search/i }))
    await screen.findByText(/Results/)

    fireEvent.click(screen.getByRole('button', { name: /Invite them to create an account/i }))

    const dialog = await screen.findByRole('dialog')
    const { getByLabelText, getByRole } = within(dialog)

    fireEvent.change(getByLabelText(/^Email$/i), { target: { value: 'drjohnbull@virginal.org' } })

    fireEvent.click(getByRole('button', { name: /Send Invitation/i }))

    await waitFor(() => {
      expect(toastError).toHaveBeenCalledWith('Failed to send the invitation.')
      expect(within(dialog).getByText(/Invite Clinician/i)).toBeInTheDocument()
    })
  })
})
