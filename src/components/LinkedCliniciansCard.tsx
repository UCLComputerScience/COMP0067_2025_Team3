'use client'

import { useState, useEffect } from 'react'

import { useRouter } from 'next/navigation'

import { useSession } from 'next-auth/react'
import {
  Button,
  Card,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Switch,
  Chip,
  CardHeader,
  CardActions,
  CircularProgress,
} from '@mui/material'

import { toast } from 'react-toastify'

import DialogsAlert from '@/components/DialogsAlert'
import { saveShareData, deleteClinician } from '@/actions/patientSettings/userActions'
import { getPatientClinicians } from '@/actions/patient/userActions'

export interface ClinicianData {
  id: string
  firstName: string
  lastName: string
  institution: string
  email: string
  profession: string
  status: string
  agreedToShareData: boolean
}

interface Props {
  className?: string
}

const LinkedCliniciansCard = ({ className = '' }: Props) => {
  const router = useRouter()
  const { data: session } = useSession()
  const [cliniciansData, setCliniciansData] = useState<ClinicianData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchClinicians = async () => {
      if (!session?.user?.id) {
        setError('User not authenticated')
        setLoading(false)

        return
      }

      try {
        setLoading(true)
        const result = await getPatientClinicians(session.user.id)

        if (result.success) {
          setCliniciansData(result.data || [])
        } else {
          setError(result.message || 'Failed to fetch clinicians')
        }
      } catch (error) {
        console.error('Error fetching clinicians:', error)
        setError('An unexpected error occurred while fetching clinicians')
      } finally {
        setLoading(false)
      }
    }

    fetchClinicians()
  }, [session?.user?.id])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Connected':
        return 'success'
      case 'Pending':
        return 'warning'
      case 'Invited':
        return 'primary'
      default:
        return 'primary'
    }
  }

  const handleClinicianSwitch = async (clinicianId: string, newValue: boolean) => {
    if (!session?.user?.id) return

    setCliniciansData(prevClinicians =>
      prevClinicians.map(clinician =>
        clinician.id === clinicianId ? { ...clinician, agreedToShareData: newValue } : clinician
      )
    )

    try {
      const result = await saveShareData(clinicianId, newValue, session.user.id)

      if (!result.success) {
        throw new Error('Failed to save clinician data share consent')
      } else {
        toast.success('Save clinician data share consent')
      }
    } catch (error) {
      console.error('Error saving clinician data consent:', error)
      setCliniciansData(prevClinicians =>
        prevClinicians.map(clinician =>
          clinician.id === clinicianId ? { ...clinician, agreedToShareData: !newValue } : clinician
        )
      )
    }
  }

  const handleDelete = async (clinicianId: string) => {
    if (!session?.user?.id) return

    const prevClinicians = [...cliniciansData]

    setCliniciansData(prevClinicians.filter(clinician => clinician.id !== clinicianId))

    try {
      const result = await deleteClinician(clinicianId, session.user.id)

      if (!result.success) {
        throw new Error('Failed to delete clinician')
      }
    } catch (error) {
      console.error('Error deleting clinician:', error)
      setCliniciansData(prevClinicians)
    }
  }

  if (loading) {
    return (
      <Card className={`w-full ${className}`}>
        <CardHeader title='Linked Clinicians' />
        <CardContent sx={{ display: 'flex', justifyContent: 'center', padding: 4 }}>
          <CircularProgress />
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card className={`w-full ${className}`}>
        <CardHeader title='Linked Clinicians' />
        <CardContent>
          <Typography color='error'>{error}</Typography>
          <Button variant='outlined' color='primary' sx={{ mt: 2 }} onClick={() => router.refresh()}>
            Retry
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className={`w-full ${className}`}>
      <CardHeader title='Linked Clinicians' />
      <CardContent>
        <TableContainer component={Card} sx={{ border: 'none', boxShadow: 0 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>USER</TableCell>
                <TableCell>EMAIL</TableCell>
                <TableCell>PROFESSION</TableCell>
                <TableCell>STATUS</TableCell>
                <TableCell>DATA ACCESS</TableCell>
                <TableCell></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {cliniciansData.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} style={{ textAlign: 'center', padding: '20px' }}>
                    You don&apos;t have clinicians linked yet. Please add a clinician below.
                  </TableCell>
                </TableRow>
              ) : (
                cliniciansData.map((clinician, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <div>
                        <i className='ri-hospital-line' style={{ color: 'orange' }}></i>
                        <Typography variant='body1'>
                          {clinician.firstName} {clinician.lastName}
                        </Typography>
                      </div>
                      <Typography variant='body2' color='secondary'>
                        {clinician.institution}
                      </Typography>
                    </TableCell>
                    <TableCell>{clinician.email}</TableCell>
                    <TableCell>{clinician.profession}</TableCell>
                    <TableCell>
                      <Chip label={clinician.status} variant='tonal' color={getStatusColor(clinician.status)} />
                    </TableCell>
                    <TableCell>
                      <Switch
                        color='success'
                        checked={!!clinician.agreedToShareData}
                        onChange={e => handleClinicianSwitch(clinician.id, e.target.checked)}
                      />
                    </TableCell>
                    <TableCell>
                    <DialogsAlert
                          triggerButtonLabel='Delete'
                          triggerButtonColor = 'secondary'
                          dialogTitle="Confirm"
                          dialogText="Are you sure you want to delete this relationship with a clinician?"
                          confirmButtonLabel="Yes, Delete"
                          cancelButtonLabel="Cancel"
                          onConfirm={() => handleDelete(clinician.id)}
                        />
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>

        <CardActions>
          <Button variant='contained' color='primary' onClick={() => router.push('/my-profile/add-clinician')}>
            Add Clinician
          </Button>
        </CardActions>
      </CardContent>
    </Card>
  )
}

export default LinkedCliniciansCard
