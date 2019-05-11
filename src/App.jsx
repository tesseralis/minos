import React, { memo, useState, useCallback } from 'react'
import { css } from 'glamor'
import { lineRadial, curveNatural } from 'd3-shape'

import { getSize } from './mino/mino'
import { generateGraph } from './mino/generate'
import Mino from './Mino'
import SvgPanZoom from './SvgPanZoom'

const tau = 2 * Math.PI
const ringRadiusBase = 800
const numGenerations = 8
const width = 2800

const minScale = 1 / 6
const maxScale = 1 / 2

const { nodes, links, meta } = generateGraph(numGenerations)

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

function ringRadius(gen) {
  return ringRadiusBase * Math.tan(((gen / numGenerations) * Math.PI) / 2)
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
  const scaledTurn = turn * scale + (1 - scale) / 2
  const angle = scaledTurn * tau
  return { radius, angle }
}

function getCoords(gen, i) {
  const { radius, angle } = radiusAndAngle([gen, i])
  return [radius * Math.sin(angle), radius * -Math.cos(angle)]
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

const Orbital = ({ minos, gen, selected, onSelect }) => {
  return (
    <>
      {minos.map((mino, i) => {
        const [x, y] = getCoords(gen, i)
        return (
          <Mino
            selected={!!selected && selected.has(mino)}
            key={i}
            cx={x}
            cy={y}
            mino={mino}
            onSelect={onSelect}
          />
        )
      })}
    </>
  )
}

const MinoLinks = memo(({ links, stroke, strokeWidth }) => {
  return (
    <>
      {links.map((link, i) => {
        const gen = getIndex(link[0])[0]
        return (
          <path
            key={i}
            d={curve(spline(link))}
            fill="none"
            stroke={stroke}
            opacity={1 - gen / 10}
            strokeWidth={strokeWidth}
          />
        )
      })}
    </>
  )
})

const Polyominoes = memo(({ minos, linkData }) => {
  const [selected, setSelected] = useState(null)
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
    <>
      <MinoLinks links={linkData} stroke="grey" strokeWidth={0.5} />
      {selected && (
        <MinoLinks links={selectedLinks} stroke="purple" strokeWidth={2} />
      )}
      {minos.map((minoGen, i) => {
        return (
          <Orbital
            minos={minoGen}
            gen={i}
            key={i}
            selected={getSelected(i)}
            onSelect={setSelected}
          />
        )
      })}
    </>
  )
})

export default function App() {
  const style = css({
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  })

  const textStyle = css({
    fontSize: '100px',
    fontFamily: '"Palatino Linotype", "Book Antiqua", Palatino, serif',
    fontStyle: 'italic',
    fill: 'gray',
  })

  const subHeaderStyle = css({
    fontSize: '40px',
    fontFamily: '"Palatino Linotype", "Book Antiqua", Palatino, serif',
    fontStyle: 'italic',
    fill: 'gray',
  })

  return (
    <div {...style}>
      <SvgPanZoom initialWidth={width} zoomMin={0.2} zoomMax={1}>
        <text {...textStyle} x={-1200} y={40}>
          The Labyrinth of Minos
        </text>
        <text {...subHeaderStyle} x={-1100} y={100}>
          by @tesseralis
        </text>
        <Polyominoes minos={nodes} linkData={links} />
      </SvgPanZoom>
    </div>
  )
}
