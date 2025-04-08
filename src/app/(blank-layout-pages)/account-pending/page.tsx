// Component Imports
import AccountPending from '@/views/AccountPending'

// Server Action Imports
import { getServerMode } from '@core/utils/serverHelpers'

const Page = async () => {
  const mode = await getServerMode()

  return <AccountPending mode={mode} />
}

export default Page
