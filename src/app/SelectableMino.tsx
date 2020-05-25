import React, { memo, useState, useCallback } from "react"
import { css } from "emotion"

import { colors } from "style/theme"
import { getSize } from "mino/mino"
import type { Mino } from "mino/mino"

import useClickHandler from "./useClickHandler"
import MinoSvg from "./MinoSvg"

interface Props {
  mino: Mino
  cx: number
  cy: number
  size: number
  fill: string
  stroke: string
  selected?: boolean
  onSelect?(mino: Mino): void
  onHover?(mino?: Mino): void
}

export default memo(function SelectableMino({
  mino,
  cx,
  cy,
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
        cx={cx}
        cy={cy}
        size={size * (hovered ? 1.25 : 1)}
        fill={fill}
        stroke={selected ? colors.highlight : stroke}
      />
      <circle
        {...handleClick}
        className={css`
          opacity: 0;
          cursor: pointer;
          pointer-events: initial;
        `}
        tabIndex={0}
        cx={cx}
        cy={cy}
        r={(n * size) / 2}
        onMouseOver={() => handleHover(true)}
        onMouseOut={() => handleHover(false)}
      />
    </g>
  )
})
