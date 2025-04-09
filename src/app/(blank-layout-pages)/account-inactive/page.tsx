// Component Imports
import AccountInactive from '@/views/AccountInactive'

// Server Action Imports
import { getServerMode } from '@core/utils/serverHelpers'

const Page = async () => {
  const mode = await getServerMode()

  return <AccountInactive mode={mode} />
}

export default Page
