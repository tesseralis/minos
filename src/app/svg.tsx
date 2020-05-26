import React from "react"
import { Point } from "math"
import type { Instance as Color } from "tinycolor2"

export type { Point } from "math"
export type { Instance as Color } from "tinycolor2"

export class SVGTransform {
  #result = ""

  translate(x: number, y: number): this {
    this.#result = `translate(${x} ${y}) ${this.#result}`
    return this
  }

  rotate(angle: number): this {
    this.#result = `rotate(${angle}) ${this.#result}`
    return this
  }

  toString() {
    return this.#result
  }
}

/**
 * an SVG transform with a fluid API
 */
export function svgTransform() {
  return new SVGTransform()
}

interface ExtendedSVGProps {
  transform?: SVGTransform
  fill?: Color | string
  stroke?: Color | string
}

interface SVGProps<T>
  extends Omit<React.SVGProps<T>, keyof ExtendedSVGProps>,
    ExtendedSVGProps {}

function getBaseSVGProps<T>({
  transform,
  fill,
  stroke,
  ...props
}: SVGProps<T>): React.SVGProps<T> {
  return {
    ...props,
    transform: transform?.toString(),
    fill: fill?.toString(),
    stroke: stroke?.toString(),
  }
}

export interface LineProps
  extends Omit<SVGProps<SVGLineElement>, "x1" | "x2" | "y1" | "y2"> {
  p1: Point
  p2: Point
}

export function Line({ p1, p2, ...svgProps }: LineProps) {
  return (
    <line
      {...getBaseSVGProps(svgProps)}
      x1={p1[0]}
      y1={p1[1]}
      x2={p2[0]}
      y2={p2[1]}
    />
  )
}

export interface PolygonProps
  extends Omit<SVGProps<SVGPolygonElement>, "points"> {
  points: readonly Point[]
}

export function Polygon({ points, ...svgProps }: PolygonProps) {
  return (
    <polygon
      {...getBaseSVGProps(svgProps)}
      points={points.map((p) => p.join(",")).join(" ")}
    />
  )
}

export interface CircleProps
  extends Omit<SVGProps<SVGCircleElement>, "cx" | "cy"> {
  center?: Point
}

export function Circle({
  center: [cx, cy] = [0, 0],
  ...svgProps
}: CircleProps) {
  return <circle {...getBaseSVGProps(svgProps)} cx={cx} cy={cy} />
}

export interface RectProps extends Omit<SVGProps<SVGRectElement>, "x" | "y"> {
  coord?: Point
}

export function Rect({ coord: [x, y] = [0, 0], ...svgProps }: RectProps) {
  return <rect {...getBaseSVGProps(svgProps)} x={x} y={y} />
}
