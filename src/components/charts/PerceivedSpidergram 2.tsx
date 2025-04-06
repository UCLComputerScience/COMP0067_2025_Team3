'use client'

import { useState, useEffect } from 'react'

import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Tooltip,
  ResponsiveContainer,
  Customized
} from 'recharts'
import { Card, CardContent, Typography, Box, Button } from '@mui/material'

import { toast } from 'react-toastify'

const domains = [
  'Neuromusculoskeletal',
  'Pain',
  'Fatigue',
  'Gastrointestinal',
  'Cardiac Dysautonomia',
  'Urogenital',
  'Anxiety',
  'Depression'
]

interface PerceivedSpidergramProps {
  values: Record<string, { score: number }>
  onUpdate: (values: Record<string, { score: number }>) => void
  onBack: () => void
  onSubmit: () => void
}
const MAX_VALUE = 100
const GRID_LEVELS = 10
const TICK_VALUES = Array.from({ length: GRID_LEVELS }, (_, i) => (i + 1) * 10)

const initialData = domains.map((label, i) => ({ subject: label, value: 0, id: 1000 + i }))

export default function PerceivedSpidergram({ values, onUpdate, onBack, onSubmit }: PerceivedSpidergramProps) {
  const [data, setData] = useState(initialData)
  const [hoveredPoint, setHoveredPoint] = useState<{ axisIndex: number; value: number } | null>(null)

  useEffect(() => {
    const mappedData = initialData.map(item => ({
      ...item,
      value: values[item.subject]?.score || 0
    }))

    setData(mappedData)
  }, [values])

  interface InteractionEvent extends React.MouseEvent<HTMLDivElement> {
    currentTarget: HTMLDivElement
  }

  interface RingLevel {
    radius: number
    value: number
  }

  const handleSubmitWithValidation = () => {
    const allSpiderGramValues = data.map(d => d.value)
    const allSet = allSpiderGramValues.every(value => value > 0)
    const noneSet = allSpiderGramValues.every(value => value === 0)

    if (allSet || noneSet) {
      onSubmit()
    } else {
      toast.error('Please set all values or none')
    }
  }

  const handleInteraction = (e: InteractionEvent, isClick: boolean = false): void => {
    const rect = e.currentTarget.getBoundingClientRect()
    const mouseX = e.clientX - rect.left
    const mouseY = e.clientY - rect.top
    const cx = rect.width / 2
    const cy = rect.height / 2
    const dx = mouseX - cx
    const dy = mouseY - cy
    const distance = Math.sqrt(dx * dx + dy * dy)

    const angleDeg = (Math.atan2(-dy, dx) * 180) / Math.PI
    const angle = (angleDeg + 360) % 360

    const sectionAngle = 360 / domains.length
    let closestAxisIndex = 0
    let minAxisDiff = Infinity

    for (let i = 0; i < domains.length; i++) {
      const axisAngle = sectionAngle * i
      const diff = Math.abs(axisAngle - angle)
      const wrappedDiff = Math.min(diff, 360 - diff)

      if (wrappedDiff < minAxisDiff) {
        minAxisDiff = wrappedDiff
        closestAxisIndex = i
      }
    }

    const ANGLE_THRESHOLD = 10

    if (minAxisDiff > ANGLE_THRESHOLD) return setHoveredPoint(null)

    const radius = Math.min(rect.width, rect.height) * 0.45

    const ringLevels: RingLevel[] = Array.from({ length: GRID_LEVELS }, (_, i) => {
      const r = ((i + 1) / GRID_LEVELS) * radius
      const value = (i + 1) * 10

      return { radius: r, value }
    })

    let closestRing = ringLevels[0]
    let minRingDiff = Infinity

    for (const ring of ringLevels) {
      const diff = Math.abs(distance - ring.radius)

      if (diff < minRingDiff) {
        minRingDiff = diff
        closestRing = ring
      }
    }

    if (isClick) {
      const updated = data.map((item, i) => (i === closestAxisIndex ? { ...item, value: closestRing.value } : item))

      setData(updated)

      const newValues = Object.fromEntries(updated.map(d => [d.subject, { score: d.value }]))

      onUpdate(newValues)
    } else {
      setHoveredPoint({ axisIndex: closestAxisIndex, value: closestRing.value })
    }
  }

  const CustomOverlay = ({ width, height }: { width: number; height: number }) => {
    const RADIAN = Math.PI / 180
    const cx = width / 2
    const cy = height / 2
    const radius = Math.min(width, height) * 0.45

    const ringLevels = Array.from({ length: GRID_LEVELS }, (_, i) => {
      const r = ((i + 1) / GRID_LEVELS) * radius
      const value = (i + 1) * 10

      return { radius: r, value }
    })

    const points = data.map((entry, index) => {
      const angle = (360 / data.length) * index
      const r = ringLevels.find(r => r.value === entry.value)?.radius || 0
      const x = cx + r * Math.cos(-angle * RADIAN)
      const y = cy + r * Math.sin(-angle * RADIAN)

      return [x, y]
    })

    const filled = data.every(d => d.value > 0)

    const previewDot = hoveredPoint
      ? (() => {
          const angle = (360 / domains.length) * hoveredPoint.axisIndex
          const r = ringLevels.find(r => r.value === hoveredPoint.value)?.radius || 0
          const x = cx + r * Math.cos(-angle * RADIAN)
          const y = cy + r * Math.sin(-angle * RADIAN)

          return <circle cx={x} cy={y} r={6} fill='blue' stroke='white' strokeWidth={2} />
        })()
      : null

    const path = filled && points.map(([x, y], i) => `${i === 0 ? 'M' : 'L'} ${x},${y}`).join(' ') + ' Z'

    return (
      <>
        {filled && path && <path d={path} stroke='red' strokeWidth={2} fill='rgba(255,0,0,0.3)' />}
        {points.map(([x, y], i) => (data[i].value > 0 ? <circle key={i} cx={x} cy={y} r={5} fill='red' /> : null))}
        {previewDot}
      </>
    )
  }

  return (
    <>
      <Typography sx={{ fontFamily: 'Outfit', fontSize: '48px', fontWeight: 600, lineHeight: '68px', padding: '20px' }}>
        {'Perceived Spidergram'}
      </Typography>
      <Typography
        sx={{ fontFamily: 'Inter', fontSize: '24px', fontWeight: 400, lineHeight: '28px', paddingBottom: '79px' }}
      >
        Mark on the graph how much these symptoms have impacted your daily life during the past ONE month. (Optional)
      </Typography>
      <Card sx={{ maxWidth: 1000, mx: 'auto', mt: 2, mb: 2 }}>
        <CardContent>
          <Box
            sx={{
              width: '100%',
              aspectRatio: '4 / 3',
              display: 'flex',
              justifyContent: 'center',
              position: 'relative'
            }}
            onClick={e => handleInteraction(e, true)}
            onMouseMove={e => handleInteraction(e)}
          >
            <ResponsiveContainer width='100%' height='100%'>
              <RadarChart cx='50%' cy='50%' outerRadius='90%' data={data}>
                <PolarGrid gridType='polygon' />
                <PolarAngleAxis dataKey='subject' />
                <PolarRadiusAxis angle={90} domain={[0, MAX_VALUE]} ticks={TICK_VALUES as any} />
                <Tooltip formatter={val => (typeof val === 'number' && val > 0 ? val : 'Click axis to set')} />
                <Customized component={CustomOverlay as any} />
              </RadarChart>
            </ResponsiveContainer>
          </Box>
          <Box display='flex' justifyContent='space-between' mt={3}>
            <Button variant='outlined' onClick={onBack}>
              Back
            </Button>
            <Button variant='contained' onClick={handleSubmitWithValidation}>
              Submit
            </Button>
          </Box>
        </CardContent>
      </Card>
    </>
  )
}
