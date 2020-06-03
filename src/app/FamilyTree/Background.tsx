import React from "react"
import { Rect } from "app/svg"

import useClickHandler from "app/useClickHandler"

interface Props {
  onClick(): void
}

/**
 * An empty SVG background element that can deselect on clicks or pressing ESC
 */
export default function Background({ onClick }: Props) {
  const clickHandler = useClickHandler(onClick)

  return <Rect width="100%" height="100%" opacity={0} {...clickHandler} />
}
