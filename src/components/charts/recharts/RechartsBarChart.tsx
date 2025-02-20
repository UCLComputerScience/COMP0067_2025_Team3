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
import { useTheme } from '@mui/material/styles'

// Component Imports
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from '@/libs/Recharts'
import type { TooltipProps } from '@/libs/Recharts'
import CustomLegend from '../CustomLegend'

interface DataEntry {
  date: string
  total: number
}

interface Props {
  data?: DataEntry[]
  barSize?: number
  legend?: boolean
}

// Styled Component Imports
const AppRecharts = dynamic(() => import('@/libs/styles/AppRecharts'))

// Vars
const demoData = [
  {
    date: '04/06/2024',
    total: 80
  },
  {
    date: '06/04/2025',
    total: 100
  }
]

const colors = ['#16B1FF', '#8C57FF', '#56CA00']
const demoKeys = [...new Set(demoData.map(e => e.date))]

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

const RechartsBarChart = ({ data = demoData, barSize = 15, legend = true }: Props) => {
  // Hooks
  const theme = useTheme()

  return (
    <>
      <AppRecharts>
        <div className='bs-[350px]'>
          <ResponsiveContainer width='100%' height='100%'>
            <BarChart
              height={350}
              data={data}
              barSize={barSize}
              style={{ direction: theme.direction }}
              margin={{ left: -20 }}
            >
              <CartesianGrid strokeDasharray='3 3' />
              <XAxis dataKey='date' reversed={theme.direction === 'rtl'} />
              <YAxis orientation={theme.direction === 'rtl' ? 'right' : 'left'} />
              <Tooltip content={CustomTooltip} />
              <Bar dataKey='total' stackId='a' fill='#826af9' radius={[15, 15, 0, 0]}>
                {data.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </AppRecharts>
      {legend && <CustomLegend keys={demoKeys} colors={colors} />}
    </>
  )
}

export default RechartsBarChart
