import React, { CSSProperties, FC, ReactNode, useContext } from 'react'
import { Dialog } from '@mui/material'
import ProButton, { ProButtonColor, ProButtonProps } from '../ProButton'
import styles from './indexV2.module.scss'
import c from 'classnames'
import useTick from '../../utils/hooks/useTick'
import renderWhenShow from '../../utils/hoc/renderWhenShow'

export interface ProDialogV2Props {
  open: boolean
  icon?: ReactNode
  title?: ReactNode
  content?: ReactNode
  cancelBtnText?: ReactNode
  confirmBtnText?: ReactNode
  renderButtons?: () => ReactNode
  children?: ReactNode
  className?: string
  style?: CSSProperties
  onClose?: (e?: any) => void
  onCancel?: (e?: any) => void
  onConfirm?: (e?: any) => void
  confirmLoading?: boolean
  closeIcon?: string
  timeout?: number
  dialogContent?: string
  confirmBtnProps?: ProButtonProps
  contentStyle?: CSSProperties
  contentClassName?: string
  showClose?: boolean
  doubleBtn?: boolean
  outSideClose?: () => void //点击外部关闭弹窗
  confirmBtnColor?: ProButtonColor
}

const ProDialogV2: FC<ProDialogV2Props> = renderWhenShow(
  'open',
  React.memo(
    ({
       className,
       style,
       open,
       icon,
       title,
       content,
       cancelBtnText,
       confirmBtnText,
       renderButtons,
       children,
       onClose,
       onCancel,
       onConfirm,
       confirmLoading,
       closeIcon = 'icon-drawer-close',
       timeout,
       dialogContent,
       confirmBtnProps,
       contentStyle,
       showClose = true,
       doubleBtn = true,
       outSideClose = onClose || onCancel,
       contentClassName,
       confirmBtnColor = 'primary',
     }) => {
      cancelBtnText = cancelBtnText ?? '取消'
      confirmBtnText = confirmBtnText ?? '确认'

      const { now } = useTick(timeout || 0)
      return (
        <Dialog
          onClose={outSideClose}
          open={open}
          className={c(styles.Dialog, className)}
          style={style}
        >
          <div className={styles.dialogMask}>
            {children ? (
              <div className={styles.children}>{children}</div>
            ) : (
              <div className={c(styles.dialogContent, dialogContent)}>
                {icon && <div className={styles.icon}>{icon}</div>}
                {title && <div className={styles.title}>{title}</div>}
                <div
                  className={c(styles.content, contentClassName)}
                  style={{ marginTop: title ? '0' : '0.3rem', ...contentStyle }}
                >
                  {content}
                </div>
                {renderButtons ? (
                  renderButtons()
                ) : (
                  <div className={styles.btns}>
                    {doubleBtn && (
                      <ProButton color={'grey'} size={'middle'} onClick={onCancel}>
                        {cancelBtnText}
                      </ProButton>
                    )}
                    <ProButton
                      color={confirmBtnColor}
                      size={doubleBtn ? 'middle' : 'large'}
                      onClick={now ? undefined : onConfirm}
                      loading={confirmLoading}
                      disableRipple={!!now}
                      disabled={!!now}
                      {...confirmBtnProps}
                    >
                      {confirmBtnText}
                      {timeout && now ? `(${now})` : ''}
                    </ProButton>
                  </div>
                )}
              </div>
            )}
            {showClose &&
            <span className={c(styles.close, closeIcon)} onClick={onClose || onCancel}/>}
          </div>
        </Dialog>
      )
    },
  ),
)

export default ProDialogV2
