import Checkbox from '@mui/material/Checkbox'
import FormControlLabel from '@mui/material/FormControlLabel'

interface Props {
  label: string
  checked: boolean
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void
  value: string
  name: string
  disable?: boolean
}

const LabeledCheckbox = ({ label, checked = false, onChange, value, name, disable = false }: Props) => {
  return (
    <FormControlLabel
      control={<Checkbox checked={checked} onChange={onChange} value={value} name={name} disabled={disable} />}
      label={<span>{label}</span>}
    />
  )
}

export default LabeledCheckbox
