import React, { useState } from 'react'
import ProDialog, { ProDialogProps } from './index'
import ProDialogV2, { ProDialogV2Props } from './ProDialogV2'
import { mockProDialogProps } from './index.mocks'
import ProButton from '../../components/ProButton'

const Template = (args: ProDialogProps) => {
  const [open, setOpen] = useState(false)
  return (
    <>
      <ProButton onClick={() => {
        setOpen(true)
      }}>打开弹窗</ProButton>
      <ProDialog {...args} open={open} onCancel={() => {
        setOpen(false)
      }}/>
    </>
  )
}

const TemplateV2 = (args: ProDialogV2Props) => {
  const [open, setOpen] = useState(false)
  return (
    <>
      <ProButton onClick={() => {
        setOpen(true)
      }}>打开弹窗</ProButton>
      <ProDialogV2 {...args} open={open} onCancel={() => {
        setOpen(false)
      }}/>
    </>
  )
}
