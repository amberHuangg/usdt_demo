import React, { CSSProperties, FC, ReactNode, useContext } from 'react'
import { Dialog } from '@mui/material'
import ProButton, { ProButtonProps } from '../ProButton'
import styles from './index.module.scss'
import c from 'classnames'
import useTick from '../../utils/hooks/useTick'
import renderWhenShow from '../../utils/hoc/renderWhenShow'

export interface ProDialogProps {
  open: boolean
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
  confirmBtnColor?: 'xprimary' | 'xorange'
}

const ProDialog: FC<ProDialogProps> = renderWhenShow('open', React.memo(
  ({
     className,
     style,
     open,
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
     closeIcon = 'icon-dialog-close',
     timeout,
     dialogContent,
     confirmBtnProps,
     contentStyle,
     showClose = true,
     doubleBtn = true,
     outSideClose = onClose || onCancel,
     contentClassName,
     confirmBtnColor,
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
                    <ProButton
                      type="filled"
                      color={'xprimary'}
                      size={'middle'}
                      onClick={onCancel}
                    >
                      {cancelBtnText}
                    </ProButton>
                  )}
                  <ProButton
                    type="filled"
                    color={
                      confirmBtnColor
                        ? confirmBtnColor
                        : doubleBtn
                        ? 'xorange'
                        : 'xprimary'
                    }
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
))

export default ProDialog
