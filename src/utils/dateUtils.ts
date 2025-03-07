import { format } from 'date-fns'

export const formatDate = (dateInput: string | Date): string => {
  const date = dateInput instanceof Date ? dateInput : new Date(dateInput)
  console.log(date)
  return format(date, 'MM/dd/yyyy')
}
