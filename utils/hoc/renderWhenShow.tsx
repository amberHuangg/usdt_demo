import React, { FC, useRef } from 'react'

function renderWhenShow<CompProps>(readyAttr: keyof CompProps, Component: FC<CompProps>) {
  return function(props: CompProps) {
    const hasRenderedRef = useRef<boolean>(false)
    if (!props[readyAttr] && !hasRenderedRef.current) {
      return null
    }

    if (props[readyAttr] && !hasRenderedRef.current) {
      hasRenderedRef.current = true
    }
    // Reason：Type 'CompProps' is not assignable to type 'IntrinsicAttributes'.
    // @ts-ignore
    return <Component {...props} />
  }
}

export default renderWhenShow
