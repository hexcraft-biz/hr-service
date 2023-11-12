import IconButton from '@mui/material/IconButton'
import { styled } from '@mui/material/styles'

const ContainedIconButton = styled(IconButton)(({ color, theme }) => ({
  backgroundColor: theme.palette[color].main,
  color: theme.palette[color].contrastText,
  boxShadow: theme.shadows[2],
  transition: theme.transitions.create(
    ['background-color', 'box-shadow', 'border-color', 'color'],
    {
      duration: theme.transitions.duration.short,
      easing: theme.transitions.easing.easeInOut,
    }
  ),
  '&:hover': {
    backgroundColor: theme.palette[color][theme.palette.mode],
  },
  '&.Mui-disabled': {
    boxShadow: 'none',
    backgroundColor: theme.palette.action.disabledBackground,
  },
}))

export default ContainedIconButton
