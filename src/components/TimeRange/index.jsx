import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'

import { TimePicker } from '@mui/x-date-pickers/TimePicker'

import { toTimeObject, toTimeString } from '../../helpers/convertTime'

const TimeRange = ({ from = '', to = '', onChange: callback, small }) => (
  <Stack
    direction='row'
    alignItems='center'
    spacing={2}
    sx={{ fontSize: '0.6rem' }}
  >
    <TimePicker
      label='From'
      views={['hours', 'minutes']}
      value={toTimeObject(from, null)}
      slotProps={{
        textField: { size: 'small' },
      }}
      onChange={newValue => {
        callback('from', toTimeString(newValue))
      }}
      sx={{
        width: { xs: 120, sm: 150 },
        ...(small && {
          '.MuiFormLabel-root, .MuiInputBase-root': { fontSize: '0.6rem' },
        }),
      }}
    />
    <Typography {...(small && { fontSize: '0.6rem' })}>–</Typography>
    <TimePicker
      label='To'
      views={['hours', 'minutes']}
      value={toTimeObject(to, null)}
      slotProps={{
        textField: { size: 'small' },
      }}
      onChange={newValue => {
        callback('to', toTimeString(newValue))
      }}
      sx={{
        width: { xs: 120, sm: 150 },
        ...(small && {
          '.MuiFormLabel-root, .MuiInputBase-root': { fontSize: '0.6rem' },
        }),
      }}
    />
  </Stack>
)

export default TimeRange
