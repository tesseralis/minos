import React, { useEffect, useCallback, useState, useRef } from 'react'
import { css } from 'glamor'

// https://css-tricks.com/creating-a-panning-effect-for-svg/

// This function returns an object with X & Y values from the pointer event
function getPointFromEvent(event, svg) {
  const point = svg.createSVGPoint()
  // If event is triggered by a touch event, we get the position of the first finger
  if (event.targetTouches) {
    point.x = event.targetTouches[0].clientX
    point.y = event.targetTouches[0].clientY
  } else {
    point.x = event.clientX
    point.y = event.clientY
  }

  const invertedSVGMatrix = svg.getScreenCTM().inverse()
  return point.matrixTransform(invertedSVGMatrix)
}

export default function SvgControls({ children }) {
  const svg = useRef()
  const isPointerDown = useRef(false)
  const pointerOrigin = useRef({ x: 0, y: 0 })

  const [scale, setScale] = useState(1)

  // TODO generalize
  const len = 1200
  const [viewBox, setViewBox] = useState({
    x: -len,
    y: -100,
    width: 2 * len,
    height: 0,
  })

  // Set the viewbox to have the same aspect ratio as the canvas
  useEffect(() => {
    if (svg.current) {
      const rect = svg.current.getBoundingClientRect()
      const aspectRatio = rect.width / rect.height
      setViewBox(viewBox => ({
        ...viewBox,
        height: viewBox.width / aspectRatio,
      }))
    }
  }, [svg.current])

  const onPointerDown = useCallback(e => {
    isPointerDown.current = true
    pointerOrigin.current = getPointFromEvent(e, svg.current)
  }, [])

  const onPointerMove = useCallback(e => {
    if (!isPointerDown.current) {
      return
    }
    e.preventDefault()
    const pointerPosition = getPointFromEvent(e, svg.current)
    setViewBox(viewBox => ({
      ...viewBox,
      x: viewBox.x - (pointerPosition.x - pointerOrigin.current.x),
      y: viewBox.y - (pointerPosition.y - pointerOrigin.current.y),
    }))
  }, [])

  const onPointerUp = useCallback(() => {
    isPointerDown.current = false
  }, [])
  const viewBoxStr = `${viewBox.x} ${viewBox.y} ${viewBox.width} ${
    viewBox.height
  }`

  useEffect(() => {
    window.addEventListener('wheel', e => {
      setScale(scale => scale + e.deltaY / 100)
    })
  }, [])

  const style = css({
    width: '100%',
    height: '100%',
  })

  return (
    <svg
      {...style}
      ref={svg}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerLeave={onPointerUp}
      viewBox={viewBoxStr}
    >
      {children}
    </svg>
  )
}
