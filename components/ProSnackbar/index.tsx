import React, { FC } from 'react'
import { Snackbar } from '@mui/material'
import { SnackbarProps } from '@mui/material/Snackbar/Snackbar'

export interface ProSnackbarProps extends SnackbarProps {
}

const ProSnackbar: FC<ProSnackbarProps> = React.memo(({ ...props }) => {
  return (
    <Snackbar
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'center',
      }}
      {...props}
    />
  )
})

export default ProSnackbar
