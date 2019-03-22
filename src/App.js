import React from 'react'
import { css } from 'glamor'
// TODO don't copy over from the other one
import { lineRadial, curveNatural } from 'd3-shape'

import { getSize } from './mino/mino'
import { generateGraph } from './mino/generate'
import Mino from './Mino'

const tau = 2 * Math.PI
const canvasLength = 1000
const ringRadiusBase = 4000
const numGenerations = 8

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

function getCoords(turn, gen) {
  const rad = ringRadius(gen)
  return [rad * Math.sin(turn * tau), rad * -Math.cos(turn * tau)]
}

const indices = {}
function getIndex(mino) {
  if (!indices[mino]) {
    const gen = getSize(mino) - 1
    console.log('index of', mino.toString(2), 'is', gen)
    if (!nodes[gen]) {
      throw new Error('gen not found')
    }
    console.log(gen)
    const pos = nodes[gen].indexOf(mino)
    indices[mino] = [gen, pos]
  }
  return indices[mino]
}

function radiusAndAngle([gen, i]) {
  const radius = ringRadius(gen)
  const angle = (i / nodes[gen].length) * tau
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
  const radius = ringRadius(gen)
  return (
    <g>
      <circle r={radius} fill="none" stroke="black" />
      {minos.map((mino, i) => {
        const [x, y] = getCoords(i / minos.length, gen)
        return <Mino key={i} cx={x} cy={y} mino={mino} />
      })}
    </g>
  )
}

function Svg({ children }) {
  const viewLength = ringRadius(numGenerations - 1) + 20
  const viewBox = `${-viewLength} ${-viewLength} ${2 * viewLength} ${2 *
    viewLength}`
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
      stroke="black"
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
  for (let [src, tgt] of links) {
    console.log(src.toString(2), tgt.toString(2))
  }
  const style = css({
    // position: 'fixed',
    // top: 0,
    // left: 0,
    // right: 0,
    // bottom: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  })

  return (
    <div {...style}>
      <Polyominoes minos={nodes} linkData={links} />
    </div>
  )
}
