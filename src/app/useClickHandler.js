import { useRef, useMemo } from 'react'
/**
 * Provides handlers that activate on click but not on drag
 */
export default function useClickHandler(onClick) {
  const dragged = useRef(false)

  return useMemo(
    () => ({
      onPointerDown() {
        dragged.current = false
      },

      onPointerMove() {
        dragged.current = true
      },

      onPointerUp() {
        if (!dragged.current) {
          onClick()
        }
      },

      onKeyPress(e) {
        if (e.which === 32 || e.which === 13) {
          onClick()
        }
      },
    }),
    [onClick],
  )
}
