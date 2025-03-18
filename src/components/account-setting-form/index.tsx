'use client'

import { useEffect, useState } from 'react'

import { useSession } from 'next-auth/react'
import { Role } from '@prisma/client'

import PatientAccountSettingForm from './PatientAccountSettingForm'
import ClinicianAccountSettingForm from './ClinicianAccountSettingForm'
import ResearcherAccountSettingForm from './ResearcherAccountSettingForm'
import AdminAccountSettingForm from './AdminAccountSettingForm'

const AccountSettingForm = () => {
  const { data: session } = useSession()
  const [userRole, setUserRole] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (session?.user?.role) {
      setUserRole(session.user.role)
    }

    setLoading(false)
  }, [session])

  if (loading) {
    return <div>Loading...</div>
  }

  switch (userRole) {
    case Role.PATIENT:
      return <PatientAccountSettingForm />
    case Role.CLINICIAN:
      return <ClinicianAccountSettingForm />
    case Role.RESEARCHER:
      return <ResearcherAccountSettingForm />
    case Role.ADMIN:
      return <AdminAccountSettingForm />
    default:
      return <div>Unknown user role</div>
  }
}

export default AccountSettingForm
