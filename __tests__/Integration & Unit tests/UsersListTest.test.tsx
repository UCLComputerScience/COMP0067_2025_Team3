import React from 'react'

import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'

const pushMock = jest.fn()

jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: pushMock })
}))

import UsersList from '../../src/views/UsersList'
import type { Users } from '../../src/app/(private)/all-users/page'

describe('UsersList component', () => {
  const sampleUsers: Users[] = [
    { id: '1', firstName: 'Alice', lastName: 'Smith', email: 'alice@example.com', role: 'PATIENT', status: 'ACTIVE' },
    { id: '2', firstName: 'Bob', lastName: 'Jones', email: 'bob@example.com', role: 'CLINICIAN', status: 'PENDING' },
    {
      id: '3',
      firstName: 'Carol',
      lastName: 'White',
      email: 'carol@example.com',
      role: 'RESEARCHER',
      status: 'INACTIVE'
    }
  ]

  it('renders rows and pagination correctly', () => {
    render(<UsersList users={sampleUsers} />)

    expect(screen.getByText('USER')).toBeInTheDocument()
    expect(screen.getByText('EMAIL')).toBeInTheDocument()

    expect(screen.getByText('Alice Smith')).toBeInTheDocument()
    expect(screen.getByText('bob@example.com')).toBeInTheDocument()
    expect(screen.getByText('RESEARCHER')).toBeInTheDocument()

    expect(screen.getByText(/1–3 of 3/)).toBeInTheDocument()
  })

  it('filters by role and status', () => {
    render(<UsersList users={sampleUsers} />)

    const roleSelect = screen.getByRole('combobox', { name: /Role/i })

    fireEvent.mouseDown(roleSelect)
    fireEvent.click(screen.getByText('Clinician'))

    expect(screen.queryByText('Alice Smith')).toBeNull()
    expect(screen.getByText('Bob Jones')).toBeInTheDocument()

    const statusSelect = screen.getByRole('combobox', { name: /Status/i })

    fireEvent.mouseDown(statusSelect)
    fireEvent.click(screen.getByText('Pending'))

    expect(screen.getByText('Bob Jones')).toBeInTheDocument()
  })

  it('searches by name', () => {
    render(<UsersList users={sampleUsers} />)

    const search = screen.getByPlaceholderText(/Search User/i)

    fireEvent.change(search, { target: { value: 'carol' } })

    expect(screen.getByText('Carol White')).toBeInTheDocument()
    expect(screen.queryByText('Alice Smith')).toBeNull()
  })

  it('shows empty state when no users match', () => {
    render(<UsersList users={sampleUsers} />)

    const search = screen.getByPlaceholderText(/Search User/i)

    fireEvent.change(search, { target: { value: 'xyz' } })

    expect(screen.getByText(/No users match the search criteria/i)).toBeInTheDocument()
  })

  it('navigates to edit page when clicking pencil icon', () => {
    render(<UsersList users={sampleUsers} />)

    const editButtons = screen.getAllByRole('button', { name: '' })

    fireEvent.click(editButtons[1])

    expect(pushMock).toHaveBeenCalledWith('/all-users/2')
  })

  it('supports changing page and rows per page', () => {
    const many = Array.from({ length: 12 }, (_, i) => ({
      id: String(i + 1),
      firstName: 'U' + (i + 1),
      lastName: 'Test',
      email: `u${i + 1}@x.com`,
      role: 'PATIENT',
      status: 'ACTIVE'
    }))

    render(<UsersList users={many} />)

    expect(screen.getByText('U1 Test')).toBeInTheDocument()
    expect(screen.queryByText('U6 Test')).toBeNull()

    fireEvent.click(screen.getByLabelText('Go to next page'))
    expect(screen.getByText('U6 Test')).toBeInTheDocument()

    const rowsPerPageSelect = screen.getByRole('combobox', { name: /rows per page/i })

    fireEvent.mouseDown(rowsPerPageSelect)
    fireEvent.click(screen.getByText('10'))

    expect(screen.queryByText('U11 Test')).toBeNull()
  })
})
