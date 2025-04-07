// Component Imports
import ForgotPassword from '@views/ForgotPassword'

// Server Action Imports
import { getServerMode } from '@core/utils/serverHelpers'

const ForgotPage = async () => {
  // Vars
  const mode = await getServerMode()

  return <ForgotPassword mode={mode} />
}

export default ForgotPage
