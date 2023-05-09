import {
  OptionsObject,
  ProviderContext,
  SnackbarKey,
  SnackbarMessage,
  useSnackbar,
} from 'notistack'

const defaultOptions: OptionsObject = {
  anchorOrigin: {
    vertical: 'bottom',
    horizontal: 'center',
  },
  autoHideDuration: 3000,
}

export type SnackBarFn = (msg: SnackbarMessage, opt?: OptionsObject) => SnackbarKey

const useProSnackbar = (): ProviderContext & {
  enqueueSnackbarSuccess: SnackBarFn
  enqueueSnackbarWarning: SnackBarFn
  enqueueSnackbarError: SnackBarFn
} => {
  const { enqueueSnackbar, closeSnackbar } = useSnackbar()

  const $enqueueSnackbar = (message: SnackbarMessage, options?: OptionsObject) => {
    return enqueueSnackbar(
      <div style={{ position: 'relative' }}>
        {message}
        <span className="icon-close"/>
      </div>,
      {
        ...defaultOptions,
        ...options,
        ClickAwayListenerProps: {
          onClickAway: () => {
            closeSnackbar()
          },
        },
      },
    )
  }

  const enqueueSnackbarSuccess = (message: SnackbarMessage, options?: OptionsObject) => {
    return enqueueSnackbar(message, {
      ...defaultOptions,
      ...options,
      variant: 'success',
      ClickAwayListenerProps: {
        onClickAway: () => {
          closeSnackbar()
        },
      },
    })
  }

  const enqueueSnackbarWarning = (message: SnackbarMessage, options?: OptionsObject) => {
    return enqueueSnackbar(message, {
      ...defaultOptions,
      ...options,
      variant: 'warning',
      ClickAwayListenerProps: {
        onClickAway: () => {
          closeSnackbar()
        },
      },
    })
  }

  const enqueueSnackbarError = (message: SnackbarMessage, options?: OptionsObject) => {
    return enqueueSnackbar(message, {
      ...defaultOptions,
      ...options,
      variant: 'error',
      ClickAwayListenerProps: {
        onClickAway: () => {
          closeSnackbar()
        },
      },
    })
  }

  return {
    enqueueSnackbar: $enqueueSnackbar,
    enqueueSnackbarSuccess,
    enqueueSnackbarWarning,
    enqueueSnackbarError,
    closeSnackbar,
  }
}

export default useProSnackbar
