import useWindowEventListener from "./useWindowEventListener"
import { useSetSelected } from "./SelectedContext"

/**
 * Global key bindings for the Minos App
 */
export default function KeyBindings() {
  const setSelected = useSetSelected()
  useWindowEventListener("keydown", (e) => {
    if (e.which === 27) {
      setSelected(null)
    }
  })
  return null
}
