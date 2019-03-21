import React, { Component } from 'react'
import { css } from 'glamor'
// TODO don't copy over from the other one
import { nodes, links } from './minos.json'
import { lineRadial, curveNatural } from 'd3-shape'

const tau = 2 * Math.PI
const canvasLength = 500
const ringRadiusBase = 500
const numGenerations = 6

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

function blockSize(gen) {
  return 40
  // return 7 * (10 - gen)
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
function spline({ source, target }) {
  const src = radiusAndAngle(source)
  const tgt = radiusAndAngle(target)
  return [src, ...interpolatePolar(src, tgt, 5), tgt]
}

const curve = lineRadial()
  .radius(d => d.radius)
  .angle(d => d.angle)
  .curve(curveNatural)

const colors = [
  '',
  'tomato',
  'darkorange',
  'gold',
  'lightgreen',
  'lightskyblue',
  'plum',
]

function Mino({ mino, cx, cy, onHover }) {
  const size = blockSize(mino.length)
  const xAvg = avg(...mino.map(c => c[0]))
  const yAvg = avg(...mino.map(c => c[1]))

  const color = colors[mino.length]

  return (
    <g onMouseOver={onHover}>
      {mino.map(([x, y], i) => {
        return (
          <rect
            key={i}
            x={cx + (x - xAvg) * size - size / 2}
            y={cy + (y - yAvg) * size - size / 2}
            width={size}
            height={size}
            stroke="slategray"
            fill={color}
          />
        )
      })}
    </g>
  )
}

function Orbital({ minos, gen, onHover }) {
  const radius = ringRadius(gen)
  return (
    <g>
      <circle r={radius} fill="none" stroke="black" />
      {minos.map((mino, i) => {
        const [x, y] = getCoords(i / minos.length, gen)
        return (
          <Mino
            key={i}
            cx={x}
            cy={y}
            mino={mino}
            onHover={() => onHover([gen, i])}
          />
        )
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

function nodeEquals(node1, node2 = [0, 0]) {
  return node1[0] === node2[0] && node1[1] === node2[1]
}

function isLinkSelected(link, selectedMino) {
  return (
    nodeEquals(link.source, selectedMino) ||
    nodeEquals(link.target, selectedMino)
  )
}

function MinoLink({ link, isSelected }) {
  return (
    <path
      d={curve(spline(link))}
      fill="none"
      stroke={isSelected ? 'grey' : 'lightgrey'}
    />
  )
}

class Polyominoes extends Component {
  constructor(props) {
    super(props)
    this.state = {}
  }

  render() {
    const { minos, linkData } = this.props
    const { selectedMino } = this.state
    return (
      <Svg>
        {linkData.map((link, i) => {
          return (
            <MinoLink
              link={link}
              key={i}
              isSelected={isLinkSelected(link, selectedMino)}
            />
          )
        })}
        {minos.map((minoGen, i) => {
          return (
            <Orbital
              minos={minoGen}
              gen={i}
              key={i}
              onHover={this.setSelected}
            />
          )
        })}
      </Svg>
    )
  }

  setSelected = mino => {
    this.setState({
      selectedMino: mino,
    })
  }
}

class App extends Component {
  render() {
    const style = css({
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
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
}

export default App
