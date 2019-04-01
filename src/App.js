import React from 'react'
import { css } from 'glamor'
// TODO don't copy over from the other one
import { lineRadial, curveNatural } from 'd3-shape'

import { getSize } from './mino/mino'
import { generateGraph } from './mino/generate'
import Mino from './Mino'

const tau = 2 * Math.PI
const canvasLength = 1200
const ringRadiusBase = 2000
const numGenerations = 8

const minScale = 1 / 6
const maxScale = 1 / 2

const { nodes, links } = generateGraph(numGenerations)

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
  return [src, ...interpolatePolar(src, tgt, 5), tgt]
}

const curve = lineRadial()
  .radius(d => d.radius)
  .angle(d => d.angle)
  .curve(curveNatural)

function Orbital({ minos, gen }) {
  return (
    <g>
      {minos.map((mino, i) => {
        const [x, y] = getCoords(gen, i)
        return <Mino key={i} cx={x} cy={y} mino={mino} />
      })}
    </g>
  )
}

function Svg({ children }) {
  const viewLength = ringRadius(numGenerations - 1) + 500
  const viewBox = `${-viewLength} ${-500} ${2 * viewLength} ${2 * viewLength}`
  return (
    <svg width={canvasLength} height={canvasLength} viewBox={viewBox}>
      {children}
    </svg>
  )
}

function MinoLink({ link }) {
  return (
    <path
      d={curve(spline(link))}
      fill="none"
      stroke="grey"
      stroke-width="5px"
    />
  )
}

function Polyominoes({ minos, linkData }) {
  return (
    <Svg>
      {linkData.map((link, i) => {
        return <MinoLink link={link} key={i} />
      })}
      {minos.map((minoGen, i) => {
        return <Orbital minos={minoGen} gen={i} key={i} />
      })}
    </Svg>
  )
}

export default function App() {
  const style = css({
    // position: 'fixed',
    // top: 0,
    // left: 0,
    // right: 0,
    // bottom: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    overflowX: 'scroll',
  })

  return (
    <div {...style}>
      <Polyominoes minos={nodes} linkData={links} />
    </div>
  )
}
