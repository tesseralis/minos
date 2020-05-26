import React, { memo, useState, useCallback } from "react"
import { css } from "emotion"

import { Mino, getSize } from "mino"
import { colors } from "style/theme"
import { Point, Circle } from "app/svg"

import useClickHandler from "./useClickHandler"
import MinoSvg from "./MinoSvg"

interface Props {
  mino: Mino
  coord: Point
  size: number
  fill: string
  stroke: string
  selected?: boolean
  onSelect?(mino: Mino): void
  onHover?(mino?: Mino): void
}

export default memo(function SelectableMino({
  mino,
  coord,
  size,
  fill,
  stroke,
  selected = false,
  onSelect,
  onHover,
}: Props) {
  const [hovered, setHovered] = useState(false)

  const n = getSize(mino)
  const onClick = useCallback(() => onSelect?.(mino), [mino, onSelect])
  const handleHover = useCallback(
    (value) => {
      setHovered(value)
      onHover?.(value ? mino : undefined)
    },
    [mino, onHover],
  )
  const handleClick = useClickHandler(onClick)

  return (
    <g>
      <MinoSvg
        mino={mino}
        coord={coord}
        size={size * (hovered ? 1.25 : 1)}
        fill={fill}
        stroke={selected ? colors.highlight : stroke}
      />
      <Circle
        {...handleClick}
        className={css`
          opacity: 0;
          cursor: pointer;
          pointer-events: initial;
        `}
        tabIndex={0}
        center={coord}
        r={(n * size) / 2}
        onHover={handleHover}
      />
    </g>
  )
})
