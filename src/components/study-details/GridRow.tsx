// MUI
import { Typography, Chip } from '@mui/material'
import Grid from '@mui/material/Grid2'

// third-party import
import { capitalize } from 'lodash'

// helper function
import { getChipColor } from '../study-list'

const dataAccessToRow = (values: string[]) => {
  return values.map((label, key) => {
    return (
      <div key={key} className='flex items-center gap-2.5 text-textSecondary'>
        <i className='ri-checkbox-blank-circle-fill text-[6px]' />
        {label}
      </div>
    )
  })
}

const GridRow = ({ label, value, color }: { label: string; value: string; color?: string }) => {
  return (
    <>
      <Grid size={4}>
        <Typography className='font-medium'>{label}</Typography>
      </Grid>
      <Grid size={8}>
        {label.includes('status') ? (
          <Chip variant='tonal' color={getChipColor(value)} label={capitalize(value)} size='small' />
        ) : label.toLowerCase().includes('access') && label.toLowerCase().includes('requested') ? (
          <>{dataAccessToRow(value.split(','))}</>
        ) : (
          <Typography color={color ? color : ''}>{value}</Typography>
        )}
      </Grid>
    </>
  )
}

export default GridRow
