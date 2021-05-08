import { Transform, RelativeLink } from "mino"
import { getSymmetryColor } from "components/graph"
import createStateContext from "components/createStateContext"
import { useSelected as useSelectedNullable } from "components/SelectedContext"

// Radii for various components of the compass
export const innerRingRadius = 50
export const linkRadius = innerRingRadius + 40
export const outerRingRadius = linkRadius + 30
export const svgSize = outerRingRadius + 5
export const halfRadius = (innerRingRadius + outerRingRadius) / 2

/**
 * A version of `useSelected` that throws an error if no mino is selected.
 * Useful since the compass should only render if a selected mino is available.
 */
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
  return getSymmetryColor(selected.transform.symmetry())
}

/**
 * Context for the currently selected relative link
 */
export const RelativeCtx = createStateContext<RelativeLink | null>(null)

/**
 * Context for the currently selected transform
 */
export const TransformCtx = createStateContext<Transform | null>(null)