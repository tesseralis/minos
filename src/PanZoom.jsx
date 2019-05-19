import React, { useRef, useEffect } from 'react'
import panzoom from 'panzoom'

// TODO styles on panning
export default function PanZoom({ children, minZoom, maxZoom }) {
  const group = useRef(null)

  useEffect(() => {
    panzoom(group.current, {
      smoothScroll: false,
      minZoom,
      maxZoom,
    })
  }, [minZoom, maxZoom])

  return <g ref={group}>{children}</g>
}
