import { Card, CardHeader, CardContent, Typography } from '@mui/material'
import Grid from '@mui/material/Grid2'

import { DATA_ACCESS_ATTRIBUTES } from '@/constants'

import LabeledCheckbox from './LabeledCheckbox'
import { formatDate } from '@/utils/dateUtils'
import { reverseMapDataAccessFields } from '@/libs/mappers'

interface Props {
  data: {
    createdAt: Date
    updatedAt: Date
    dataFields: string[]
    hasAccess: boolean
    expiresAt: Date
  } | null
}

const DataAccessCard = ({ data }: Props) => {
  const hasAccess = data?.hasAccess ?? false

  // Convert backend dataFields to their readable labels
  const checkedDemographicFields = reverseMapDataAccessFields(data?.dataFields ?? [], 'demographic')
  const checkedQuestionnaireFields = reverseMapDataAccessFields(data?.dataFields ?? [], 'questionnaire')

  return (
    <Card>
      <CardHeader title='Data Access' className='pbe-4' />
      <CardContent className='flex flex-col gap-6'>
        <Grid container spacing={6} sx={{ mb: 2 }}>
          <Grid size={{ xs: 12 }}>
            {!hasAccess ? (
              <Typography variant='body1'>
                You currently have no data access. To request access, please navigate to the &quot;My Studies&quot;
                section and submit an application.
              </Typography>
            ) : (
              <>
                <Typography variant='body1' sx={{ mb: 2 }}>
                  Data access granted and valid until <strong>{formatDate(data!.expiresAt)}</strong>
                </Typography>
                <Typography>Created on: {formatDate(data!.createdAt)}</Typography>
                <Typography>Last Updated: {formatDate(data!.updatedAt)}</Typography>
              </>
            )}
          </Grid>

          <Grid size={{ xs: 12 }}>
            <Typography variant='h6' sx={{ mb: 2 }}>
              Demographic Data
            </Typography>
            {DATA_ACCESS_ATTRIBUTES.demographic.map(label => (
              <LabeledCheckbox
                key={label}
                label={label}
                value={label}
                name={label}
                checked={hasAccess && checkedDemographicFields.includes(label)}
                disable={true}
              />
            ))}
          </Grid>

          <Grid size={{ xs: 12 }}>
            <Typography variant='h6' sx={{ mb: 2 }}>
              Spider Questionnaire
            </Typography>
            {DATA_ACCESS_ATTRIBUTES.questionnaire.map(label => (
              <LabeledCheckbox
                key={label}
                label={label}
                value={label}
                name={label}
                checked={hasAccess && checkedQuestionnaireFields.includes(label)}
                disable={true}
              />
            ))}
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  )
}

export default DataAccessCard
