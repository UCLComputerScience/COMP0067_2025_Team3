import { Typography, Chip } from '@mui/material'
import Grid from '@mui/material/Grid2'
import { capitalize } from 'lodash'
import { getChipColor } from '../study-list'

const GridRow = ({ label, value }: { label: string; value: string }) => {
  return (
    <>
      <Grid size={4}>
        <Typography className='font-medium'>{label}</Typography>
      </Grid>
      <Grid size={8}>
        {label.includes('status') ? (
          <Chip variant='tonal' color={getChipColor(value)} label={capitalize(value)} size='small' />
        ) : (
          <Typography>{value}</Typography>
        )}
      </Grid>
    </>
  )
}

export default GridRow
