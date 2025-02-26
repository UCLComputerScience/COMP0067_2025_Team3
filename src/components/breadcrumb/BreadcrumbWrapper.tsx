'use client'

import dynamic from 'next/dynamic'

// Load BreadcrumbDynamic only on the client
const BreadcrumbDynamic = dynamic(() => import('./BreadcrumbDynamic'), { ssr: false })

const BreadcrumbWrapper = () => {
  return <BreadcrumbDynamic />
}

export default BreadcrumbWrapper
