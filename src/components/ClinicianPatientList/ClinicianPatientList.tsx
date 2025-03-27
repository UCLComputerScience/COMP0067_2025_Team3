'use client'

import { useEffect, useState } from 'react'

import Link from 'next/link'

import {
  Box,
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
  FormControl
} from '@mui/material'

import { RelationshipStatus } from '@prisma/client'

import { getPatients, updatePatientLink } from '@/actions/clinician-patientlist/PatientListActions'

type Patient = {
  id: string
  name: string
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

  useEffect(() => {
    async function fetchData() {
      try {
        const result = await getPatients(filters, clinicianId)

        setData(result)
        setError(null)
      } catch (err) {
        setError('Failed to get patient data')
      }
    }

    fetchData()
  }, [filters, clinicianId])

  const handleFilterChange = (
    key: 'patientName' | 'email' | 'patientLink',
    value: string | RelationshipStatus | undefined
  ) => {
    setFilters((prev) => ({ ...prev, [key]: value, page: 1 }))
  }

  const handlePageChange = (newPage: number) => {
    setFilters((prev) => ({ ...prev, page: newPage }))
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

  {/* Export */}
  
  const handleExport = async () => {
    try {
      if (!data) return

      const selectedData = data.patients.filter((p) => selectedPatients.includes(p.id))

      if (exportFormat === 'csv') {
        const headers = ['Name', 'Email', 'Date of Birth', 'Patient Link']

        const rows = selectedData.map((p) =>
          [p.name, p.email, p.dateOfBirth, p.patientLink ?? ''].join(',')
        )

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

        const tableData = selectedData.map((p) => [
          p.name,
          p.email,
          p.dateOfBirth,
          p.patientLink?.toUpperCase() ?? ''
        ])

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
      setSelectedPatients(data?.patients.map((patient) => patient.id) || [])
    }

    setSelectAll(!selectAll)
  }

  const handleSelectPatient = (patientId: string) => {
    if (selectedPatients.includes(patientId)) {
      setSelectedPatients(selectedPatients.filter((id) => id !== patientId))
    } else {
      setSelectedPatients([...selectedPatients, patientId])
    }
  }

  if (error) return <Typography color="error" sx={{ p: 4 }}>{error}</Typography>
  if (!data) return <Typography sx={{ p: 4 }}>Loading...</Typography>

  const totalPages = Math.ceil(data.total / data.pageSize)
  const startRow = (data.page - 1) * data.pageSize + 1
  const endRow = Math.min(data.page * data.pageSize, data.total)

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h3" sx={{ mb: 2, fontWeight: 'bold' }}>
        Filters
      </Typography>

      {/* Filters */}
      <Box sx={{ display: 'flex', gap: 2, mb: 4 }}>
        <TextField
          fullWidth
          label="Patient"
          value={filters.patientName}
          onChange={(e) => handleFilterChange('patientName', e.target.value)}
          variant="outlined"
        />
        <TextField
          fullWidth
          label="Email"
          value={filters.email}
          onChange={(e) => handleFilterChange('email', e.target.value)}
          variant="outlined"
        />
        <FormControl fullWidth variant="outlined">
          <InputLabel id="patient-link-label">Patient Link</InputLabel>
          <Select
            labelId="patient-link-label"
            label="Patient link"
            value={filters.patientLink ?? 'all'}
            onChange={(e) => {
              const value = e.target.value

              handleFilterChange(
                'patientLink',
                value === 'all' ? undefined : (value as RelationshipStatus)
              )
            }}
            variant="outlined"
          >
            <MenuItem value="all">All</MenuItem>
            <MenuItem value={RelationshipStatus.PENDING}>Pending</MenuItem>
            <MenuItem value={RelationshipStatus.CONNECTED}>Connected</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {/* Export */}
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 2, mb: 4 }}>
        <Select
          value={exportFormat}
          onChange={(e) => setExportFormat(e.target.value as 'csv' | 'pdf')}
          size="small"
          variant="outlined"
        >
          <MenuItem value="csv">CSV</MenuItem>
          <MenuItem value="pdf">PDF</MenuItem>
        </Select>
        <Button
          variant="contained"
          color="primary"
          onClick={handleExport}
          disabled={selectedPatients.length === 0}
        >
          Export
        </Button>
      </Box>

      {/* Table */}
      <TableContainer component={Paper} sx={{ border: 1, borderColor: 'divider', borderRadius: 2 }}>
        {data.patients.length === 0 ? (
          <Typography sx={{ p: 4, textAlign: 'center' }}>No related patients</Typography>
        ) : (
          <Table>
            <TableHead>
              <TableRow
                sx={(theme) => ({
                  bgcolor: theme.palette.mode === 'light' ? theme.palette.grey[100] : '#2D2A4A',
                  '& .MuiTableCell-root': {
                    fontSize: '1.1rem',
                    fontWeight: 600,
                    color: theme.palette.mode === 'light' ? 'text.primary' : 'white'
                  }
                })}
              >
                <TableCell>
                  <Checkbox checked={selectAll} onChange={handleSelectAll} />
                </TableCell>
                <TableCell>PATIENT</TableCell>
                <TableCell>EMAIL</TableCell>
                <TableCell>DATE OF BIRTH</TableCell>
                <TableCell>PATIENT LINK</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.patients.map((patient) => (
                <TableRow key={patient.id}>
                  <TableCell>
                    <Checkbox
                      checked={selectedPatients.includes(patient.id)}
                      onChange={() => handleSelectPatient(patient.id)}
                    />
                  </TableCell>
                  <TableCell sx={{ fontSize: '1.1rem' }}>
                    <Link
                      href={`/all-patients/${patient.id}/records`}
                      style={{ color: '#7B61FF', textDecoration: 'underline' }}
                    >
                      {patient.name}
                    </Link>
                  </TableCell>
                  <TableCell sx={{ fontSize: '1.1rem' }}>{patient.email}</TableCell>
                  <TableCell sx={{ fontSize: '1.1rem' }}>{patient.dateOfBirth}</TableCell>
                  <TableCell>
                    <Select
                      value={patient.patientLink || ''}
                      onChange={(e) => handlePatientLinkChange(patient.id, e.target.value)}
                      variant="outlined"
                      sx={{ minWidth: 100, fontSize: '1rem' }}
                    >
                      <MenuItem value={RelationshipStatus.PENDING} sx={{ fontSize: '1rem' }}>
                        Pending
                      </MenuItem>
                      <MenuItem value={RelationshipStatus.CONNECTED} sx={{ fontSize: '1rem' }}>
                        Connected
                      </MenuItem>
                    </Select>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </TableContainer>

      {/* Pagination */}
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 4, color: 'text.secondary', gap: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Typography>Rows per page:</Typography>
          <Select
            value={filters.pageSize}
            onChange={(e) =>
              setFilters((prev) => ({
                ...prev,
                pageSize: Number(e.target.value),
                page: 1
              }))
            }
            variant="outlined"
            size="small"
          >
            <MenuItem value={10}>10</MenuItem>
            <MenuItem value={20}>20</MenuItem>
            <MenuItem value={50}>50</MenuItem>
          </Select>
          <Typography>
            {data.total > 0 ? `${startRow}-${endRow} of ${data.total}` : '0 of 0'}
          </Typography>
          <Button
            onClick={() => handlePageChange(data.page - 1)}
            disabled={data.page === 1}
            sx={{ minWidth: 0, p: 1 }}
          >
            {'<'}
          </Button>
          <Button
            onClick={() => handlePageChange(data.page + 1)}
            disabled={data.page === totalPages}
            sx={{ minWidth: 0, p: 1 }}
          >
            {'>'}
          </Button>
        </Box>
      </Box>
    </Box>
  )
}
