import { memo, useState, useEffect, useCallback } from "react"
import { css } from "@emotion/react"

import { Polyomino } from "mino"
import { colors } from "style/theme"
import { Circle } from "components/svg"

import useClickHandler from "./useClickHandler"
import MinoSvg from "./MinoSvg"
import { useSetSelected } from "./SelectedContext"
import Vector from "lib/vector"

interface Props {
  mino: Polyomino
  coord: Vector
  size: number
  fill: string
  stroke: string
  anchor?: string
  selected?: boolean
  onHover?(mino?: Polyomino): void
}

export default memo(function SelectableMino({
  mino,
  coord,
  size,
  fill,
  stroke,
  anchor,
  selected = false,
  onHover,
}: Props) {
  const [hovered, setHovered] = useState(false)
  const setSelected = useSetSelected()

  const n = mino.order
  const onClick = useCallback(() => setSelected(mino), [mino, setSelected])
  const handleHover = useCallback(
    (value) => {
      setHovered(value)
      onHover?.(value ? mino : undefined)
    },
    [mino, onHover],
  )
  const handleClick = useClickHandler(onClick)

  // Hover out when the component unmounts
  // NOTE: make sure the `onHover` callback is memoized!
  useEffect(() => {
    return () => {
      onHover?.(undefined)
    }
  }, [onHover])

  return (
    <g>
      <MinoSvg
        mino={mino}
        coord={coord}
        size={size * (hovered ? 1.25 : 1)}
        fill={fill}
        anchor={anchor}
        stroke={selected ? colors.highlight : stroke}
      />
      <Circle
        {...handleClick}
        css={css`
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