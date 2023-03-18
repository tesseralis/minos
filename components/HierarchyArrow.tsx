import { colors } from "style/theme"
import { Polygon, svgTransform } from "./svg"

export default function HierarchyArrow({
  direction = "down",
  size,
}: {
  direction?: string
  size: number
}) {
  const width = 1
  return (
    <svg viewBox="-2 -2 4 4" width={size}>
      <Polygon
        transform={svgTransform().rotate(getAngle(direction))}
        fill="none"
        stroke={colors.muted}
        strokeWidth="0.2"
        points={[
          [0, 1],
          [-width, 2],
          [0, -2],
          [width, 2],
        ]}
      />
    </svg>
  )
}

function getAngle(direction: string) {
  switch (direction) {
    case "up right":
      return 45
    case "up left":
      return -45
    case "down":
    default:
      return 0
  }
}
