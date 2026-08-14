import type { Polyomino, RelativeLink, Transform } from "$lib/mino"
import { getContext, setContext } from "svelte"
import { getAnchor } from "../utils"
import Vector from "$lib/vector"

// Radii for various components of the compass
export const innerRingRadius = 50
export const linkRadius = innerRingRadius + 40
export const outerRingRadius = linkRadius + 30
export const svgSize = outerRingRadius + 5
export const halfRadius = (innerRingRadius + outerRingRadius) / 2

function getBlockSize(gen: number) {
  return 125 / (gen + 4)
}

export function getMinoSizeAndTransform(mino: Polyomino) {
  const size = getBlockSize(mino.order)
  const outline = mino.boundary().outline()
  const anchor = getAnchor(
    outline.map((v) => Vector.fromPackedPoint(v).scale(size)),
    "center center",
  )
  const transform = (p: Vector) => p.scale(size).sub(anchor)
  return { size, transform }
}

const contextKey = {}

export function setCompassContext(value: CompassContext) {
  setContext(contextKey, value)
}

export function getCompassContext() {
  return getContext(contextKey) as CompassContext
}

export class CompassContext {
  relativeLink?: RelativeLink = $state(undefined)
  transform?: Transform = $state(undefined)
}
