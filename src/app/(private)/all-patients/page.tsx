'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { getSession } from 'next-auth/react'

import { ClinicianPatientList } from '@/components/ClinicianPatientList/ClinicianPatientList'

const Page: React.FC = () => {
  const router = useRouter()

  useEffect(() => {
    async function checkSession() {
      const session = await getSession()

      if (!session || session.user.role !== 'CLINICIAN') {
        router.push('/login')
      }
    }

    checkSession()
  }, [router])

  const [clinicianId, setClinicianId] = useState<string | null>(null)

  useEffect(() => {
    async function fetchClinicianId() {
      const session = await getSession()

      if (session) {
        console.log('clinicianId:', session.user.id)
        setClinicianId(session.user.id as string)
      }
    }

    fetchClinicianId()
  }, [])

  if (!clinicianId) {
    return <div className="p-4">Loading...</div>
  }

  return (
    <div className="p-4">
      <div className="border border-gray-200 rounded-lg shadow-sm">
        <ClinicianPatientList clinicianId={clinicianId} />
      </div>
    </div>
  )
}

export default Page
