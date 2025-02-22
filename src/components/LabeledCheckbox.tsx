import Checkbox from '@mui/material/Checkbox'
import FormControlLabel from '@mui/material/FormControlLabel'

interface Props {
  label: string
  checked: boolean
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void
}

const LabeledCheckbox = ({ label, checked = false, onChange }: Props) => {
  return <FormControlLabel control={<Checkbox checked={checked} onChange={onChange} />} label={<span>{label}</span>} />
}

export default LabeledCheckbox
