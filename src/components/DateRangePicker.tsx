import { forwardRef, useEffect } from 'react'

import TextField from '@mui/material/TextField'
import type { TextFieldProps } from '@mui/material/TextField'
import { format } from 'date-fns'

import AppReactDatepicker from '@/libs/styles/AppReactDatepicker'

type CustomInputProps = TextFieldProps & {
  label: string
  end: Date | number
  start: Date | number
}

interface Props {
  label?: string
  value: { expectedStartDate: Date | null; expectedEndDate: Date | null }
  onChange: (dates: { expectedStartDate: Date | null; expectedEndDate: Date | null }) => void
  error?: boolean
  disabled?: boolean
}

const DateRangePicker = ({ label = '', value, onChange, error, disabled = false }: Props) => {
  const { expectedStartDate, expectedEndDate } = value

  const handleOnChangeRange = (dates: [Date | null, Date | null]) => {
    onChange({ expectedStartDate: dates[0], expectedEndDate: dates[1] })
  }

  const CustomInput = forwardRef((props: CustomInputProps, ref) => {
    const { label, start, end, ...rest } = props

    const startDate = start ? format(start, 'MM/dd/yyyy') : ''
    const endDate = end ? ` - ${format(end, 'MM/dd/yyyy')}` : ''

    return <TextField fullWidth inputRef={ref} {...rest} label={label} value={`${startDate}${endDate}`} error={error} />
  })

  useEffect(() => {
    console.log(expectedStartDate, expectedEndDate)
  }, [expectedStartDate, expectedEndDate])

  return (
    <AppReactDatepicker
      selectsRange
      monthsShown={2}
      endDate={expectedEndDate as Date}
      selected={expectedStartDate}
      startDate={expectedStartDate as Date}
      shouldCloseOnSelect={false}
      id='date-range-picker-months'
      onChange={handleOnChangeRange}
      disabled={disabled}
      customInput={
        <CustomInput label={label} end={expectedEndDate as Date | number} start={expectedStartDate as Date | number} />
      }
    />
  )
}

export default DateRangePicker
