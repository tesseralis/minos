import React, { useCallback, useState, useRef } from 'react'

// https://css-tricks.com/creating-a-panning-effect-for-svg/

// This function returns an object with X & Y values from the pointer event
function getPointFromEvent(event) {
  var point = { x: 0, y: 0 }
  // If event is triggered by a touch event, we get the position of the first finger
  if (event.targetTouches) {
    point.x = event.targetTouches[0].clientX
    point.y = event.targetTouches[0].clientY
  } else {
    point.x = event.clientX
    point.y = event.clientY
  }

  return point
}

export default function SvgControls({ children, ...svgProps }) {
  const svg = useRef()
  const isPointerDown = useRef(false)
  const pointerOrigin = useRef({ x: 0, y: 0 })
  const len = 1000
  const [viewBox, setViewBox] = useState({
    x: -len,
    y: -len,
    width: 2 * len,
    height: 2 * len,
  })

  const [newViewBox, setNewViewBox] = useState({
    x: viewBox.x,
    y: viewBox.y,
  })

  const onPointerDown = useCallback(e => {
    isPointerDown.current = true
    pointerOrigin.current = getPointFromEvent(e)
  }, [])

  const onPointerMove = useCallback(
    e => {
      if (!isPointerDown.current) {
        return
      }
      e.preventDefault()
      const pointerPosition = getPointFromEvent(e)
      const ratio = viewBox.width / svg.current.getBoundingClientRect().width
      setNewViewBox({
        x: viewBox.x - (pointerPosition.x - pointerOrigin.current.x) * ratio,
        y: viewBox.y - (pointerPosition.y - pointerOrigin.current.y) * ratio,
      })
    },
    [viewBox],
  )

  const onPointerUp = useCallback(() => {
    isPointerDown.current = false
    setViewBox(viewBox => ({ ...viewBox, ...newViewBox }))
  }, [newViewBox])
  const viewBoxStr = `${newViewBox.x} ${newViewBox.y} ${viewBox.width} ${
    viewBox.height
  }`

  return (
    <svg
      width={1200}
      height={1200}
      ref={svg}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerLeave={onPointerUp}
      viewBox={viewBoxStr}
      {...svgProps}
    >
      {children}
    </svg>
  )
}
