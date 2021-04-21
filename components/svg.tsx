/**
 * Provides wrappers for SVG elements with Props updated for convenience.
 */

import { SVGProps as ReactSVGProps } from "react"
import type { Instance as Color } from "tinycolor2"
import Vector from "vector"

// SVGs can accept either arrays or vectors for point coordinates
export type Point = Vector | readonly [number, number]
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
  onHover?(hovered: boolean): void
}

interface SVGProps<T>
  extends Omit<ReactSVGProps<T>, keyof ExtendedSVGProps>,
    ExtendedSVGProps {}

function getBaseSVGProps<T>({
  transform,
  fill,
  stroke,
  onHover,
  ...props
}: SVGProps<T>): ReactSVGProps<T> {
  return {
    ...props,
    transform: transform?.toString(),
    fill: fill?.toString(),
    stroke: stroke?.toString(),
    onMouseOver: onHover ? () => onHover(true) : undefined,
    onMouseOut: onHover ? () => onHover(false) : undefined,
    // Key events to accompany mouse events
    // TODO just switch to pointer events?
    onFocus: onHover ? () => onHover(true) : undefined,
    onBlur: onHover ? () => onHover(false) : undefined,
  }
}

export interface LineProps
  extends Omit<SVGProps<SVGLineElement>, "x1" | "x2" | "y1" | "y2"> {
  p1: Point
  p2: Point
}

export function Line({ p1: [x1, y1], p2: [x2, y2], ...svgProps }: LineProps) {
  return <line {...getBaseSVGProps(svgProps)} x1={x1} y1={y1} x2={x2} y2={y2} />
}

export interface PolygonProps
  extends Omit<SVGProps<SVGPolygonElement>, "points"> {
  points: readonly Point[]
}

export function Polygon({ points, ...svgProps }: PolygonProps) {
  return (
    <polygon
      {...getBaseSVGProps(svgProps)}
      points={points.map(([x, y]) => `${x},${y}`).join(" ")}
    />
  )
}

export interface CircleProps
  extends Omit<SVGProps<SVGCircleElement>, "cx" | "cy"> {
  center?: Point
}

export function Circle({
  center: [cx, cy] = Vector.ZERO,
  ...svgProps
}: CircleProps) {
  return <circle {...getBaseSVGProps(svgProps)} cx={cx} cy={cy} />
}

export interface RectProps extends Omit<SVGProps<SVGRectElement>, "x" | "y"> {
  coord?: Point
}

export function Rect({ coord: [x, y] = Vector.ZERO, ...svgProps }: RectProps) {
  return <rect {...getBaseSVGProps(svgProps)} x={x} y={y} />
}

export interface TextProps extends Omit<SVGProps<SVGTextElement>, "x" | "y"> {
  coord?: Point
}

export function Text({ coord: [x, y] = Vector.ZERO, ...svgProps }: TextProps) {
  return <text {...getBaseSVGProps(svgProps)} x={x} y={y} />
}

export function G(props: SVGProps<SVGGElement>) {
  return <g {...getBaseSVGProps(props)} />
}
