import { Typography, Chip, Button } from '@mui/material'
import { capitalize } from 'lodash'

import type { StudyListType} from '.';
import { getChipColor } from '.'
import DialogsAlert from '../DialogsAlert'
import Link from '../Link'
import { formatDate } from '@/utils/dateUtils'

const StudyItem = ({ item, handleDelete }: { item: StudyListType; handleDelete: (id: number) => Promise<void> }) => {
  return (
    <div className='flex flex-col md:flex-row md:justify-between gap-4 p-4 rounded bg-actionHover'>
      {/* Left Section - Study Details */}
      <div className='flex flex-col gap-2 p-4'>
        <div className='flex items-center gap-3'>
          <Typography variant='h6'>{item.title}</Typography>
          <Chip
            variant='tonal'
            color={getChipColor(item.applicationStatus)}
            label={capitalize(item.applicationStatus)}
            size='small'
          />
        </div>
        <div className='flex items-center gap-3'>
          <Typography className='font-medium'>Institution: {item.institution}</Typography>
        </div>
        <div className='flex flex-col gap-1'>
          <Typography>Start Date: {formatDate(item.startDate)}</Typography>
          <Typography>End Date: {formatDate(item.endDate)}</Typography>
        </div>
        <div className='flex flex-col gap-1 mt-2'>
          <Typography color='text.disabled'>{`Created on ${item.createdAt}`}</Typography>
          <Typography color='text.disabled'>{`Last Updated on ${item.lastUpdated}`}</Typography>
        </div>
      </div>

      {/* Right Section - Buttons (Responsive) */}
      <div className='flex flex-wrap md:flex-nowrap items-start gap-2 ml-4 md:ml-auto'>
        <Link href={`/my-profile/study-application/${item.id}`}>
          <Button variant='outlined' color='primary'>
            Details
          </Button>
        </Link>
        <DialogsAlert
          triggerButtonLabel='Delete'
          triggerButtonColor='error'
          dialogTitle={`Confirm delete study: ${item.title.toLowerCase()}`}
          dialogText='Delete the application will (going to check what will happen)'
          confirmButtonLabel='Yes, Delete'
          confirmButtonColor='error'
          cancelButtonLabel='Cancel'
          onConfirm={() => handleDelete(item.id)}
        />
      </div>
    </div>
  )
}

export default StudyItem
