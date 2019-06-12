import React, { memo, useState, useCallback, useMemo } from 'react'
import { css } from 'glamor'
import tinycolor from 'tinycolor2'
import * as d3 from 'd3-path'
import memoize from 'lodash/memoize'

import { generateGraph } from 'mino/generate'
import { getSize } from 'mino/mino'

import { colors } from 'style/theme'

import Background from './Background'
import Mino from './Mino'
import SelectableMino from './SelectableMino'
import PanZoom from './PanZoom'

const tau = 2 * Math.PI
const ringRadiusBase = 400
const numGenerations = 8
const width = 1400

const minScale = 1 / 9
const maxScale = 1 / 2

const { nodes, links, meta } = generateGraph(numGenerations)

function ringRadius(gen) {
  return ringRadiusBase * Math.tan(((gen / numGenerations) * Math.PI) / 2)
}

function det2([[x1, x2], [x3, x4]]) {
  return x1 * x4 - x2 * x3
}

function det3([[x1, x2, x3], [x4, x5, x6], [x7, x8, x9]]) {
  return (
    x1 * det2([[x5, x6], [x8, x9]]) -
    x2 * det2([[x4, x6], [x7, x9]]) +
    x3 * det2([[x4, x5], [x7, x8]])
  )
}

function sumOfSq(x1, x2) {
  return x1 ** 2 + x2 ** 2
}

/**
 * Get the center and radius of a circle containing the three given points
 * http://www.ambrsoft.com/trigocalc/circle3d.htm
 */
function getCenterAndRadius([x1, y1], [x2, y2], [x3, y3]) {
  const A = det3([[x1, y1, 1], [x2, y2, 1], [x3, y3, 1]])
  const d1 = sumOfSq(x1, y1)
  const d2 = sumOfSq(x2, y2)
  const d3 = sumOfSq(x3, y3)
  const B = -det3([[d1, y1, 1], [d2, y2, 1], [d3, y3, 1]])
  const C = det3([[d1, x1, 1], [d2, x2, 1], [d3, x3, 1]])
  const D = -det3([[d1, x1, y1], [d2, x2, y2], [d3, x3, y3]])
  const center = [-B / (2 * A), -C / (2 * A)]
  const radius = Math.sqrt((B ** 2 + C ** 2 - 4 * A * D) / (4 * A ** 2))
  return { center, radius }
}

/**
 * Get the angle of point against origin (x0, y0)
 */
function getAngle([x0, y0], [x1, y1]) {
  return Math.atan2(y1 - y0, x1 - x0)
}

const indices = {}
function getIndex(mino) {
  if (!indices[mino]) {
    const gen = getSize(mino) - 1
    if (!nodes[gen]) {
      throw new Error('gen not found')
    }
    const pos = nodes[gen].indexOf(mino)
    indices[mino] = [gen, pos]
  }
  return indices[mino]
}

function radiusAndAngle([gen, i]) {
  const radius = ringRadius(gen)
  const total = nodes[gen].length
  const turn = total === 1 ? 0.5 : i / (total - 1)
  const scale = minScale + (gen / (numGenerations - 1)) * (maxScale - minScale)
  const scaledTurn = (scale - 1) / 2 - turn * scale
  const angle = scaledTurn * tau
  return { radius, angle }
}

function getCoords(gen, i) {
  const { radius, angle } = radiusAndAngle([gen, i])
  return [radius * Math.sin(angle), radius * -Math.cos(angle)]
}

// Cached colors of each link
const linkColors = links.map(link => {
  const srcMino = link[0]
  const tgtMino = link[1]
  return tinycolor.mix(meta[srcMino].color, meta[tgtMino].color).toHexString()
})

/**
 * Return the path for the link that goes from the source to target mino.
 * The link is a circular that intersects both points as well as a third point
 * scaled according to the radius of the generation.
 */
