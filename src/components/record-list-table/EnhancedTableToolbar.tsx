import { Toolbar, alpha, Typography, Button } from '@mui/material'
import { toast } from 'react-toastify'

interface EnhancedTableToolbarProps {
  numSelected: number
}
function EnhancedTableToolbar(props: EnhancedTableToolbarProps) {
  const { numSelected } = props
  return (
    <Toolbar
      sx={[
        {
          pl: { sm: 2 },
          pr: { xs: 1, sm: 1 }
        },
        numSelected > 0 && {
          bgcolor: theme => alpha(theme.palette.primary.main, theme.palette.action.activatedOpacity)
        }
      ]}
    >
      {numSelected > 0 ? (
        <Typography sx={{ flex: '1 1 100%', ml: 2 }} color='inherit' variant='subtitle1' component='div'>
          {numSelected} selected
        </Typography>
      ) : (
        <Typography sx={{ flex: '1 1 100%', ml: 2 }} variant='h6' id='tableTitle' component='div'>
          Records
        </Typography>
      )}

      {
        <>
          <Button
            sx={{
              whiteSpace: 'nowrap',
              minWidth: 'auto',
              display: 'flex',
              alignItems: 'center',
              mr: 2
            }}
            variant='outlined'
            color='primary'
            startIcon={<i className='ri-pie-chart-line' />}
            onClick={() => {
              if (numSelected > 3) toast.warn('You can display a maximum of 3 questionnaire data.')
            }}
          >
            Display Data
          </Button>
          <Button
            sx={{
              whiteSpace: 'nowrap',
              minWidth: 'auto',
              display: 'flex',
              alignItems: 'center',
              mr: 2
            }}
            variant='contained'
            color='primary'
            startIcon={<i className='ri-download-2-line' />}
          >
            Download Report
          </Button>
        </>
      }
    </Toolbar>
  )
}

export default EnhancedTableToolbar
