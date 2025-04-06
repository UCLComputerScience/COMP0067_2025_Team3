'use client'

import { useEffect, useState } from 'react'

import { usePathname } from 'next/navigation'

import { Breadcrumbs, Typography } from '@mui/material'

import { validate as uuidValidate } from 'uuid'

import Link from '../Link'

import { getPatientFullNameByPatientId, getRecordDateBySubmissionId } from '@/actions/breadcrumb/breadcrumbActions'

const BreadcrumbDynamic = () => {
  const paths = usePathname()
  const [clientPath, setClientPath] = useState<string[] | []>([])
  const [userNames, setPatientNames] = useState<Record<string, string>>({})
  const [recordDates, setRecordDates] = useState<Record<string, string>>({})

  const formatLinkName = (linkName: string, index: number): string => {
    const isUUID = uuidValidate(linkName)

    // Check if it's a UUID and we have a display name for it
    if (isUUID) {
      const segment = clientPath[0]

      // Handle user/patient IDs at position 1
      if (index === 1) {
        if ((segment === 'all-users' || segment === 'all-patients') && userNames[linkName]) {
          return userNames[linkName]
        }

        if (segment === 'my-records' && recordDates[linkName]) {
          return recordDates[linkName]
        }
      }

      // Handle record IDs at position 3
      if (index === 3 && clientPath[2] === 'records' && recordDates[linkName]) {
        return recordDates[linkName]
      }
    }

    // Default formatting
    return linkName
      .replace(/-/g, ' ')
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ')
  }

  const fetchPatientData = async (patientId: string) => {
    try {
      const fullName = await getPatientFullNameByPatientId(patientId)

      setPatientNames(prev => ({
        ...prev,
        [patientId]: fullName
      }))
    } catch (error) {
      console.error('Error fetching patient data:', error)
    }
  }

  const fetchRecordData = async (submissionId: string) => {
    try {
      const recordDate = await getRecordDateBySubmissionId(submissionId)

      setRecordDates(prev => ({
        ...prev,
        [submissionId]: recordDate!
      }))
    } catch (error) {
      console.error('Error fetching record data:', error)
    }
  }

  useEffect(() => {
    const pathNames = paths.split('/').filter(path => path)

    setClientPath(pathNames)

    const checkAndFetchData = (index: number, type: 'user' | 'record') => {
      if (pathNames.length > index) {
        const potentialId = pathNames[index]

        if (uuidValidate(potentialId)) {
          if (type === 'user' && !userNames[potentialId]) {
            fetchPatientData(potentialId)
          } else if (type === 'record' && !recordDates[potentialId]) {
            fetchRecordData(potentialId)
          }
        }
      }
    }

    const segment = pathNames[0]

    if (segment === 'all-users' || segment === 'all-patients') {
      checkAndFetchData(1, 'user')

      if (segment === 'all-patients' && pathNames[2] === 'records') {
        checkAndFetchData(3, 'record')
      }
    } else if (segment === 'my-records') {
      checkAndFetchData(1, 'record')
    }
  }, [paths, userNames, recordDates])

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

        const itemLink = formatLinkName(link, index)

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
