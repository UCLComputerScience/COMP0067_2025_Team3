// Third-party Imports
import 'react-perfect-scrollbar/dist/css/styles.css'

// Type Imports
import type { ChildrenType } from '@core/types'

// Context Imports

// Component Imports
import Providers from '@components/Providers'
import BlankLayout from '@layouts/BlankLayout'
import FrontLayout from '@components/layout/front-pages'

// Util Imports
import { getSystemMode } from '@core/utils/serverHelpers'

// Style Imports
import '@/app/globals.css'

// Generated Icon CSS Imports
import '@assets/iconify-icons/generated-icons.css'

const Layout = async ({ children }: ChildrenType) => {
  // Vars
  const systemMode = await getSystemMode()

  return (
    <Providers direction='ltr'>
      <BlankLayout systemMode={systemMode}>
        <FrontLayout>{children}</FrontLayout>
      </BlankLayout>
    </Providers>
  )
}

export default Layout
