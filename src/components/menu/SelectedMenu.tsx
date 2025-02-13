'use client'
// React Imports
import { useState } from 'react'
import type { MouseEvent } from 'react'

// MUI Imports
import List from '@mui/material/List'
import Menu from '@mui/material/Menu'
import ListItem from '@mui/material/ListItem'
import MenuItem from '@mui/material/MenuItem'
// import ListItemText from '@mui/material/ListItemText'
import ListItemButton from '@mui/material/ListItemButton'
import { Typography } from '@mui/material'

const demoOptions = [
  'Show some love to MUI',
  'Show all notification content',
  'Hide sensitive notification content',
  'Hide all notification content'
]

interface Props {
  options?: string[]
}

const MenuSelected = ({ options = demoOptions }: Props) => {
  // States
  const [selectedIndex, setSelectedIndex] = useState<number>(0)
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null)

  const handleClickListItem = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleMenuItemClick = (event: MouseEvent<HTMLElement>, index: number) => {
    setAnchorEl(null)
    setSelectedIndex(index)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  return (
    <>
      <List component='nav' className='p-0' aria-label='Device settings'>
        <ListItem
          disablePadding
          aria-haspopup='true'
          aria-controls='lock-menu'
          onClick={handleClickListItem}
          aria-label='Total Trends'
        >
          <ListItemButton>
            <Typography variant='h5'>
              {selectedIndex === 0 ? 'Total Trend' : `Total Trend of ${options[selectedIndex]}`}
            </Typography>
          </ListItemButton>
        </ListItem>
      </List>
      <Menu id='lock-menu' anchorEl={anchorEl} keepMounted open={Boolean(anchorEl)} onClose={handleClose}>
        {options.map((option, index) => (
          <MenuItem
            key={option}
            selected={index === selectedIndex}
            onClick={event => handleMenuItemClick(event, index)}
          >
            {option}
          </MenuItem>
        ))}
      </Menu>
    </>
  )
}

export default MenuSelected
