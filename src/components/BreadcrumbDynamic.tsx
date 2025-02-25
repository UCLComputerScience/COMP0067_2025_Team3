'use client'

import { Breadcrumbs, Typography } from '@mui/material'
import { usePathname } from 'next/navigation'
import Link from './Link'

const BreadcrumbDynamic = () => {
  const paths = usePathname()
  const pathNames = paths.split('/').filter(path => path)

  const formatLinkName = (linkName: string): string => {
    const cleanedName = linkName.replace(/-/g, ' ') // Replace all hyphens with spaces
    return cleanedName.charAt(0).toUpperCase() + cleanedName.slice(1)
  }

  console.log(pathNames)

  if (pathNames.length === 1 && pathNames[0] === 'home') return null

  return (
    <Breadcrumbs aria-label='breadcrumb' sx={{ mb: 4 }}>
      <Typography sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <i className='ri-home-smile-line' style={{ color: 'grey' }} />
        <Link href={'/home'}>Home</Link>
      </Typography>
      {pathNames.map((link, index) => {
        let href = `/${pathNames.slice(0, index + 1).join('/')}`
        let itemLink = formatLinkName(link)

        if (paths === href) {
          return <Typography key={index}>{itemLink}</Typography>
        }
        return (
          <Typography key={index}>
            <Link href={href}>{itemLink}</Link>
          </Typography>
        )
      })}
    </Breadcrumbs>
  )
}

export default BreadcrumbDynamic
