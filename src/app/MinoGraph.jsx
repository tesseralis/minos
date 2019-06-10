import React, { memo, useState, useEffect, useCallback } from 'react'
import { css } from 'glamor'
import tinycolor from 'tinycolor2'
import { lineRadial, curveNatural } from 'd3-shape'
import * as d3 from 'd3-path'

import { generateGraph } from 'mino/generate'
import { getSize } from 'mino/mino'

import { colors } from 'style/theme'

import useClickHandler from './useClickHandler'
import Mino from './Mino'
import SelectableMino from './SelectableMino'
import PanZoom from './PanZoom'

const tau = 2 * Math.PI
const ringRadiusBase = 400
const numGenerations = 8
const width = 1400

const minScale = 1 / 9
const maxScale = 1 / 2 - 1 / 64 // make sure the angles are strictly negative

function sum(arr) {
  return arr.reduce((a, b) => a + b, 0)
}

function avg(...arr) {
  return sum(arr) / arr.length
}
function avgAngle(a, b) {
  const x = Math.abs(a - b)
  const result = x < Math.PI ? (a + b) / 2 : (a + b) / 2 + Math.PI
  return result % (2 * Math.PI)
}

function avgPolar(a, b) {
  const radius = avg(a.radius, b.radius)
  const angle = avgAngle(a.angle, b.angle)
  return { radius, angle }
}

function interpolatePolar(a, b, n = 0) {
  const half = avgPolar(a, b)
  if (n === 0) {
    return [half]
  } else {
    return [
      ...interpolatePolar(a, half, n - 1),
      half,
      ...interpolatePolar(half, b, n - 1),
    ]
  }
}

function ringRadius(gen) {
  return ringRadiusBase * Math.tan(((gen / numGenerations) * Math.PI) / 2)
}

const { nodes, links, meta } = generateGraph(numGenerations)

// Add inbetween values in between the edges so we have a curve
function spline([source, target]) {
  const src = radiusAndAngle(getIndex(source))
  const tgt = radiusAndAngle(getIndex(target))
  return [src, ...interpolatePolar(src, tgt, 2), tgt]
  // return [src, tgt]
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
 */
function getCenterAndRadus([x1, y1], [x2, y2], [x3, y3]) {
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

const curve = lineRadial()
  .radius(d => d.radius)
  .angle(d => d.angle)
  .curve(curveNatural)

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

const linkColors = links.map(link => {
  const srcMino = link[0]
  const tgtMino = link[1]
  return tinycolor.mix(meta[srcMino].color, meta[tgtMino].color).toHexString()
})

const linkPaths = links.map(link => {
  const srcMino = link[0]
  const tgtMino = link[1]
  const gen = getSize(srcMino)
  const origin = [0, -ringRadius(gen) / 2]
  const src = getCoords(...getIndex(srcMino))
  const tgt = getCoords(...getIndex(tgtMino))

  const { radius, center } = getCenterAndRadus(src, tgt, origin)
  const angle1 = getAngle(center, src)
  const angle2 = getAngle(center, tgt)
  const ccw = angle1 > angle2
  const path = d3.path()

  path.moveTo(...src)
  path.arc(center[0], center[1], radius, angle1, angle2, ccw)
  return path.toString()
})

const Orbital = ({ minos, gen, selected, onSelect, onHover }) => {
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
            onSelect={onSelect}
            onHover={onHover}
          />
        )
      })}
    </>
  )
}

const MinoLinks = memo(({ links, stroke, strokeWidth, opacity = 1 }) => {
  const style = css({
    pointerEvents: 'none',
  })

  return (
    <>
      {links.map((link, i) => {
        const srcMino = link[0]
        const color = linkColors[i]
        const gen = getIndex(srcMino)[0]
        return (
          <path
            {...style}
            key={i}
            d={linkPaths[i]}
            fill="none"
            opacity={opacity}
            stroke={stroke || color}
            strokeWidth={strokeWidth || 4 / (gen / 2 + 1) ** 2}
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

export default memo(function MinoGraph() {
  const [selected, setSelected] = useState(null)
  const [hovered, setHovered] = useState(null)

  const { parents, children } = meta[selected] || {}
  const selectedLinks = selected
    ? [...children, ...parents].map(relative => [selected, relative])
    : []

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
      <PanZoom minZoom={0.25} maxZoom={2} zoomSpeed={0.065}>
        <MinoLinks links={links} />
        {selected && (
          <MinoLinks
            links={selectedLinks}
            stroke="white"
            strokeWidth={1.5}
            opacity={0.33}
          />
        )}
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
      {hovered && (
        <Mino
          mino={hovered}
          fill={meta[hovered].color}
          stroke="black"
          size={32}
          cx={32}
          cy={32}
          anchor="top left"
        />
      )}
    </Svg>
  )
})
