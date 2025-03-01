import Checkbox from '@mui/material/Checkbox'
import FormControlLabel from '@mui/material/FormControlLabel'

interface Props {
  label: string
  checked: boolean
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void
  value: string
  name: string
}

const LabeledCheckbox = ({ label, checked = false, onChange, value, name }: Props) => {
  return (
    <FormControlLabel
      control={<Checkbox checked={checked} onChange={onChange} value={value} name={name} />}
      label={<span>{label}</span>}
    />
  )
}

export default LabeledCheckbox
