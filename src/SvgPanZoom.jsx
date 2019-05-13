import React, { useState, useRef, useEffect } from 'react'
import { css } from 'glamor'
import panzoom from 'panzoom'

export default function SvgPanZoom({
  children,
  initialWidth,
  minZoom,
  maxZoom,
}) {
  const group = useRef(null)
  const [panning, setPanning] = useState(false)

  useEffect(() => {
    const pz = panzoom(group.current, {
      smoothScroll: false,
      minZoom,
      maxZoom,
    })

    pz.on('panstart', () => {
      setPanning(true)
    })

    pz.on('panend', () => {
      setPanning(false)
    })
  }, [minZoom, maxZoom])

  const style = css({
    width: '100%',
    height: '100%',
    cursor: panning ? 'grabbing' : 'grab',
    backgroundColor: '#222',
  })

  // TODO make sure this viewbox definition makes sense for a variety of aspect ratios
  const viewBox = `-${initialWidth / 2} ${-initialWidth /
    25} ${initialWidth} ${initialWidth / 2}`

  return (
    <svg {...style} viewBox={viewBox}>
      <g ref={group}>{children}</g>
    </svg>
  )
}
