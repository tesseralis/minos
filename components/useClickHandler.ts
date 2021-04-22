import { KeyboardEvent, useRef, useMemo } from "react"
/**
 * Provides handlers that activate on click but not on drag
 */
export default function useClickHandler(onClick: () => void) {
  const dragged = useRef(false)

  return useMemo(
    () => ({
      // Get PEPjs to work: https://github.com/jquery/PEP#using-pep-with-react
      "touch-action": "none",
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

      onKeyPress(e: KeyboardEvent<any>) {
        if (e.which === 32 || e.which === 13) {
          onClick()
        }
      },
    }),
    [onClick],
  )
}
