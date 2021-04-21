import { Rect } from "components/svg"

import useClickHandler from "components/useClickHandler"
import { useSetSelected } from "components/SelectedContext"

/**
 * An empty SVG background element that can deselect on clicks or pressing ESC
 */
export default function Background() {
  const setSelected = useSetSelected()
  const clickHandler = useClickHandler(() => setSelected(null))

  return <Rect width="100%" height="100%" opacity={0} {...clickHandler} />
}
