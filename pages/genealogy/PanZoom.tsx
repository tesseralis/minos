import { ReactNode, useRef, useEffect } from "react"
import panzoom, { PanZoomOptions } from "panzoom"

interface Props extends PanZoomOptions {
  children: ReactNode
}
// TODO styles on panning
export default function PanZoom({ children, ...panzoomOptions }: Props) {
  const group = useRef<any>(null)

  useEffect(() => {
    const instance = panzoom(group.current, {
      ...panzoomOptions,
    })

    return () => instance.dispose()
  }, [panzoomOptions])

  return <g ref={group}>{children}</g>
}