const getLinkPath = memoize(function([srcMino, tgtMino]) {
  const gen = getSize(srcMino)
  const origin = [0, -ringRadius(gen) * 0.75]
  const src = getCoords(...getIndex(srcMino))
  const tgt = getCoords(...getIndex(tgtMino))

  // Special case: If we're colinear, just draw a straight line
  if (Math.abs(getAngle(origin, src) - getAngle(origin, tgt)) < 0.0001) {
    const path = d3.path()
    path.moveTo(...src)
    path.lineTo(...tgt)
    return path.toString()
  }

  const { radius, center } = getCenterAndRadius(src, tgt, origin)
  const ccw = getAngle(origin, src) > getAngle(origin, tgt)

  const path = d3.path()
  path.moveTo(...src)
  path.arc(
    center[0],
    center[1],
    radius,
    getAngle(center, src),
    getAngle(center, tgt),
    ccw,
  )
  return path.toString()
})

const Orbital = memo(({ minos, gen, selected, onSelect, onHover }) => {
  return (
    <>
      {minos.map((mino, i) => {
        const [x, y] = getCoords(gen, i)
        return (
          <SelectableMino
            selected={!!selected && selected.has(mino)}
            key={i}
            cx={x}
            cy={y}
            mino={mino}
            color={meta[mino].color.toHexString()}
            stroke={meta[mino].borderColor}
            onSelect={onSelect}
            onHover={onHover}
          />
        )
      })}
    </>
  )
})

const linkStyle = css({
  transition: 'stroke 350ms ease-in-out',
  pointerEvents: 'none',
})
const MinoLink = memo(({ link, color, isSelected, opacity, strokeWidth }) => {
  return (
    <path
      {...linkStyle}
      style={{ stroke: isSelected ? 'white' : color }}
      d={getLinkPath(link)}
      fill="none"
      opacity={opacity}
      strokeWidth={strokeWidth * (isSelected ? 2 : 1)}
    />
  )
})

const MinoLinks = memo(({ links, selected, opacity = 1 }) => {
  return (
    <>
      {links.map((link, i) => {
        const srcMino = link[0]
        const gen = getIndex(srcMino)[0]
        const isSelected = selected.has(link.toString())
        const strokeWidth = 4 / (gen / 2 + 1) ** 2
        return (
          <MinoLink
            key={i}
            link={link}
            color={linkColors[i]}
            isSelected={isSelected}
            opacity={opacity}
            strokeWidth={strokeWidth}
          />
        )
      })}
    </>
  )
})

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

export default memo(function MinoGraph() {
  const [selected, setSelected] = useState(null)
  const [hovered, setHovered] = useState(null)

  // Get the selected links
  const { parents, children } = meta[selected] || {}

  const selectedLinks = useMemo(() => {
    const selectedLinks = selected
      ? [...parents]
          .map(p => [p, selected])
          .concat([...children].map(c => [selected, c]))
      : []
    return new Set(selectedLinks.map(link => link.toString()))
  }, [selected, parents, children])

  // Split up the "selected" parent and child minos by generation for performance
  const getSelected = useCallback(
    gen => {
      if (!selected) return null
      const selectedGen = getSize(selected) - 1
      if (gen === selectedGen) {
        return new Set([selected])
      } else if (gen === selectedGen - 1) {
        return parents
      } else if (gen === selectedGen + 1) {
        return children
      }
      return null
    },
    [selected, children, parents],
  )

  return (
    <Svg width={width}>
      <Background onClick={() => setSelected(null)} />
      <PanZoom minZoom={0.25} maxZoom={3} zoomSpeed={0.065}>
        <MinoLinks links={links} selected={selectedLinks} />
        {nodes.map((minoGen, i) => {
          return (
            <Orbital
              minos={minoGen}
              gen={i}
              key={i}
              selected={getSelected(i)}
              onSelect={setSelected}
              onHover={setHovered}
            />
          )
        })}
      </PanZoom>
      {/* Overlay showing the currently hovered mino */}
      {hovered && (
        <Mino
          mino={hovered}
          fill={meta[hovered].color}
          stroke={meta[hovered].borderColor}
          size={32}
          cx={32}
          cy={32}
          anchor="top left"
        />
      )}
    </Svg>
  )
})
