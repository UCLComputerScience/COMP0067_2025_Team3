'use client'

import * as React from 'react'

import { useRouter } from 'next/navigation'

import Box from '@mui/material/Box'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TablePagination from '@mui/material/TablePagination'
import TableRow from '@mui/material/TableRow'

import { Card, CardContent, CardHeader, Chip, IconButton } from '@mui/material'

import { ApplicationStatus, Role } from '@prisma/client'

import { capitalize } from 'lodash'

import { EnhancedTableHead } from './EnhancedTableHead'
import type { PatientApplicationListType, ResearcherApplicationListType } from '@/views/Studies'

export type Order = 'asc' | 'desc'

interface AllStudyListTableProps {
  rows: PatientApplicationListType[] | ResearcherApplicationListType[]
  userRole: Role
}

const getApplicationStatusChipColor = (status: string) => {
  if (status === ApplicationStatus.PENDING) return 'warning'
  if (status === ApplicationStatus.APPROVED) return 'success'
  if (status === ApplicationStatus.REJECTED) return 'error'

  return 'default'
}

const getResearchParticipationChipColor = (status: boolean) => {
  if (status === true) return 'success'
  if (status === false) return 'error'

  return 'default'
}

export default function AllStudyListTable({ rows, userRole }: AllStudyListTableProps) {
  const router = useRouter()

  const [order, setOrder] = React.useState<Order>('asc')
  const [orderBy, setOrderBy] = React.useState<string>('createdAt')
  const [selected, setSelected] = React.useState<readonly number[]>([])
  const [page, setPage] = React.useState(0)
  const [rowsPerPage, setRowsPerPage] = React.useState(5)

  // Handle sort requests based on role
  const handleRequestSort = (event: React.MouseEvent<unknown>, property: string) => {
    if (rows.length > 0 && property in rows[0]) {
      const isAsc = orderBy === property && order === 'asc'

      setOrder(isAsc ? 'desc' : 'asc')
      setOrderBy(property)
    }
  }

  const handleClick = (event: React.MouseEvent<unknown>, id: number) => {
    const selectedIndex = selected.indexOf(id)
    let newSelected: readonly number[] = []

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id)
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1))
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1))
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(selected.slice(0, selectedIndex), selected.slice(selectedIndex + 1))
    }

    setSelected(newSelected)
  }

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10))
    setPage(0)
  }

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0

  const visibleRows = React.useMemo(() => {
    const sortedRows = [...rows].sort((a: any, b: any) => {
      if (order === 'asc') {
        return a[orderBy] > b[orderBy] ? 1 : -1
      } else {
        return a[orderBy] < b[orderBy] ? 1 : -1
      }
    })

    return sortedRows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
  }, [order, orderBy, page, rowsPerPage, rows])

  return (
    <Box sx={{ width: '100%' }}>
      <Card sx={{ width: '100%', mb: 2 }}>
        <CardHeader title={'Studies'} />
        <CardContent>
          {userRole === Role.ADMIN
            ? 'Below is a list of all studies submitted by researchers. You can review their details and decide whether to grant them data access by clicking the eye button.'
            : 'Below is a list of ongoing studies requesting access to your data. Review their details to decide if you want to allow your data to be used in their research.'}
        </CardContent>
        <TableContainer>
          <Table sx={{ minWidth: 750 }} aria-labelledby='tableTitle'>
            <EnhancedTableHead order={order} orderBy={orderBy} onRequestSort={handleRequestSort} userRole={userRole} />

            <TableBody>
              {visibleRows.map((row, index) => {
                const isItemSelected = selected.includes(row.id)
                const labelId = `enhanced-table-checkbox-${index}`

                return (
                  <TableRow
                    hover
                    onClick={event => handleClick(event, row.id)}
                    role='checkbox'
                    aria-checked={isItemSelected}
                    tabIndex={-1}
                    key={row.id}
                    sx={{ cursor: 'pointer' }}
                  >
                    <TableCell component='th' id={labelId} scope='row' padding='normal'>
                      {row.title}
                    </TableCell>
                    <TableCell>
                      {row.summary.length > 50 ? `${row.summary.substring(0, 50)}...` : row.summary}
                    </TableCell>
                    <TableCell>{row.institution}</TableCell>
                    <TableCell>{new Date(row.createdAt).toLocaleDateString()}</TableCell>
                    {userRole === Role.PATIENT && 'isConsent' in row && (
                      <TableCell align='justify'>
                        <Chip
                          label={row.isConsent ? 'Consented' : 'Not Consented'}
                          color={getResearchParticipationChipColor(row.isConsent)}
                          variant='tonal'
                        />
                      </TableCell>
                    )}
                    {userRole === Role.ADMIN && 'updatedAt' in row && (
                      <TableCell align='justify'>{new Date(row.updatedAt).toLocaleDateString()}</TableCell>
                    )}
                    {userRole === Role.ADMIN && 'status' in row && (
                      <TableCell align='justify'>
                        <Chip
                          label={capitalize(row.status)}
                          color={getApplicationStatusChipColor(row.status)}
                          variant='tonal'
                        />
                      </TableCell>
                    )}
                    <TableCell align='justify'>
                      <IconButton
                        size='medium'
                        edge='end'
                        onClick={
                          userRole === Role.ADMIN && 'researcherId' in row
                            ? () => router.push(`/all-users/${row.researcherId}/study-application/${row.id}`)
                            : () => router.push(`/studies/${row.id}`)
                        }
                      >
                        <i className='ri-eye-line' />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                )
              })}
              {emptyRows > 0 && (
                <TableRow
                  style={{
                    height: 53 * emptyRows
                  }}
                >
                  <TableCell colSpan={userRole === Role.ADMIN ? 7 : 6} />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component='div'
          count={rows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Card>
    </Box>
  )
}
