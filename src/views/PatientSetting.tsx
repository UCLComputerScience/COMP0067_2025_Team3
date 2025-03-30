// MUI
import Grid from '@mui/material/Grid2'

// Components
import AccountSettingForm from '@/components/account-setting-form'
import ChangePasswordForm from '@/components/ChangePasswordForm'
import DataPrivacyForm from '@/components/DataPrivacyForm'
import LinkedCliniciansCard from '@/components/LinkedCliniciansCard'

const PatientSetting = () => {
  return (
    <Grid container spacing={4}>
      <AccountSettingForm />
      <ChangePasswordForm />
      <LinkedCliniciansCard />
      <DataPrivacyForm />
    </Grid>
  )
}

export default PatientSetting
