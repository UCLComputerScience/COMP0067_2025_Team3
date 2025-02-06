'use client'

// Next Imports
import dynamic from 'next/dynamic'

// MUI Imports
import Box from '@mui/material/Box'
// import Card from '@mui/material/Card'
import Divider from '@mui/material/Divider'
// import CardHeader from '@mui/material/CardHeader'
import Typography from '@mui/material/Typography'
// import CardContent from '@mui/material/CardContent'

// Component Imports
import {
  Radar,
  Tooltip,
  PolarGrid,
  RadarChart,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer
} from '@/libs/Recharts'
import type { TooltipProps } from '@/libs/Recharts'

interface DataEntry {
  subject: string
  [date: string]: string | number
}

// Props for the radar chart component
interface Props {
  // data?: { subject: string; [key: string]: number | string }[]
  data?: DataEntry[]
  height?: number
}

// Styled Component Imports
const AppRecharts = dynamic(() => import('@/libs/styles/AppRecharts'))

// Vars
const demoData = [
  {
    subject: 'NSMK',
    '04/06/2024': 41,
    '06/04/2025': 65
  },
  {
    subject: 'Pain',
    '04/06/2024': 64,
    '06/04/2025': 46
  },
  {
    subject: 'Urogenital',
    '04/06/2024': 81,
    '06/04/2025': 42
  },
  {
    subject: 'Anxiety',
    '04/06/2024': 60,
    '06/04/2025': 25
  },
  {
    subject: 'Depression',
    '04/06/2024': 42,
    '06/04/2025': 58
  },
  {
    subject: 'Fatigue',
    '04/06/2024': 33,
    '06/04/2025': 76
  },
  {
    subject: 'Gastrointestinal',
    '04/06/2024': 23,
    '06/04/2025': 43
  },
  {
    subject: 'Cardiac dysautonomia',
    '04/06/2024': 23,
    '06/04/2025': 43
  }
]

const CustomTooltip = (props: TooltipProps<any, any>) => {
  // Props
  const { active, payload } = props

  if (active && payload) {
    return (
      <div className='recharts-custom-tooltip'>
        <Typography color='text.primary'>{props.label}</Typography>
        <Divider />
        {props &&
          props.payload &&
          props.payload.map((i: any) => {
            return (
              <Box key={i.dataKey} className='flex items-center gap-2.5' sx={{ '& i': { color: i.fill } }}>
                <i className='ri-circle-fill text-[10px]' />
                <Typography variant='body2'>{`${i.dataKey} : ${i.payload[i.dataKey]}`}</Typography>
              </Box>
            )
          })}
      </div>
    )
  }

  return null
}

const RechartsRadarChart = ({ data = demoData, height = 350 }: Props) => {
  const dateKeys = Object.keys(demoData[0]).filter(key => key !== 'subject')
  const colors = ['#16B1FF', '#8C57FF', '#56CA00']

  return (
    <>
      <AppRecharts>
        <div className={`bs-[${height}px]`}>
          <ResponsiveContainer>
            <RadarChart cx='50%' cy='50%' data={data} style={{ direction: 'ltr' }}>
              <PolarGrid />
              <PolarAngleAxis dataKey='subject' />
              <PolarRadiusAxis />
              <Tooltip content={CustomTooltip} />
              {dateKeys.map((key, index) => (
                <Radar
                  key={key}
                  dataKey={key}
                  stroke={colors[index % colors.length]}
                  fill={colors[index % colors.length]}
                  fillOpacity={0.4}
                />
              ))}
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </AppRecharts>
      {/* Legend */}
      <div className='flex justify-center mbe-4'>
        {dateKeys.map((key, index) => (
          <Box
            key={key}
            className='flex items-center mie-5 gap-1.5'
            sx={{ '& i': { color: colors[index % colors.length] } }}
          >
            <i className='ri-circle-fill text-xs' />
            <Typography variant='body2'>{key}</Typography>
          </Box>
        ))}
      </div>
    </>
  )
}

export default RechartsRadarChart
