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
import CustomLegend from '../CustomLegend'

interface DataEntry {
  subject: string
  [date: string]: string | number
}

// Props for the radar chart component
interface Props {
  data?: DataEntry[]
  legend?: boolean
}

// Styled Component Imports
const AppRecharts = dynamic(() => import('@/libs/styles/AppRecharts'))

// Vars
const demoData = [
  {
    subject: 'Neuromusculoskeletal',
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

const colors = ['#16B1FF', '#8C57FF', '#56CA00']

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

const RechartsRadarChart = ({ data = demoData, legend = true }: Props) => {
  const dateKeys = Object.keys(data[0]).filter(key => key !== 'subject')
  return (
    <>
      <AppRecharts>
        <div className={`bs-[350px]`}>
          <ResponsiveContainer>
            <RadarChart cx='50%' cy='50%' data={data} style={{ direction: 'ltr' }}>
              <PolarGrid />
              <PolarAngleAxis dataKey='subject' />
              <PolarRadiusAxis domain={[0, 100]} />
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
      {legend && <CustomLegend keys={dateKeys} colors={colors} />}
    </>
  )
}

export default RechartsRadarChart
