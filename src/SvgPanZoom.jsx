import React, { useRef, useEffect } from 'react'
import { css } from 'glamor'
import panzoom from 'panzoom'

export default function SvgPanZoom({ children }) {
  const group = useRef(null)

  useEffect(() => {
    panzoom(group.current, {
      smoothScroll: false,
      minZoom: 0.2,
      maxZoom: 1,
    })
  }, [])

  const style = css({
    width: '100%',
    height: '100%',
    // cursor: isPointerDown ? 'grabbing' : 'grab',
  })

  return (
    <svg {...style} viewBox="-3200 -100 6400 3000">
      <g ref={group}>{children}</g>
    </svg>
  )
}
