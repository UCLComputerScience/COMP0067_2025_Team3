//TO DO: pagination

'use client'

// React imports
import { useState} from 'react'

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

  // Filter users based on selected filters and search query
  const filteredUsers = users.filter((user) => {
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
        return <i className='ri-user-3-line' style={{color: '#66cc66'}}></i> //'green' would work here but its much darker 
      case 'CLINICIAN':
        return <i className='ri-hospital-line' style={{ color: 'orange' }}></i>
      case 'RESEARCHER':
        return <i className= 'ri-pie-chart-2-line' style={{color: '#66b2ff'}}></i> //'blue' would work here but its much darker
      case 'ADMIN':
        return <i className='ri-folder-settings-line' style={{color: 'black'}}></i>
    }
  }

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
            onChange={(e) => setRoleFilter(e.target.value)}
            id='role'
            labelId='role-label'
          >
            <MenuItem value=''>
              <em>Select</em>
            </MenuItem>
            <MenuItem value='PATIENT'>Patient</MenuItem>
            <MenuItem value='CLINICIAN'>Clinician</MenuItem>
            <MenuItem value='RESEARCHER'>Researcher</MenuItem>
            <MenuItem value='ADMIN'>Admin</MenuItem>
          </Select>
        </FormControl>
        <FormControl fullWidth>
          <InputLabel id='status'>Status</InputLabel>
          <Select 
            label='status'
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
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
          variant="outlined" 
          placeholder="Search User" 
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <i className='ri-search-line' /> 
              </InputAdornment>
            ),
          }}
          size="small" 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </Box>
      {/* Users List*/}
        <Box sx={{display: 'flex', gap:2, mt: 5}}>
        <TableContainer component={Paper}>
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
                filteredUsers.map((u, index) => (
                  <TableRow key={index}>
                    <TableCell>{u.firstName} {u.lastName}</TableCell>
                    <TableCell>{u.email}</TableCell>
                    <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        {getRoleIcon(u.role)}
                        <Typography variant="body2">{u.role}</Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip label={u.status} variant='tonal' color={getStatusColor(u.status)} />
                    </TableCell>
                    <TableCell>
                      <IconButton
                        color='secondary' 
                        onClick={() => router.push(`/all-users/${u.id}`)}
                        >
                        <i className='ri-pencil-line' />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
        </Box>
      </Card>
      </Box>


    //   {users.map((u) => (
    //     <div key={u.id}> {/* Fix: Use u.id instead of array index */}
    //       <Link href={`/all-users/${u.id}`} passHref>
    //         <Button>
    //           {u.firstName} {u.lastName}
    //         </Button>
    //       </Link>
    //     </div>
    //   ))}
    // </>
  )
}

export default UsersList