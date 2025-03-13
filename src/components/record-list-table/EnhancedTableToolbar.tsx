import { Toolbar, alpha, Typography, Button } from '@mui/material'

interface EnhancedTableToolbarProps {
  numSelected: number
  handleDisplayDataOnClick: (numSelected: number) => void
}

function EnhancedTableToolbar(props: EnhancedTableToolbarProps) {
  const { numSelected, handleDisplayDataOnClick } = props

  
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
            onClick={() => handleDisplayDataOnClick(numSelected)}
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
