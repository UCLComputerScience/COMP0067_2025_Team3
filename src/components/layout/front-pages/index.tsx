// Type Imports
import type { ChildrenType } from '@core/types'

// Component Imports
import Footer from '@components/layout/front-pages/Footer'
import Header from '../horizontal/Header'

// Util Imports
import { frontLayoutClasses } from '@layouts/utils/layoutClasses'

const FrontLayout = async ({ children }: ChildrenType) => {
  // Vars
  return (
    <div className={frontLayoutClasses.root}>
      <Header />
      {children}
      <Footer />
    </div>
  )
}

export default FrontLayout
