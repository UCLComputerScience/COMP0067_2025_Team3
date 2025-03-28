import { TableHead, TableRow, TableCell, Checkbox, TableSortLabel, Box } from '@mui/material'
import { visuallyHidden } from '@mui/utils'
import { Order } from '.'
import { Role } from '@prisma/client'

interface HeadCell {
  disablePadding: boolean
  id: string
  label: string
  numeric: boolean
  roles?: Role[] // Define which roles this column is visible for
}

// Define all possible columns
const allHeadCells: readonly HeadCell[] = [
  {
    id: 'title',
    numeric: false,
    disablePadding: true,
    label: 'Title'
    // No roles specified means visible to all roles
  },
  {
    id: 'summary',
    numeric: false,
    disablePadding: false,
    label: 'Summary'
  },
  {
    id: 'institution',
    numeric: false,
    disablePadding: false,
    label: 'Institution'
  },
  {
    id: 'createdAt',
    numeric: false,
    disablePadding: false,
    label: 'Created At'
  },
  {
    id: 'updatedAt',
    numeric: false,
    disablePadding: false,
    label: 'Updated At',
    roles: [Role.ADMIN] // Only visible to ADMIN role
  },
  {
    id: 'status',
    numeric: false,
    disablePadding: false,
    label: 'Status',
    roles: [Role.ADMIN] // Only visible to ADMIN role
  },
  {
    id: 'researchParticipation',
    numeric: false,
    disablePadding: false,
    label: 'Research Participation',
    roles: [Role.PATIENT] // Only visible to ADMIN role
  },
  {
    id: 'action',
    numeric: false,
    disablePadding: false,
    label: 'Action'
  }
]

interface EnhancedTableProps {
  onRequestSort: (event: React.MouseEvent<unknown>, property: string) => void
  order: Order
  orderBy: string
  userRole: Role
}

export function EnhancedTableHead(props: EnhancedTableProps) {
  const { order, orderBy, onRequestSort, userRole } = props

  // Filter headCells based on user role
  const headCells = allHeadCells.filter(cell => !cell.roles || cell.roles.includes(userRole))

  const createSortHandler = (property: string) => (event: React.MouseEvent<unknown>) => {
    onRequestSort(event, property)
  }

  return (
    <TableHead>
      <TableRow>
        {headCells.map(headCell => (
          <TableCell
            key={headCell.id}
            padding={'normal'}
            sortDirection={orderBy === headCell.id ? order : false}
            variant='head'
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : 'asc'}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label.toUpperCase()}
              {orderBy === headCell.id ? (
                <Box component='span' sx={visuallyHidden}>
                  {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                </Box>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  )
}
