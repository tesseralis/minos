import React, { useCallback, useEffect } from 'react'

import useClickHandler from './useClickHandler'

function useWindowEvent(eventType: any, fn: any) {
  useEffect(() => {
    window.addEventListener(eventType, fn)
    return () => window.removeEventListener(eventType, fn)
  }, [eventType, fn])
}

interface Props {
  onClick(): void
}

/**
 * An empty SVG background element that can deselect on clicks or pressing ESC
 */
export default function Background({ onClick }: Props) {
  const clickHandler = useClickHandler(onClick)

  const handleEscape = useCallback(
    (e) => {
      if (e.which === 27) {
        onClick()
      }
    },
    [onClick],
  )

  useWindowEvent('keydown', handleEscape)

  return (
    <rect
      x={0}
      y={0}
      width="100%"
      height="100%"
      opacity={0}
      {...clickHandler}
    />
  )
}