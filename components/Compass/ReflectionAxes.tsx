import { useAtomValue } from "jotai/utils"
import { Line, svgTransform } from "components/svg"
import { colors } from "style/theme"
import {
  transformAtom,
  innerRingRadius as radius,
  useSelected,
  useSelectedColor,
} from "./compassHelpers"

export const reflectionOrder = [
  "flipVert",
  "flipMainDiag",
  "flipHoriz",
  "flipMinorDiag",
] as const

/**
 * Displays a line corresponding to the axes of the mino
 */
export default function ReflectionAxes() {
  const mino = useSelected()
  const color = useSelectedColor()
  const selectedTrans = useAtomValue(transformAtom)
  return (
    <g opacity={2 / 3}>
      {reflectionOrder.map((reflection, i) => {
        const isHovered = reflection === selectedTrans
        return (
          (mino.transform.hasSymmetry(reflection) || isHovered) && (
            <Line
              key={i}
              p1={[-radius, 0]}
              p2={[radius, 0]}
              stroke={isHovered ? colors.highlight : color}
              strokeWidth={isHovered ? 4 : 2}
              transform={svgTransform().rotate(45 * i)}
            />
          )
        )
      })}
    </g>
  )
}
