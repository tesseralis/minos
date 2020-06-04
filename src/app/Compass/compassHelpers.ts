import { getSymmetry } from "mino"
import { getSymmetryColor } from "app/graph"
import { useSelected as useSelectedNullable } from "app/SelectedContext"

// Radii for various components of the compass
export const innerRingRadius = 50
export const linkRadius = innerRingRadius + 40
export const outerRingRadius = linkRadius + 30
export const svgSize = outerRingRadius + 5
export const halfRadius = (innerRingRadius + outerRingRadius) / 2

export function useSelected() {
  const selected = useSelectedNullable()
  if (!selected) {
    throw new Error("Attempted to render when no mino selected")
  }
  return selected
}

/**
 * Return the color of the selected mino
 */
export function useSelectedColor() {
  const selected = useSelected()
  return getSymmetryColor(getSymmetry(selected))
}
