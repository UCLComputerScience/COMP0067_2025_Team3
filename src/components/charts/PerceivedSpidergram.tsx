'use client'

import { useState } from 'react'

import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Tooltip,
  ResponsiveContainer,
  Customized
} from 'recharts'

import { Card, CardContent, CardHeader, Box } from '@mui/material'

const SECTIONS = [
  'Neuromusculoskeletal',
  'Pain',
  'Fatigue',
  'Gastrointestinal',
  'Cardiac Dysautonomia',
  'Urogential',
  'Anxiety',
  'Depression'
]

const initialData = SECTIONS.map(label => ({ domain: label, value: 0 }))
const MAX_VALUE = 100
const RADIUS = 300
const CENTER = 350
const GRID_LEVELS = 10

const polarRadii = Array.from({ length: GRID_LEVELS }, (ß, i) => Math.round(((i + 1) / GRID_LEVELS) * RADIUS))

const ringValues: number[] = Array.from({ length: GRID_LEVELS }, (_, i) =>
  Math.round(((i + 1) / GRID_LEVELS) * MAX_VALUE)
)

const ringLevels = Array.from({ length: GRID_LEVELS }, (_, i) => {
  const radius = ((i + 1) / GRID_LEVELS) * RADIUS // pixel distance from center
  const value = ((i + 1) / GRID_LEVELS) * MAX_VALUE // matching value at that distance

  return { radius, value }
})

const PerceivedSpidergram = () => {
  const [data, setData] = useState(initialData)
  const [hoveredPoint, setHoveredPoint] = useState<{ axisIndex: number; value: number } | null>(null)

  const handleChartClick = (e: any) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const mouseX = e.clientX - rect.left
    const mouseY = e.clientY - rect.top

    const dx = mouseX - CENTER
    const dy = mouseY - CENTER
    const distance = Math.sqrt(dx * dx + dy * dy)

    if (distance > RADIUS) return

    const angleDeg = (Math.atan2(-dy, dx) * 180) / Math.PI
    const angle = (angleDeg + 360) % 360

    const sectionAngle = 360 / SECTIONS.length

    // 🔍 Find closest axis
    let closestAxisIndex = 0
    let minAxisDiff = Infinity

    for (let i = 0; i < SECTIONS.length; i++) {
      const axisAngle = sectionAngle * i
      const diff = Math.abs(axisAngle - angle)
      const wrappedDiff = Math.min(diff, 360 - diff)

      if (wrappedDiff < minAxisDiff) {
        minAxisDiff = wrappedDiff
        closestAxisIndex = i
      }
    }

    const ANGLE_THRESHOLD = 10 // Allow clicks near an axis

    if (minAxisDiff > ANGLE_THRESHOLD) return

    // Snap to nearest grid ring
    let closestRingIndex = 0
    let minRingDiff = Infinity

    for (let i = 0; i < polarRadii.length; i++) {
      const diff = Math.abs(distance - polarRadii[i])

      if (diff < minRingDiff) {
        minRingDiff = diff
        closestRingIndex = i
      }
    }

    const snappedValue = ringValues[closestRingIndex]

    setData(prev => prev.map((item, i) => (i === closestAxisIndex ? { ...item, value: snappedValue } : item)))
  }

  const handleMouseMove = (e: any) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const mouseX = e.clientX - rect.left
    const mouseY = e.clientY - rect.top

    const dx = mouseX - CENTER
    const dy = mouseY - CENTER
    const distance = Math.sqrt(dx * dx + dy * dy)

    if (distance > RADIUS) return setHoveredPoint(null)

    const angleDeg = (Math.atan2(-dy, dx) * 180) / Math.PI
    const angle = (angleDeg + 360) % 360

    const sectionAngle = 360 / SECTIONS.length

    // 🔍 Find closest axis
    let closestAxisIndex = 0
    let minAxisDiff = Infinity

    for (let i = 0; i < SECTIONS.length; i++) {
      const axisAngle = sectionAngle * i
      const diff = Math.abs(axisAngle - angle)
      const wrappedDiff = Math.min(diff, 360 - diff)

      if (wrappedDiff < minAxisDiff) {
        minAxisDiff = wrappedDiff
        closestAxisIndex = i
      }
    }

    // 🔍 Find closest ring
    let closestRingIndex = 0
    let minRingDiff = Infinity

    for (let i = 0; i < polarRadii.length; i++) {
      const diff = Math.abs(distance - polarRadii[i])

      if (diff < minRingDiff) {
        minRingDiff = diff
        closestRingIndex = i
      }
    }

    const snappedValue = ringValues[closestRingIndex]

    setHoveredPoint({ axisIndex: closestAxisIndex, value: snappedValue })
  }

  // Display the overlay in client once all user has entered values
  const CustomOverlay = () => {
    const RADIAN = Math.PI / 180

    const points = data.map((entry, index) => {
      const angle = (360 / data.length) * index
      const radius = ringLevels.find(r => r.value === entry.value)?.radius || 0
      const x = CENTER + radius * Math.cos(-angle * RADIAN)
      const y = CENTER + radius * Math.sin(-angle * RADIAN)

      return [x, y]
    })

    const filled = data.every(d => d.value > 0)

    const previewDot = hoveredPoint
      ? (() => {
          const angle = (360 / SECTIONS.length) * hoveredPoint.axisIndex
          const radius = ringLevels.find(r => r.value === hoveredPoint.value)?.radius || 0
          const x = CENTER + radius * Math.cos(-angle * RADIAN)
          const y = CENTER + radius * Math.sin(-angle * RADIAN)

          return <circle cx={x} cy={y} r={6} fill='blue' stroke='white' strokeWidth={2} />
        })()
      : null

    const path = filled && points.map(([x, y], i) => `${i === 0 ? 'M' : 'L'} ${x},${y}`).join(' ') + ' Z'

    console.log(data)

    return (
      <>
        {filled && path && <path d={path} stroke='red' strokeWidth={2} fill='rgba(255,0,0,0.3)' />}
        {points.map(([x, y], i) => (data[i].value > 0 ? <circle key={i} cx={x} cy={y} r={5} fill='red' /> : null))}
        {previewDot}
      </>
    )
  }

  return (
    <Card sx={{ mx: 'auto', mt: 2, mb: 2 }}>
      <CardHeader title='Mark on the diagram below how much you feel your symptoms have affected you in the past month' />
      <CardContent>
        <Box display={'flex'} justifyContent={'center'} alignItems={'center'}>
          <Box
            style={{
              width: '100%',
              aspectRatio: '1 / 1' // keeps it square
            }}
            onClick={handleChartClick}
            onMouseMove={handleMouseMove}
          >
            <ResponsiveContainer width='100%' height='100%'>
              <RadarChart cx={CENTER} cy={CENTER} outerRadius={RADIUS} data={data}>
                <PolarGrid gridType='polygon' polarRadius={polarRadii} />
                <PolarAngleAxis dataKey='domain' />
                <PolarRadiusAxis angle={90} domain={[0, MAX_VALUE]} ticks={ringLevels.map(r => r.value)} />
                <Tooltip formatter={val => (typeof val === 'number' && val > 0 ? val : 'Click axis to set')} />
                <Customized component={CustomOverlay} />
              </RadarChart>
            </ResponsiveContainer>
          </Box>
        </Box>
      </CardContent>
    </Card>
  )
}

export default PerceivedSpidergram
