import { ProDialogProps } from './index'
import { ProDialogV2Props } from './ProDialogV2'

const base: ProDialogProps = {
  open: false,
  title: '提示',
  content: '弹窗内容',
}

const baseV2: ProDialogV2Props = {
  open: false,
  title: '提示',
  content: '弹窗内容',
}

export const mockProDialogProps = {
  base,
  baseV2,
}
