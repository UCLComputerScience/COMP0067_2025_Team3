import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'

interface Props {
  keys: string[]
  colors: string[]
}

const CustomLegend = ({ keys, colors }: Props) => {
  return (
    <div className='flex justify-center mbe-4'>
      {keys.map((key, index) => (
        <Box
          key={key}
          className='flex items-center mie-5 gap-1.5'
          sx={{ '& i': { color: colors[index % colors.length] } }}
        >
          <i className='ri-circle-fill text-xs' />
          <Typography variant='body2'>{key}</Typography>
        </Box>
      ))}
    </div>
  )
}

export default CustomLegend
