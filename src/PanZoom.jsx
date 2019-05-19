import React, { useRef, useEffect } from 'react'
import panzoom from 'panzoom'

// TODO styles on panning
export default function PanZoom({ children, zoomSpeed, minZoom, maxZoom }) {
  const group = useRef(null)

  useEffect(() => {
    panzoom(group.current, {
      smoothScroll: false,
      zoomSpeed,
      maxZoom,
      minZoom,
    })
  })

  return <g ref={group}>{children}</g>
}
