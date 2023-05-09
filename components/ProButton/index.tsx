import React, { FC, ReactNode } from 'react'
import c from 'classnames'
import styles from './index.module.scss'
import { Button } from '@mui/material'
import { CSSProperties } from '@mui/material/styles/createMixins'

export type ProButtonColor =
  | 'primary'
  | 'orange'
  | 'grey'
  | 'rollprimary'
  | 'rolldark'
  | 'pool'
  | 'xprimary'
  | 'xorange'
  | 'xgrey'
  | 'dialogPool'
  | 'white'

export interface ProButtonProps {
  id?: string
  children?: ReactNode
  size?: 'large' | 'middle' | 'small'
  type?: 'filled' | 'outlined' | 'nagetive'
  fullWidth?: boolean
  onClick?: (e?: any) => void
  loading?: boolean
  className?: string
  style?: CSSProperties
  absLoading?: boolean
  disabled?: boolean
  disableRipple?: boolean
  color?: ProButtonColor
  bgColor?: 'white' | 'black'
}

const ProButton: FC<ProButtonProps> = React.memo(
  ({
     size = 'large',
     type = 'filled',
     color = 'primary',
     bgColor = 'black',
     fullWidth,
     onClick,
     loading,
     children,
     absLoading,
     className,
     style,
     disabled,
     disableRipple,
     id,
   }) => {
    return (
      <Button
        id={id}
        style={style}
        onClick={loading || disabled ? undefined : onClick}
        className={c([
          styles.btnBase,
          styles.btn,
          styles[`btn-${size}`],
          styles[`btn-${type}-${color}`],
          styles[`btn-${color}-${bgColor}-${size}`],
          { [styles['btn-fullWidth']]: fullWidth },
          { [styles['btn-disabled']]: disabled },
          className,
        ])}
        disabled={disabled}
        disableRipple={disableRipple}
      >
        {loading && <span className="icon-loading"/>}
        {absLoading && <span className={c(['icon-loading', styles['float-left']])}/>}
        {children}
      </Button>
    )
  },
)

export default ProButton
