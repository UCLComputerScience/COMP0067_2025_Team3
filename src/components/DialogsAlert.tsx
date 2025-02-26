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
  dialogTitle: string
  dialogText: string
  confirmButtonLabel?: string
  cancelButtonLabel?: string
  onConfirm?: () => void
}

const DialogsAlert = ({
  triggerButtonLabel: buttonText,
  dialogTitle,
  dialogText = '',
  cancelButtonLabel = 'Disagree',
  confirmButtonLabel = 'agree',
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
      <Button variant='outlined' onClick={handleClickOpen}>
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
          <Button onClick={handleConfirm} variant='contained'>
            {confirmButtonLabel}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

export default DialogsAlert
