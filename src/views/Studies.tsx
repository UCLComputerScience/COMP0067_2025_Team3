// components
import AllStudyListTable from '@/components/all-study-list-table'

// auth
import { getServerSession } from 'next-auth'
import { authOptions } from '@/libs/auth'

// prisma
import { ApplicationStatus, Role } from '@prisma/client'

// server actions
import { getAllApplications, getAllApprovedApplications } from '@/actions/application/applicationActions'

export interface PatientApplicationListType {
  id: number
  title: string
  summary: string
  institution: string
  createdAt: Date | string
  updatedAt: Date | string
  isConsent: boolean
}

export interface ResearcherApplicationListType {
  id: number
  title: string
  summary: string
  institution: string
  status: ApplicationStatus | string
  createdAt: Date | string
  updatedAt: Date | string
  researcherId: string
}

const Studies = async () => {
  const session = await getServerSession(authOptions)
  const userRole = session?.user.role

  let rawApplications

  if (userRole === Role.ADMIN) {
    rawApplications = await getAllApplications()
    const adminApplications = (rawApplications || []).map(app => ({
      id: app.id || 0,
      title: app.title || '',
      summary: app.summary || '',
      institution: app.institution || '',
      status: app.status || 'Unknown',
      createdAt: app.createdAt || new Date(),
      updatedAt: app.updatedAt || new Date(),
      researcherId: app.userId || ''
    })) as ResearcherApplicationListType[]

    return <AllStudyListTable rows={adminApplications} userRole={Role.ADMIN} />
  } else if (userRole === Role.PATIENT) {
    rawApplications = await getAllApprovedApplications(session?.user.id)
    const patientApplications = (rawApplications || []).map(app => ({
      id: app.id || 0,
      title: app.title || '',
      summary: app.summary || '',
      institution: app.institution || '',
      createdAt: app.createdAt || new Date(),
      updatedAt: app.updatedAt || new Date(),
      isConsent: app.isConsent || false
    })) as PatientApplicationListType[]

    console.log(patientApplications)

    return <AllStudyListTable rows={patientApplications} userRole={Role.PATIENT} />
  }
}

export default Studies
