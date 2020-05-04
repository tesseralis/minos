import React, { useRef, useEffect } from "react"
import panzoom from "panzoom"

interface Props {
  children: any
  zoomSpeed: number
  minZoom: number
  maxZoom: number
}
// TODO styles on panning
export default function PanZoom({
  children,
  zoomSpeed,
  minZoom,
  maxZoom,
}: Props) {
  const group = useRef<any>(null)

  useEffect(() => {
    const instance = panzoom(group.current, {
      smoothScroll: false,
      zoomSpeed,
      maxZoom,
      minZoom,
    })

    return () => instance.dispose()
  }, [maxZoom, minZoom, zoomSpeed])

  return <g ref={group}>{children}</g>
}
