'use client'

import { useState, useEffect } from 'react'

import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Customized
} from 'recharts'
import { Card, CardContent, Typography, Box, Button } from '@mui/material'
import { toast } from 'react-toastify'

const domains = [
  'Neuromusculoskeletal',
  'Pain',
  'Urogenital',
  'Anxiety',
  'Depression',
  'Fatigue',
  'Gastrointestinal',
  'Cardiac Dysautonomia'
]

interface PerceivedSpidergramProps {
  values: Record<string, { score: number }>
  onUpdate: (values: Record<string, { score: number }>) => void
  onBack: () => void
  onSubmit: () => void
}

const MAX_VALUE = 100
const GRID_LEVELS = 10
const TICK_VALUES = [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, MAX_VALUE]
const initialData = domains.map((label, i) => ({ subject: label, value: 0, id: 1000 + i }))

export default function PerceivedSpidergram({ values, onUpdate, onBack, onSubmit }: PerceivedSpidergramProps) {
  const [data, setData] = useState(initialData)
  const [hoveredPoint, setHoveredPoint] = useState<{ axisIndex: number; value: number } | null>(null)

  useEffect(() => {
    const mapped = initialData.map(item => ({
      ...item,
      value: values[item.subject]?.score ?? null
    }))

    setData(mapped)
  }, [values])

  interface InteractionEvent extends React.MouseEvent<HTMLDivElement> {
    currentTarget: HTMLDivElement
  }
  interface RingLevel {
    radius: number
    value: number
  }

  const handleInteraction = (e: InteractionEvent, isClick: boolean = false) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect()
    const mouseX = e.clientX - left
    const mouseY = e.clientY - top
    const cx = width / 2
    const cy = height / 2

    const dx = mouseX - cx
    const dy = cy - mouseY // ← flip here

    const RAD = Math.PI / 180
    const sector = 360 / domains.length
    let bestDot = -Infinity
    let overlayIndex = 0

    for (let i = 0; i < domains.length; i++) {
      const angleDeg = (360 - i * sector) % 360
      const rad = angleDeg * RAD

      const ux = Math.cos(rad)
      const uy = Math.sin(rad)
      const dot = dx * ux + dy * uy

      if (dot > bestDot) {
        bestDot = dot
        overlayIndex = i
      }
    }

    const chartIndex = (domains.length - overlayIndex) % domains.length

    const dist = Math.hypot(dx, dy)
    const maxR = Math.min(width, height) * 0.45

    const rings: RingLevel[] = [
      { radius: 0, value: 0 },
      ...Array.from({ length: GRID_LEVELS }, (_, i) => ({
        radius: ((i + 1) / GRID_LEVELS) * maxR,
        value: (i + 1) * 10
      }))
    ]

    let closest = rings[0]
    let md = Math.abs(dist - closest.radius)

    for (const r of rings) {
      const d = Math.abs(dist - r.radius)

      if (d < md) {
        md = d
        closest = r
      }
    }

    if (isClick) {
      //console.log(`setting ${domains[overlayIndex]} to ${closest.value}`) useful to check tracking is correct

      const updated = data.map((d, i) => (i === overlayIndex ? { ...d, value: closest.value } : d))

      setData(updated)
      onUpdate(Object.fromEntries(updated.map(d => [d.subject, { score: d.value }])))
    } else {
      setHoveredPoint({ axisIndex: chartIndex, value: closest.value })
    }
  }

  const CustomOverlay = (props: any) => {
    const { viewBox, width: propW, height: propH } = props
    const viewX = viewBox?.x ?? 0
    const viewY = viewBox?.y ?? 0
    const width = viewBox?.width ?? propW ?? 0
    const height = viewBox?.height ?? propH ?? 0

    const RAD = Math.PI / 180
    const cx = viewX + width / 2
    const cy = viewY + height / 2
    const radius = Math.min(width, height) * 0.45

    const ringLevels: RingLevel[] = Array.from({ length: GRID_LEVELS }, (_, i) => ({
      radius: ((i + 1) / GRID_LEVELS) * radius,
      value: (i + 1) * 10
    }))

    const previewDot = hoveredPoint
      ? (() => {
          const angle = (360 / domains.length) * hoveredPoint.axisIndex
          const rLevel = ringLevels.find(r => r.value === hoveredPoint.value)
          const r = rLevel ? rLevel.radius : 0

          return (
            <circle
              cx={cx + r * Math.cos(-angle * RAD)}
              cy={cy + r * Math.sin(-angle * RAD)}
              r={6}
              fill='#16B1FF'
              stroke='white'
              strokeWidth={2}
            />
          )
        })()
      : null

    return <>{previewDot}</>
  }

  const handleSubmit = () => {
    const vals = data.map(d => d.value)

    console.log('vals', data)

    if (vals.every(v => v > 0) || vals.every(v => v !== null)) {
      onSubmit()
    } else {
      toast.error('Please set all values or none')
    }
  }

  return (
    <>
      <Typography sx={{ fontFamily: 'Outfit', fontSize: 48, fontWeight: 600, lineHeight: '68px', p: 2 }}>
        Perceived Spidergram
      </Typography>
      <Typography sx={{ fontFamily: 'Inter', fontSize: 24, fontWeight: 400, lineHeight: '28px', pb: 10 }}>
        Mark on the graph how much these symptoms have impacted your daily life during the past ONE month. (Optional)
      </Typography>
      <Card sx={{ maxWidth: 1000, mx: 'auto', my: 2 }}>
        <CardContent>
          <Box
            data-testid='spidergram'
            sx={{ width: '100%', aspectRatio: '4/3', position: 'relative' }}
            onClick={e => handleInteraction(e, true)}
            onMouseMove={e => handleInteraction(e)}
          >
            <ResponsiveContainer width='100%' height='100%'>
              <RadarChart
                cx='50%'
                cy='50%'
                outerRadius='90%'
                startAngle={360}
                endAngle={0}
                data={data}
                dataKey={'subject'}
              >
                <PolarGrid gridType='polygon' />
                <PolarAngleAxis dataKey='subject' />
                <PolarRadiusAxis domain={[0, MAX_VALUE]} ticks={TICK_VALUES as any} />
                <Radar dataKey='value' stroke='#8C57FF' fill='#8C57FF' fillOpacity={0.4} />
                <Customized component={CustomOverlay} />
              </RadarChart>
            </ResponsiveContainer>
          </Box>
          <Box display='flex' justifyContent='space-between' mt={3}>
            <Button variant='outlined' onClick={onBack}>
              Back
            </Button>
            <Button variant='contained' onClick={handleSubmit}>
              Submit
            </Button>
          </Box>
        </CardContent>
      </Card>
    </>
  )
}
