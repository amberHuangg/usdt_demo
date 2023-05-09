import { createTheme } from '@mui/material'

export const theme = createTheme({
  typography: {
    htmlFontSize: 100,
  },
  palette: {
    mode: 'dark',
  },
  components: {
    MuiButton: {
      defaultProps: {
        disableElevation: true,
        disableRipple: false,
      },
      styleOverrides: {
        root: {
          textTransform: 'initial',
        },
      },
    },
  },
})
