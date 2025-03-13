'use client'

import { useEffect, useState } from 'react'

import { usePathname } from 'next/navigation'

import { Breadcrumbs, Typography } from '@mui/material'

import Link from '../Link'


const BreadcrumbDynamic = () => {
  const paths = usePathname()
  const [clientPath, setClientPath] = useState<string[] | []>([])

  const formatLinkName = (linkName: string): string => {
    return linkName
      .replace(/-/g, ' ')
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ')
  }

  useEffect(() => {
    const pathNames = paths.split('/').filter(path => path)

    setClientPath(pathNames)
  }, [paths])

  // debug
  // console.log('pathName:', pathNames)
  // console.log('paths:', paths)

  if (clientPath.length === 0) return null
  if (clientPath.length === 1 && clientPath[0] === 'home') return null

  return (
    <Breadcrumbs aria-label='breadcrumb' sx={{ mb: 4 }}>
      <Typography sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <i className='ri-home-smile-line' style={{ color: 'grey' }} />
        <Link href={'/home'}>Home</Link>
      </Typography>

      {clientPath.map((link, index) => {
        const href = `/${clientPath.slice(0, index + 1).join('/')}`
        const itemLink = formatLinkName(link)

        if (link === 'study-application') {
          return (
            <Typography key={index} style={{ color: 'disabled ' }}>
              {itemLink}
            </Typography>
          )
        }

        if (paths === href) {
          return <Typography key={index}>{itemLink}</Typography>
        }

        
return (
          <Link href={href} key={index}>
            {itemLink}
          </Link>
        )
      })}
    </Breadcrumbs>
  )
}

export default BreadcrumbDynamic
