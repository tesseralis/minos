import React from "react"
import { Rect } from "app/svg"

import useClickHandler from "app/useClickHandler"
import { useSetSelected } from "app/SelectedContext"

/**
 * An empty SVG background element that can deselect on clicks or pressing ESC
 */
export default function Background() {
  const setSelected = useSetSelected()
  const clickHandler = useClickHandler(() => setSelected(null))

  return <Rect width="100%" height="100%" opacity={0} {...clickHandler} />
}
