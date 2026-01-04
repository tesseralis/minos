/**
 * Provides wrappers for SVG elements with Props updated for convenience.
 */

import type { Instance as Color } from "tinycolor2"
import Vector from "$lib/vector"
import type { SVGAttributes } from "svelte/elements"

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
  onhover?(hovered: boolean): void
}

export interface SVGProps<T extends EventTarget>
  extends Omit<SVGAttributes<T>, keyof ExtendedSVGProps>,
    ExtendedSVGProps {}

export function getBaseSVGProps<T extends EventTarget>({
  transform,
  fill,
  stroke,
  onhover,
  ...props
}: SVGProps<T>): SVGAttributes<T> {
  return {
    ...props,
    transform: transform?.toString(),
    fill: fill?.toString(),
    stroke: stroke?.toString(),
    onmouseover: onhover ? () => onhover(true) : undefined,
    onmouseout: onhover ? () => onhover(false) : undefined,
    // Key events to accompany mouse events
    // TODO just switch to pointer events?
    onfocus: onhover ? () => onhover(true) : undefined,
    onblur: onhover ? () => onhover(false) : undefined,
  }
}
