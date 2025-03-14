import Grid from '@mui/material/Grid2'

import AccountSettingForm from '@/components/AccountSettingForm'
import ChangePasswordForm from '@/components/ChangePasswordForm'

const AdminSettings = () => {
  return (
    <Grid container spacing={4}>
      <AccountSettingForm />
      <ChangePasswordForm />
    </Grid>
  )
}

export default AdminSettings
