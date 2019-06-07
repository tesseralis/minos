import React, { useState, useEffect, useCallback } from 'react'
import { css } from 'glamor'

import { colors } from 'style/theme'
import useClickHandler from './useClickHandler'
import Mino from './Mino'
import MinoGraph from './MinoGraph'
import PanZoom from './PanZoom'
import InfoButton from './InfoButton'

const width = 1400

function Svg({ width, children }) {
  const style = css({
    width: '100%',
    height: '100%',
    backgroundColor: colors.bg,
  })
  // TODO make sure this viewbox definition makes sense for a variety of aspect ratios
  const viewBox = `-${width / 2} ${-width / 25} ${width} ${width / 2}`

  return (
    <svg {...style} viewBox={viewBox}>
      {children}
    </svg>
  )
}

/**
 * An empty background element that can deselect on clicks or pressing ESC
 */
function Background({ onClick }) {
  const clickHandler = useClickHandler(onClick)

  const handleEscape = useCallback(
    e => {
      if (e.which === 27) {
        onClick()
      }
    },
    [onClick],
  )

  useEffect(() => {
    window.addEventListener('keydown', handleEscape)

    return () => {
      window.removeEventListener('keydown', handleEscape)
    }
  }, [handleEscape])

  return (
    <rect
      x={0}
      y={0}
      width="100%"
      height="100%"
      opacity={0}
      {...clickHandler}
    />
  )
}

export default function App() {
  const [selected, setSelected] = useState(null)
  const [hovered, setHovered] = useState(null)

  const style = css({
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  })

  const infoButtonStyle = css({
    position: 'fixed',
    bottom: '2rem',
    right: '2rem',
  })

  return (
    <div {...style}>
      <div {...infoButtonStyle}>
        <InfoButton />
      </div>
      <Svg width={width}>
        <Background onClick={() => setSelected(null)} />
        <PanZoom minZoom={0.25} maxZoom={2} zoomSpeed={0.065}>
          <MinoGraph
            selected={selected}
            onSelect={setSelected}
            onHover={setHovered}
          />
        </PanZoom>
        {hovered && (
          <Mino
            mino={hovered.mino}
            fill={hovered.color}
            stroke="black"
            size={32}
            cx={32}
            cy={32}
            anchor="top left"
          />
        )}
      </Svg>
    </div>
  )
}
