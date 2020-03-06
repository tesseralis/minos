import React, { memo, useState, useCallback } from 'react'
import { css } from 'emotion'

import { colors } from 'style/theme'
import { getSize } from 'mino/mino'

import useClickHandler from './useClickHandler'
import Mino from './Mino'

function getBlockSize(gen) {
  return 2 + (8 - gen) ** 2 / 2
}

const SelectableMino = memo(
  ({
    mino,
    cx,
    cy,
    color,
    stroke,
    selected,
    onSelect = () => {},
    onHover = () => {},
  }) => {
    const [hovered, setHovered] = useState(false)

    const n = getSize(mino)
    const onClick = useCallback(() => onSelect(mino), [mino, onSelect])
    const handleHover = useCallback(
      value => {
        setHovered(value)
        onHover(value ? mino : null)
      },
      [mino, onHover],
    )
    const handleClick = useClickHandler(onClick)
    const size = getBlockSize(n)

    return (
      <g>
        <Mino
          mino={mino}
          cx={cx}
          cy={cy}
          size={size * (hovered ? 1.25 : 1)}
          fill={color}
          stroke={selected ? colors.fg : stroke}
        />
        <circle
          {...handleClick}
          className={css`
            opacity: 0;
            cursor: pointer;
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
  },
)

export default SelectableMino
