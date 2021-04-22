import { Point, Polygon, PolygonProps, svgTransform } from "components/svg"
import { colors } from "style/theme"
import {
  TransformCtx,
  innerRingRadius as radius,
  useSelected,
  useSelectedColor,
} from "./compassHelpers"

interface RotMarkerProps extends Omit<PolygonProps, "points"> {
  // if true, render asymmetric symbol
  chiral?: boolean
}

function RotationMarker({ chiral, ...svgProps }: RotMarkerProps) {
  const size = 10
  const points: Point[] = [[0, size], [size, 0], chiral ? [0, 0] : [-size, 0]]
  return <Polygon {...svgProps} strokeWidth={2} points={points} />
}

const rotationList = [
  "identity",
  "rotateRight",
  "rotateHalf",
  "rotateLeft",
] as const

const rotationHover = new Map<string, number>(
  rotationList.map((t, i) => [t, i]),
)

/**
 * Displays arrows/markers representing the rotational symmetry of the mino.
 */
export default function RotationMarkers() {
  const mino = useSelected()
  const color = useSelectedColor()
  const transform = TransformCtx.useValue()
  const order = rotationList.filter((t) => mino.transform.hasSymmetry(t)).length
  // TODO display properly for diagonally reflective minos
  const hoverIndex = transform ? rotationHover.get(transform)! : 0
  return (
    <g>
      {[0, 1, 2, 3].map((index) => {
        // Whether the index is visible
        const shouldShow = index % (4 / order) === 0
        // Whether the index is hovered or not
        const isHover =
          !!transform && (index - hoverIndex + 4) % (4 / order) === 0

        return (
          (shouldShow || isHover) && (
            <RotationMarker
              key={index}
              fill={isHover ? colors.highlight : color}
              chiral={mino.transform.isOneSided()}
              transform={svgTransform()
                .translate(0, -radius)
                .rotate(90 * index)}
            />
          )
        )
      })}
    </g>
  )
}
