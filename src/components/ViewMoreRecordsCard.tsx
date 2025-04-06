'use client'

import { useRouter } from 'next/navigation'

import { Button, Card, CardActions, CardHeader } from '@mui/material'

interface Props {
  patientId: string
}

const ViewMoreRecordsCard = ({ patientId }: Props) => {
  const router = useRouter()

  
return (
    <Card>
      <CardHeader title={'See more records'} />
      <CardActions>
        <Button
          variant='contained'
          className='w-full'
          endIcon={<i className='ri-arrow-right-line' />}
          onClick={() => {
            router.push(`/all-patients/${patientId}/records/`)
          }}
        >
          Go to record list
        </Button>
      </CardActions>
    </Card>
  )
}

export default ViewMoreRecordsCard
