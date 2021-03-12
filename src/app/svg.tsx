/**
 * Provides wrappers for SVG elements with Props updated for convenience.
 */

import React from "react"
import type { Instance as Color } from "tinycolor2"
import Vector from "vector"

// Re-export Point for convenience
export type Point = Vector
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
  extends Omit<React.SVGProps<T>, keyof ExtendedSVGProps>,
    ExtendedSVGProps {}

function getBaseSVGProps<T>({
  transform,
  fill,
  stroke,
  onHover,
  ...props
}: SVGProps<T>): React.SVGProps<T> {
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

export function Line({ p1, p2, ...svgProps }: LineProps) {
  return (
    <line
      {...getBaseSVGProps(svgProps)}
      x1={p1.x}
      y1={p1.y}
      x2={p2.x}
      y2={p2.y}
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
      points={points.map((p) => `${p.x},${p.y}`).join(" ")}
    />
  )
}

export interface CircleProps
  extends Omit<SVGProps<SVGCircleElement>, "cx" | "cy"> {
  center?: Point
}

export function Circle({ center = Vector.ZERO, ...svgProps }: CircleProps) {
  return <circle {...getBaseSVGProps(svgProps)} cx={center.x} cy={center.y} />
}

export interface RectProps extends Omit<SVGProps<SVGRectElement>, "x" | "y"> {
  coord?: Point
}

export function Rect({ coord = Vector.ZERO, ...svgProps }: RectProps) {
  return <rect {...getBaseSVGProps(svgProps)} x={coord.x} y={coord.y} />
}

export interface TextProps extends Omit<SVGProps<SVGTextElement>, "x" | "y"> {
  coord?: Point
}

export function Text({ coord = Vector.ZERO, ...svgProps }: TextProps) {
  return <text {...getBaseSVGProps(svgProps)} x={coord.x} y={coord.y} />
}

export function G(props: SVGProps<SVGGElement>) {
  return <g {...getBaseSVGProps(props)} />
}
