import { useState } from 'react'
import { useInterval } from 'ahooks'

const useTick = (time: number, options?: { immediate?: boolean }) => {
  const [now, setNow] = useState<number>(time || 0)

  const cancel = useInterval(
    () => {
      if (now > 0) {
        setNow(now - 1)
      } else {
        cancel()
      }
    },
    1000,
    { immediate: options?.immediate },
  )

  return { now, cancel }
}

export default useTick
