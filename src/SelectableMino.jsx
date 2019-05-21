import React, { memo, useState, useCallback } from 'react'
import { css } from 'glamor'

import { getSize } from './mino/mino'

import useClickHandler from './useClickHandler'
import Mino from './Mino'

function getBlockSize(gen) {
  return 2 + (8 - gen) ** 2 / 2
}

const SelectableMino = memo(({ mino, cx, cy, color, selected, onSelect }) => {
  const [hovered, setHovered] = useState(false)

  const n = getSize(mino)
  const onClick = useCallback(() => onSelect(mino), [mino, onSelect])
  const handleClick = useClickHandler(onClick)
  const size = getBlockSize(n)

  const circleStyle = css({
    opacity: 0,
    cursor: 'pointer',
  })

  return (
    <>
      <Mino
        mino={mino}
        cx={cx}
        cy={cy}
        size={size * (hovered ? 1.25 : 1)}
        fill={color}
        stroke={selected ? 'white' : 'black'}
      />
      <circle
        {...circleStyle}
        {...handleClick}
        cx={cx}
        cy={cy}
        r={(n * size) / 2}
        onMouseOver={() => setHovered(true)}
        onMouseOut={() => setHovered(false)}
      />
    </>
  )
})

export default SelectableMino
