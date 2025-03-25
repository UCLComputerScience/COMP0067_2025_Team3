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
    startFrom: Date
  } | null
  view?: 'admin' | 'researcher'
}

const DataAccessCard = ({ data, view = 'researcher' }: Props) => {
  const hasAccess = data?.hasAccess ?? false

  // Convert backend dataFields to their readable labels
  const checkedDemographicFields = reverseMapDataAccessFields(data?.dataFields ?? [], 'demographic')
  const checkedQuestionnaireFields = reverseMapDataAccessFields(data?.dataFields ?? [], 'questionnaire')

  return (
    <Card className='w-full'>
      <CardHeader title='Data Access' className='pbe-4' />
      <CardContent className='flex flex-col gap-6'>
        <Grid container spacing={6} sx={{ mb: 2 }}>
          <Grid size={{ xs: 12 }}>
            {view === 'admin' ? (
              !hasAccess ? (
                <Typography variant='body1' sx={{ mb: 1 }}>
                  The current user does not have any data access permission.
                </Typography>
              ) : (
                <>
                  <Typography variant='body1' sx={{ mb: 4 }}>
                    Data access granted and valid from <strong>{formatDate(data!.startFrom)}</strong> until{' '}
                    <strong>{formatDate(data!.expiresAt)}</strong>.
                  </Typography>

                  <Typography sx={{ mb: 1 }}>Created on: {formatDate(data!.createdAt)}</Typography>
                  <Typography>Last Updated: {formatDate(data!.updatedAt)}</Typography>
                </>
              )
            ) : !hasAccess ? (
              <Typography variant='body1'>
                You currently have no data access. To request access, please navigate to the &quot;My Studies&quot;
                section and submit an application.
              </Typography>
            ) : (
              <>
                <Typography variant='body1'>
                  Data access granted and valid from <strong>{formatDate(data!.startFrom)}</strong> until{' '}
                  <strong>{formatDate(data!.expiresAt)}</strong>
                </Typography>
                <Typography variant='body1' sx={{ mb: 4 }}>
                  {' '}
                  To extend your access, please submit a new study application or update your current one with
                  additional supporting evidence.
                </Typography>
                <Typography sx={{ mb: 2 }}>Created on: {formatDate(data!.createdAt)}</Typography>
                <Typography>Last Updated: {formatDate(data!.updatedAt)}</Typography>
              </>
            )}
          </Grid>
          {checkedDemographicFields.length !== 0 && checkedQuestionnaireFields.length !== 0 && (
            <>
              <Grid size={{ xs: 12 }}>
                <Typography variant='h6' sx={{ mb: 2 }}>
                  Demographic Data
                </Typography>
                {/* {DATA_ACCESS_ATTRIBUTES.demographic.map(label => (
              <LabeledCheckbox
                key={label}
                label={label}
                value={label}
                name={label}
                checked={hasAccess && checkedDemographicFields.includes(label)}
                disable={true}
              />
            ))} */}

                <div className='flex flex-col gap-1'>
                  {checkedDemographicFields.map((label, key) => {
                    return (
                      <div key={key} className='flex items-center gap-2.5 text-textSecondary'>
                        <i className='ri-checkbox-blank-circle-fill text-[6px]' />
                        {label}
                      </div>
                    )
                  })}
                </div>
              </Grid>

              <Grid size={{ xs: 12 }}>
                <Typography variant='h6' sx={{ mb: 2 }}>
                  Spider Questionnaire
                </Typography>
                {/* {DATA_ACCESS_ATTRIBUTES.questionnaire.map(label => (
              <LabeledCheckbox
                key={label}
                label={label}
                value={label}
                name={label}
                checked={hasAccess && checkedQuestionnaireFields.includes(label)}
                disable={true}
              />
            ))} */}
                <div className='flex flex-col gap-1'>
                  {checkedQuestionnaireFields.map((label, key) => {
                    return (
                      <div key={key} className='flex items-center gap-2.5 text-textSecondary'>
                        <i className='ri-checkbox-blank-circle-fill text-[6px]' />
                        {label}
                      </div>
                    )
                  })}
                </div>
              </Grid>
            </>
          )}
        </Grid>
      </CardContent>
    </Card>
  )
}

export default DataAccessCard
