import React from 'react'

import { render, screen, waitFor, fireEvent, within } from '@testing-library/react'
import '@testing-library/jest-dom'

const mockGet = jest.fn()
const mockUpdate = jest.fn()
const mockDelOne = jest.fn()
const mockDelMany = jest.fn()

jest.mock('../../src/actions/clinician-patientlist/PatientListAction', () => ({
  getPatients: (filters: any, clinicianId: string) => mockGet(filters, clinicianId),
  updatePatientLink: (cid: string, pid: string, status: string) => mockUpdate(cid, pid, status),
  deletePatientLink: (cid: string, pid: string) => mockDelOne(cid, pid),
  deleteManyPatientLinks: (cid: string, pids: string[]) => mockDelMany(cid, pids)
}))

import { ClinicianPatientList } from '../../src/components/ClinicianPatientList/ClinicianPatientList'

describe('ClinicianPatientList integration', () => {
  const clinicianId = 'clin1'

  const basePatients = [
    {
      id: 'p1',
      name: 'Ernest Moeran',
      email: 'ernest@eynsford.org',
      dateOfBirth: '1990-01-01',
      patientLink: 'PENDING',
      agreedToShareData: false
    },
    {
      id: 'p2',
      name: 'Peter Warlock',
      email: 'phillip@heseltine.net',
      dateOfBirth: '1985-05-05',
      patientLink: null,
      agreedToShareData: true
    }
  ]

  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('loads and displays patients, then filters by name & email', async () => {
    mockGet.mockResolvedValue({ patients: basePatients, total: 2, page: 1, pageSize: 10 })

    render(<ClinicianPatientList clinicianId={clinicianId} />)

    await waitFor(() =>
      expect(mockGet).toHaveBeenCalledWith(expect.objectContaining({ page: 1, pageSize: 10 }), clinicianId)
    )

    expect(screen.getByText('Ernest Moeran')).toBeInTheDocument()
    expect(screen.getByText('Peter Warlock')).toBeInTheDocument()

    fireEvent.change(screen.getByLabelText('Patient'), { target: { value: 'Peter Warlock' } })
    expect(screen.queryByText('Ernest Moeran')).not.toBeInTheDocument()
    expect(screen.getByText('Peter Warlock')).toBeInTheDocument()

    fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'phillip@heseltine.net' } })
    expect(screen.getByText('Peter Warlock')).toBeInTheDocument()
  })

  test('Connects to a pending patient', async () => {
    mockGet.mockResolvedValue({ patients: basePatients, total: 2, page: 1, pageSize: 10 })

    mockUpdate.mockResolvedValue(undefined)
    mockGet.mockResolvedValueOnce({ patients: basePatients, total: 2, page: 1, pageSize: 10 }).mockResolvedValueOnce({
      patients: [{ ...basePatients[0], patientLink: 'CONNECTED' }, basePatients[1]],
      total: 2,
      page: 1,
      pageSize: 10
    })

    render(<ClinicianPatientList clinicianId={clinicianId} />)
    await waitFor(() => screen.getByText('Ernest Moeran'))

    const editButtons = screen
      .getAllByRole('button', { name: '' })
      .filter(btn => btn.closest('tr')?.textContent?.includes('Ernest Moeran'))

    fireEvent.click(editButtons[0])

    fireEvent.click(screen.getByText('Connected'))

    await waitFor(() => {
      expect(mockUpdate).toHaveBeenCalledWith(clinicianId, 'p1', 'CONNECTED')
    })

    await waitFor(() => {
      expect(screen.getByText('CONNECTED')).toBeInTheDocument()
    })
  })

  test('Bulk selects and deletes all patients', async () => {
    mockGet.mockResolvedValue({ patients: basePatients, total: 2, page: 1, pageSize: 10 })

    mockGet
      .mockResolvedValueOnce({ patients: basePatients, total: 2, page: 1, pageSize: 10 })
      .mockResolvedValueOnce({ patients: [], total: 0, page: 1, pageSize: 10 })
    mockDelMany.mockResolvedValue(undefined)

    render(<ClinicianPatientList clinicianId='clin1' />)

    await waitFor(() => expect(screen.getByText('Ernest Moeran')).toBeInTheDocument())

    fireEvent.click(screen.getByRole('checkbox', { name: /select all/i }))

    fireEvent.click(screen.getByRole('button', { name: /^Delete$/i }))
    const dialog = await screen.findByRole('dialog')

    fireEvent.click(within(dialog).getByRole('button', { name: /^Delete$/i }))

    await waitFor(() => {
      expect(mockDelMany).toHaveBeenCalledWith('clin1', ['p1', 'p2'])
    })

    await waitFor(() => {
      expect(screen.queryByText('Ernest Moeran')).not.toBeInTheDocument()
      expect(screen.queryByText('Peter Warlock')).not.toBeInTheDocument()
    })
  })
})
