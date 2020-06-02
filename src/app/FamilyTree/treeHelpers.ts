import { scaleLinear } from "d3-scale"

import { toCartesian } from "math"
import { getAngleScale } from "app/utils"

import { NUM_GENERATIONS, nodes } from "../graph"

const ringRadiusBase = 400

export function ringRadius(gen: number) {
  return (
    ringRadiusBase * Math.tan((((gen - 1) / NUM_GENERATIONS) * Math.PI) / 2)
  )
}

const getSpread = scaleLinear()
  .domain([1, NUM_GENERATIONS])
  .range([1 / 9, 1 / 2])

function getMinoAngleScale(gen: number) {
  const spread = getSpread(gen)
  return getAngleScale({
    spread,
    start: 1 / 4,
    count: nodes[gen - 1].length,
    reverse: true,
  })
}

// Get the coordinates of the mino with the given generation and index
export function getCoords(gen: number, i: number) {
  const getAngle = getMinoAngleScale(gen)
  return toCartesian({ radius: ringRadius(gen), angle: getAngle(i) })
}
