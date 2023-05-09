import React, { FC, ReactElement } from 'react'

export interface AppLayoutProps {
  children: ReactElement | null
}

const AppLayout: FC<AppLayoutProps> = React.memo(({ children }) => {

  return (
    <>
      {children}
    </>
  )
})

export default AppLayout
