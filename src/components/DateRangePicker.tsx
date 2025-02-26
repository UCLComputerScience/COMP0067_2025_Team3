// React Imports
import { forwardRef, SetStateAction, Dispatch, useEffect } from 'react'

// MUI Imports
import TextField from '@mui/material/TextField'
import type { TextFieldProps } from '@mui/material/TextField'

// Third-party Imports
import { format } from 'date-fns'

// Component Imports
import AppReactDatepicker from '@/libs/styles/AppReactDatepicker'

type CustomInputProps = TextFieldProps & {
  label: string
  end: Date | number
  start: Date | number
}

interface Props {
  label?: string
  startDateRange?: Date | null | undefined
  setStartDateRange?: Dispatch<SetStateAction<Date | null | undefined>>
  endDateRange?: Date | null | undefined
  setEndDateRange?: Dispatch<SetStateAction<Date | null | undefined>>
}

const DateRangePicker = ({ label = '', startDateRange, setStartDateRange, endDateRange, setEndDateRange }: Props) => {
  const handleOnChangeRange = (dates: [Date | null, Date | null]) => {
    const [start, end] = dates

    // Update formData state in the parent component
    if (setStartDateRange) setStartDateRange(start)
    if (setEndDateRange) setEndDateRange(end)
  }

  const CustomInput = forwardRef((props: CustomInputProps, ref) => {
    const { label, start, end, ...rest } = props

    const startDate = start ? format(start, 'MM/dd/yyyy') : ''
    const endDate = end ? ` - ${format(end, 'MM/dd/yyyy')}` : ''

    return <TextField fullWidth inputRef={ref} {...rest} label={label} value={`${startDate}${endDate}`} />
  })

  useEffect(() => {
    console.log(startDateRange, endDateRange)
  }, [startDateRange, endDateRange])

  return (
    <AppReactDatepicker
      selectsRange
      monthsShown={2}
      endDate={endDateRange as Date}
      selected={startDateRange}
      startDate={startDateRange as Date}
      shouldCloseOnSelect={false}
      id='date-range-picker-months'
      onChange={handleOnChangeRange}
      customInput={
        <CustomInput label={label} end={endDateRange as Date | number} start={startDateRange as Date | number} />
      }
    />
  )
}

export default DateRangePicker
