import React, { memo, useState, useCallback } from 'react'

import { getSize } from './mino/mino'

import Mino from './Mino'

function getBlockSize(gen) {
  return 2 + (8 - gen) ** 2 / 2
}

const SelectableMino = memo(({ mino, cx, cy, color, selected, onSelect }) => {
  const [hovered, setHovered] = useState(false)

  const n = getSize(mino)
  const onClick = useCallback(() => onSelect(mino), [mino, onSelect])

  return (
    <Mino
      mino={mino}
      cx={cx}
      cy={cy}
      size={getBlockSize(n) * (hovered ? 1.25 : 1)}
      fill={color}
      stroke={selected ? 'white' : 'black'}
      onClick={onClick}
      onMouseOver={() => setHovered(true)}
      onMouseOut={() => setHovered(false)}
    />
  )
})

export default SelectableMino
