'use client'

import { useEffect, useState } from 'react'

import Link from 'next/link'

import {
  Box,
  Card,
  TextField,
  Select,
  MenuItem,
  Button,
  Checkbox,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  InputLabel,
  FormControl,
  Chip,
  IconButton,
  Menu,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions
} from '@mui/material'

import { RelationshipStatus } from '@prisma/client'

import {
  getPatients,
  updatePatientLink,
  deletePatientLink,
  deleteManyPatientLinks
} from '@/actions/clinician-patientlist/PatientListAction'

type Patient = {
  id: string
  name: string
  firstName?: string
  lastName?: string
  email: string
  dateOfBirth: string
  patientLink: RelationshipStatus | null
}

type PatientData = {
  patients: Patient[]
  total: number
  page: number
  pageSize: number
}

export function ClinicianPatientList({ clinicianId }: { clinicianId: string }) {
  const [data, setData] = useState<PatientData | null>(null)

  const [filters, setFilters] = useState({
    patientName: '',
    email: '',
    patientLink: undefined as RelationshipStatus | undefined,
    page: 1,
    pageSize: 10
  })

  const [error, setError] = useState<string | null>(null)
  const [selectAll, setSelectAll] = useState(false)
  const [selectedPatients, setSelectedPatients] = useState<string[]>([])
  const [exportFormat, setExportFormat] = useState<'csv' | 'pdf'>('csv')

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const [selectedPatient, setSelectedPatient] = useState<string>('')

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)

  useEffect(() => {
    async function fetchData() {
      try {
        const result = await getPatients(filters, clinicianId)

        setData(result)
        setError(null)

        console.log('Fetch patient data with filters:', filters)
      } catch (err) {
        setError('Failed to get patient data')
        console.error('Error fetching patient data:', err)
      }
    }

    fetchData()
  }, [filters, clinicianId])

  const handleFilterChange = (
    key: 'patientName' | 'email' | 'patientLink',
    value: string | RelationshipStatus | undefined
  ) => {
    console.log(`Filter changed: ${key} = ${value}`)
    setFilters(prev => ({ ...prev, [key]: value, page: 1 }))
  }

  const handlePageChange = (newPage: number) => {
    setFilters(prev => ({ ...prev, page: newPage }))
  }

  const handlePatientLinkChange = async (patientId: string, status: string) => {
    try {
      const relationshipStatus = status as RelationshipStatus

      if (relationshipStatus in RelationshipStatus) {
        await updatePatientLink(clinicianId, patientId, relationshipStatus)
        const result = await getPatients(filters, clinicianId)

        setData(result)
      }
    } catch (err) {
      setError('Failed to update the patient link')
    }
  }

  const handleDeletePatientLinks = async () => {
    try {
      setError('Deletion request being processed...')

      if (selectedPatients.length === 1) {
        await deletePatientLink(clinicianId, selectedPatients[0])
      } else {
        await deleteManyPatientLinks(clinicianId, selectedPatients)
      }

      const result = await getPatients(filters, clinicianId)

      setData(result)

      setSelectedPatients([])
      setSelectAll(false)

      setDeleteDialogOpen(false)

      setError(null)
    } catch (err) {
      console.error('Error deleting patient links:', err)
      setError('Fail to delete the patient link information. Try it again.')
    }
  }

  const handleExport = async () => {
    try {
      if (!data) return

      const selectedData = data.patients.filter(p => selectedPatients.includes(p.id))

      if (exportFormat === 'csv') {
        const headers = ['Name', 'Email', 'Date of Birth', 'Patient Link']

        const rows = selectedData.map(p => [p.name, p.email, p.dateOfBirth, p.patientLink ?? ''].join(','))

        const csvContent = [headers.join(','), ...rows].join('\n')
        const blob = new Blob([csvContent], { type: 'text/csv' })

        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')

        a.href = url
        a.download = 'selected_patientsList.csv'
        a.click()
        URL.revokeObjectURL(url)
      } else if (exportFormat === 'pdf') {
        const { jsPDF } = await import('jspdf')
        const autoTable = (await import('jspdf-autotable')).default

        const doc = new jsPDF()

        doc.setFontSize(16)
        doc.text('Patient List', 14, 20)

        const tableData = selectedData.map(p => [p.name, p.email, p.dateOfBirth, p.patientLink?.toUpperCase() ?? ''])

        autoTable(doc, {
          startY: 30,
          head: [['Name', 'Email', 'Date of Birth', 'Patient Link']],
          body: tableData,
          styles: { fontSize: 11 },
          headStyles: {
            fillColor: [63, 81, 181],
            textColor: [255, 255, 255],
            halign: 'center'
          },
          bodyStyles: {
            halign: 'left'
          }
        })

        doc.save('selected_patientsList.pdf')
      }
    } catch (err) {
      setError('Export failed, please try again')
    }
  }

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedPatients([])
    } else {
      setSelectedPatients(data?.patients.map(patient => patient.id) || [])
    }

    setSelectAll(!selectAll)
  }

  const handleSelectPatient = (patientId: string) => {
    if (selectedPatients.includes(patientId)) {
      setSelectedPatients(selectedPatients.filter(id => id !== patientId))
    } else {
      setSelectedPatients([...selectedPatients, patientId])
    }
  }

  if (error)
    return (
      <Typography color='error' sx={{ p: 4 }}>
        {error}
      </Typography>
    )
  if (!data) return <Typography sx={{ p: 4 }}>Loading...</Typography>

  const totalPages = Math.ceil(data.total / data.pageSize)
  const startRow = (data.page - 1) * data.pageSize + 1
  const endRow = Math.min(data.page * data.pageSize, data.total)

  const getLinkStatusColor = (status: RelationshipStatus | null) => {
    switch (status) {
      case 'CONNECTED':
        return 'success'
      case 'PENDING':
        return 'warning'
      default:
        return 'secondary'
    }
  }

  const displayedPatients = data.patients.filter(patient => {
    if (!filters.patientName) return true

    const searchInput = filters.patientName.trim().toLowerCase()
    const searchTerms = searchInput.split(/\s+/)

    if (patient.firstName && patient.lastName) {
      const firstName = patient.firstName.toLowerCase()
      const lastName = patient.lastName.toLowerCase()
      const fullName = `${firstName} ${lastName}`.toLowerCase()

      if (fullName.includes(searchInput)) {
        return true
      }

      if (searchTerms.length > 1) {
        const firstTermMatchesFirstName = firstName.includes(searchTerms[0])
        const secondTermMatchesLastName = lastName.includes(searchTerms[1])

        if (firstTermMatchesFirstName && secondTermMatchesLastName) {
          return true
        }
      }

      return searchTerms.some(term => firstName.includes(term) || lastName.includes(term))
    }

    const patientName = patient.name.toLowerCase()

    if (patientName.includes(searchInput)) {
      return true
    }

    return searchTerms.some(term => patientName.includes(term))
  })

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
      <Card sx={{ width: 2000, p: 3 }}>
        {/* Filters */}
        <Typography variant='body2'>Filters</Typography>
        <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
          <TextField
            fullWidth
            label='Patient'
            value={filters.patientName}
            onChange={e => handleFilterChange('patientName', e.target.value)}
            variant='outlined'
            size='small'
          />
          <TextField
            fullWidth
            label='Email'
            value={filters.email}
            onChange={e => handleFilterChange('email', e.target.value)}
            variant='outlined'
            size='small'
          />
          <FormControl fullWidth variant='outlined' size='small'>
            <InputLabel id='patient-link-label'>Patient Link</InputLabel>
            <Select
              labelId='patient-link-label'
              label='Patient link'
              value={filters.patientLink ?? 'all'}
              onChange={e => {
                const value = e.target.value

                handleFilterChange('patientLink', value === 'all' ? undefined : (value as RelationshipStatus))
              }}
            >
              <MenuItem value='all'>All</MenuItem>
              <MenuItem value={RelationshipStatus.PENDING}>Pending</MenuItem>
              <MenuItem value={RelationshipStatus.CONNECTED}>Connected</MenuItem>
            </Select>
          </FormControl>
        </Box>

        {/* Export and Delete Buttons */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 5, mb: 2 }}>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Checkbox
              checked={selectAll}
              onChange={handleSelectAll}
              sx={{ visibility: data.patients.length > 0 ? 'visible' : 'hidden' }}
            />
            <Typography variant='body2'>
              {selectedPatients.length > 0
                ? `Selected ${selectedPatients.length} patient${selectedPatients.length > 1 ? 's' : ''}`
                : ''}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Button
              variant='contained'
              color='error'
              onClick={() => setDeleteDialogOpen(true)}
              disabled={selectedPatients.length === 0}
              size='small'
            >
              Delete
            </Button>
            <Select
              value={exportFormat}
              onChange={e => setExportFormat(e.target.value as 'csv' | 'pdf')}
              size='small'
              variant='outlined'
            >
              <MenuItem value='csv'>CSV</MenuItem>
              <MenuItem value='pdf'>PDF</MenuItem>
            </Select>
            <Button
              variant='contained'
              color='primary'
              onClick={handleExport}
              disabled={selectedPatients.length === 0}
              size='small'
            >
              Export
            </Button>
          </Box>
        </Box>

        {/* Table */}
        <Box sx={{ display: 'flex', gap: 2, mt: 3 }}>
          <TableContainer component={Paper} sx={{ boxShadow: 0, mb: 6 }}>
            {displayedPatients.length === 0 ? (
              <Typography sx={{ p: 4, textAlign: 'center' }}>No related patients</Typography>
            ) : (
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell width='5%'>
                      <Checkbox checked={selectAll} onChange={handleSelectAll} />
                    </TableCell>
                    <TableCell>PATIENT</TableCell>
                    <TableCell>EMAIL</TableCell>
                    <TableCell>DATE OF BIRTH</TableCell>
                    <TableCell>PATIENT LINK</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {displayedPatients.map(patient => (
                    <TableRow key={patient.id}>
                      <TableCell>
                        <Checkbox
                          checked={selectedPatients.includes(patient.id)}
                          onChange={() => handleSelectPatient(patient.id)}
                        />
                      </TableCell>
                      <TableCell>
                        <Link href={`/all-patients/${patient.id}`} style={{ color: '#7B61FF', textDecoration: 'none' }}>
                          {patient.name}
                        </Link>
                      </TableCell>
                      <TableCell>{patient.email}</TableCell>
                      <TableCell>{patient.dateOfBirth}</TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Chip
                            label={patient.patientLink || 'Not Set'}
                            variant='tonal'
                            color={getLinkStatusColor(patient.patientLink)}
                          />
                          <IconButton
                            color='secondary'
                            onClick={event => {
                              setAnchorEl(event.currentTarget)
                              setSelectedPatient(patient.id)
                            }}
                            size='small'
                          >
                            <i className='ri-pencil-line' />
                          </IconButton>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </TableContainer>
        </Box>

        {/* Pagination */}
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Typography variant='body2'>Rows per page:</Typography>
            <Select
              value={filters.pageSize}
              onChange={e =>
                setFilters(prev => ({
                  ...prev,
                  pageSize: Number(e.target.value),
                  page: 1
                }))
              }
              variant='outlined'
              size='small'
            >
              <MenuItem value={10}>10</MenuItem>
              <MenuItem value={20}>20</MenuItem>
              <MenuItem value={50}>50</MenuItem>
            </Select>
            <Typography variant='body2'>
              {data.total > 0 ? `${startRow}-${endRow} of ${data.total}` : '0 of 0'}
            </Typography>
            <IconButton onClick={() => handlePageChange(data.page - 1)} disabled={data.page === 1} size='small'>
              <i className='ri-arrow-left-s-line' />
            </IconButton>
            <IconButton
              onClick={() => handlePageChange(data.page + 1)}
              disabled={data.page === totalPages || data.total === 0}
              size='small'
            >
              <i className='ri-arrow-right-s-line' />
            </IconButton>
          </Box>
        </Box>

        <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={() => setAnchorEl(null)}>
          <MenuItem
            onClick={() => {
              handlePatientLinkChange(selectedPatient, RelationshipStatus.CONNECTED)
              setAnchorEl(null)
            }}
          >
            Connected
          </MenuItem>
          <MenuItem
            onClick={() => {
              handlePatientLinkChange(selectedPatient, RelationshipStatus.PENDING)
              setAnchorEl(null)
            }}
          >
            Pending
          </MenuItem>
        </Menu>

        {/* Delete*/}
        <Dialog
          open={deleteDialogOpen}
          onClose={() => setDeleteDialogOpen(false)}
          aria-labelledby='alert-dialog-title'
          aria-describedby='alert-dialog-description'
        >
          <DialogTitle id='alert-dialog-title'>Delete</DialogTitle>
          <DialogContent>
            <DialogContentText id='alert-dialog-description'>
              {selectedPatients.length > 1
                ? `Do you want to delete the selected ${selectedPatients.length} patient links? This action cannot be undone.`
                : 'Do I want to delete the selected patient links? This action cannot be undone.'}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDeleteDialogOpen(false)} color='primary'>
              Cancel
            </Button>
            <Button onClick={handleDeletePatientLinks} color='error' autoFocus>
              Delete
            </Button>
          </DialogActions>
        </Dialog>
      </Card>
    </Box>
  )
}
