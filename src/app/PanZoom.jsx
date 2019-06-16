import React, { useRef, useEffect } from 'react'
import panzoom from 'panzoom'

// Panzoom has a bug where scrolling (on Mac) is a lot faster on Firefox than on
// Chrome or Safari. Offset this by making the scrollspeed slower if Firefox.
function getNormalizedSpeed(speed) {
  // Detect Firefox: https://stackoverflow.com/a/9851769
  if (typeof InstallTrigger !== 'undefined') {
    return speed / 3
  }
  return speed
}

// TODO styles on panning
export default function PanZoom({ children, zoomSpeed, minZoom, maxZoom }) {
  const group = useRef(null)

  useEffect(() => {
    const instance = panzoom(group.current, {
      smoothScroll: false,
      zoomSpeed: getNormalizedSpeed(zoomSpeed),
      maxZoom,
      minZoom,
    })

    return () => instance.dispose()
  }, [maxZoom, minZoom, zoomSpeed])

  return <g ref={group}>{children}</g>
}
