'use client'

import * as React from 'react'

// React imports
import { useState } from 'react'

import { useRouter } from 'next/navigation'

import {
  Box,
  Card,
  TextField,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Paper,
  Chip,
  FormControl,
  InputAdornment,
  InputLabel,
  Select,
  MenuItem,
  IconButton
} from '@mui/material'

// User type import
import type { Users } from '@/app/(private)/all-users/page'

// Define props correctly
interface Props {
  users: Users[]
}

const UsersList = ({ users }: Props) => {
  const router = useRouter()

  // State for filters and search
  const [roleFilter, setRoleFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [page, setPage] = React.useState(0)
  const [rowsPerPage, setRowsPerPage] = React.useState(5)

  // Filter users based on selected filters and search query
  const filteredUsers = users.filter(user => {
    return (
      (roleFilter ? user.role === roleFilter : true) &&
      (statusFilter ? user.status === statusFilter : true) &&
      (searchQuery ? `${user.firstName} ${user.lastName}`.toLowerCase().includes(searchQuery.toLowerCase()) : true)
    )
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return 'success'
      case 'PENDING':
        return 'warning'
      case 'INACTIVE':
        return 'secondary'
      default:
        return 'primary'
    }
  }

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'PATIENT':
        return <i className='ri-user-3-line' style={{ color: '#66cc66' }}></i> //'green' would work here but its much darker
      case 'CLINICIAN':
        return <i className='ri-hospital-line' style={{ color: 'orange' }}></i>
      case 'RESEARCHER':
        return <i className='ri-pie-chart-2-line' style={{ color: '#66b2ff' }}></i> //'blue' would work here but its much darker
      // case 'ADMIN':
      //   return <i className='ri-folder-settings-line' style={{ color: 'black' }}></i>
    }
  }

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10))
    setPage(0)
  }

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - filteredUsers.length) : 0

  const visibleRows = React.useMemo(
    () => filteredUsers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage),
    [page, rowsPerPage, filteredUsers]
  )


  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
      <Card sx={{ width: 2000, p: 3 }}>
        {/* Filters */}
        <Typography variant='body2'>Filters</Typography>
        <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
          <FormControl fullWidth>
            <InputLabel id='role'>Role</InputLabel>
            <Select
              label='role'
              value={roleFilter}
              onChange={e => setRoleFilter(e.target.value)}
              id='role'
              labelId='role-label'
            >
              <MenuItem value=''>
                <em>Select</em>
              </MenuItem>
              <MenuItem value='PATIENT'>Patient</MenuItem>
              <MenuItem value='CLINICIAN'>Clinician</MenuItem>
              <MenuItem value='RESEARCHER'>Researcher</MenuItem>
            </Select>
          </FormControl>
          <FormControl fullWidth>
            <InputLabel id='status'>Status</InputLabel>
            <Select
              label='status'
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
              id='status'
              labelId='status'
            >
              <MenuItem value=''>
                <em>Select</em>
              </MenuItem>
              <MenuItem value='PENDING'>Pending</MenuItem>
              <MenuItem value='ACTIVE'>Active</MenuItem>
              <MenuItem value='INACTIVE'>Inactive</MenuItem>
            </Select>
          </FormControl>
        </Box>
        {/* Search User  */}
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 5 }}>
          <TextField
            variant='outlined'
            placeholder='Search User'
            InputProps={{
              startAdornment: (
                <InputAdornment position='start'>
                  <i className='ri-search-line' />
                </InputAdornment>
              )
            }}
            size='small'
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
        </Box>
        {/* Users List*/}
        <Box sx={{ display: 'flex', gap: 2, mt: 5 }}>
          <TableContainer component={Paper} sx={{ boxShadow: 0, mb: 6 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>USER</TableCell>
                  <TableCell>EMAIL</TableCell>
                  <TableCell>ROLE</TableCell>
                  <TableCell>STATUS</TableCell>
                  <TableCell></TableCell>
                  <TableCell></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredUsers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} style={{ textAlign: 'center', padding: '20px' }}>
                      {/* eslint-disable-next-line react/no-unescaped-entities */}
                      No users match the search criteria.
                    </TableCell>
                  </TableRow>
                ) : (
                  visibleRows.map((u, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        {u.firstName} {u.lastName}
                      </TableCell>
                      <TableCell>{u.email}</TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          {getRoleIcon(u.role)}
                          <Typography variant='body2'>{u.role}</Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Chip label={u.status} variant='tonal' color={getStatusColor(u.status)} />
                      </TableCell>
                      <TableCell>
                        <IconButton color='secondary' onClick={() => router.push(`/all-users/${u.id}`)}>
                          <i className='ri-pencil-line' />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))
                )}
                {emptyRows > 0 && (
                  <TableRow
                    style={{
                      height: 53 * emptyRows
                    }}
                  >
                    <TableCell colSpan={6} />
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 5 }}>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component='div'
            count={filteredUsers.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Box>
      </Card>
    </Box>
  )
}

export default UsersList
