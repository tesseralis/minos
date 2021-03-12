import { scaleLinear } from "d3-scale"

import { getAngleScale } from "app/utils"
import { NUM_GENERATIONS, nodes, getIndex } from "app/graph"
import { Polyomino } from "mino"
import Vector from "vector"

const ringRadiusBase = 400

// The number of generations to generate eagerly
export const START_GENS = 5

/**
 * Get the radius of the ring at the given generation
 */
export function ringRadius(gen: number) {
  return (
    ringRadiusBase * Math.tan((((gen - 1) / NUM_GENERATIONS) * Math.PI) / 2)
  )
}

const getSpread = scaleLinear()
  .domain([1, NUM_GENERATIONS])
  .range([1 / 9, 1 / 2])

function getMinoAngleScale(gen: number) {
  return getAngleScale({
    spread: getSpread(gen),
    start: 1 / 4,
    count: nodes[gen - 1].length,
    reverse: true,
  })
}

/**
 * Get the coordinates of the given mino given its generation and index
 */
export function getCoords(mino: Polyomino) {
  const gen = mino.order
  const getAngle = getMinoAngleScale(gen)
  return Vector.fromPolar(ringRadius(gen), getAngle(getIndex(mino)))
}
