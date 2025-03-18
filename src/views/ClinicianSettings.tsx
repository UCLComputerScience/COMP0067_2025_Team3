import Grid from '@mui/material/Grid2'

import AccountSettingForm from '@/components/account-setting-form'
import ChangePasswordForm from '@/components/ChangePasswordForm'

const ClincianSettings = () => {
  return (
    <Grid container spacing={4}>
      <AccountSettingForm />
      <ChangePasswordForm />
    </Grid>
  )
}

export default ClincianSettings
