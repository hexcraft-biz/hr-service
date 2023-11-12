import IconButton from '@mui/material/IconButton'
import { styled, alpha } from '@mui/material/styles'

const SIZING = {
  large: 12 - 1,
  medium: 8 - 1,
  small: 5 - 1,
}

const OutlinedIconButton = styled(IconButton)(
  ({ color, theme, size = 'medium' }) => ({
    padding: SIZING[size],
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: alpha(theme.palette[color].main, 0.5),
    transition: theme.transitions.create(
      ['background-color', 'box-shadow', 'border-color', 'color'],
      {
        duration: theme.transitions.duration.short,
        easing: theme.transitions.easing.easeInOut,
      }
    ),
    '&:hover': {
      borderColor: theme.palette[color].main,
      backgroundColor: alpha(
        theme.palette[color].main,
        theme.palette.action.selectedOpacity
      ),
    },
    '&.Mui-disabled': {
      boxShadow: 'none',
      borderColor: theme.palette.action.disabledBackground,
    },
  })
)

export default OutlinedIconButton
