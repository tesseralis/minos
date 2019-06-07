import React, { memo, useState, useEffect, useCallback } from 'react'
import { css } from 'glamor'
import tinycolor from 'tinycolor2'
import { lineRadial, curveNatural } from 'd3-shape'

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
const maxScale = 1 / 2

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
        const tgtMino = link[1]

        const color = tinycolor
          .mix(meta[srcMino].color, meta[tgtMino].color)
          .toHexString()
        const gen = getIndex(srcMino)[0]
        return (
          <path
            {...style}
            key={i}
            d={curve(spline(link))}
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
