// React Imports
import { useState } from 'react'

// MUI Imports
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import DialogContentText from '@mui/material/DialogContentText'

interface Props {
  triggerButtonLabel: string
  triggerButtonColor?: 'primary' | 'secondary' | 'inherit' | 'success' | 'error' | 'info' | 'warning'
  triggerButtonVariant?: 'text' | 'outlined' | 'contained'
  dialogTitle: string
  dialogText: string
  confirmButtonLabel?: string
  confirmButtonColor?: 'primary' | 'secondary' | 'inherit' | 'success' | 'error' | 'info' | 'warning'
  confirmButtonVariant?: 'text' | 'outlined' | 'contained'
  cancelButtonLabel?: string
  onConfirm?: () => void
}

const DialogsAlert = ({
  triggerButtonLabel: buttonText,
  triggerButtonColor = 'primary',
  triggerButtonVariant = 'outlined',
  dialogTitle,
  dialogText = '',
  cancelButtonLabel = 'Disagree',
  confirmButtonLabel = 'agree',
  confirmButtonColor = 'primary',
  confirmButtonVariant = 'contained',
  onConfirm
}: Props) => {
  // States
  const [open, setOpen] = useState<boolean>(false)

  const handleClickOpen = () => setOpen(true)

  const handleClose = () => setOpen(false)

  const handleConfirm = () => {
    if (onConfirm) {
      onConfirm()
    }
    handleClose()
  }

  return (
    <>
      <Button variant={triggerButtonVariant} color={triggerButtonColor} onClick={handleClickOpen}>
        {buttonText}
      </Button>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby='alert-dialog-title'
        aria-describedby='alert-dialog-description'
        closeAfterTransition={false}
      >
        <DialogTitle id='alert-dialog-title'>{dialogTitle}</DialogTitle>
        <DialogContent>
          <DialogContentText id='alert-dialog-description'>{dialogText}</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} variant='outlined' color='secondary'>
            {cancelButtonLabel}
          </Button>
          <Button onClick={handleConfirm} variant={confirmButtonVariant} color={confirmButtonColor}>
            {confirmButtonLabel}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

export default DialogsAlert
