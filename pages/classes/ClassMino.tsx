import { getMinoColor } from "components/graph"
import MinoLink from "components/MinoLink"
import { Polyline } from "components/svg"
import { getAnchor } from "components/utils"
import Vector from "lib/vector"
import { minBy } from "lodash"
import { Polyomino } from "mino"
import { getDirColor } from "./words"

interface Props {
  mino: Polyomino
  size: number
}

export default function ClassMino({ mino, size }: Props) {
  const { stroke, fill } = getMinoColor(mino)
  const segments = getPathSegments(mino, size)
  return (
    <div>
      <MinoLink
        to={`/catalog/${mino.toString()}`}
        mino={mino}
        size={size}
        fill={fill}
        stroke={stroke}
        strokeWidth={4}
        gridStyle="thin"
      >
        {segments.map(({ dir, points }, index) => {
          return (
            <Polyline
              key={index}
              points={points}
              stroke={getDirColor(dir)}
              strokeWidth={2}
              strokeLinecap="round"
              fill="none"
            />
          )
        })}
      </MinoLink>
    </div>
  )
}

function getPathSegments(mino: Polyomino, size: number) {
  const outline = mino.boundary().outline()
  const scale = (v: Vector) => v.scale(size)
  const scaledOutline = outline.map(scale)
  const anchorPoint = getAnchor(scaledOutline, "center center")

  const translate = (v: Vector) => v.sub(anchorPoint)
  const outlinePoints = scaledOutline.map(translate)
  // get the bottom-right point of the outline
  const bottomRow = outlinePoints.filter(
    (point) => point.y === Math.max(...outlinePoints.map((p) => p.y)),
  )
  const startPoint = minBy(bottomRow, (p) => p.x)!
  // shift so we start with the bottom right
  const index = outlinePoints.findIndex((p) => p.equals(startPoint))
  const cycledOutline = outlinePoints
    .slice(index)
    .concat(outlinePoints.slice(0, index))

  // group the segments together
  const groups = []
  let horizDir = "right"
  let vertDir = "up"
  let current = { dir: horizDir[0] + vertDir[0], points: [] as Vector[] }
  for (let i = 0; i < cycledOutline.length; i += 2) {
    const p0 = cycledOutline[i]
    const p1 = cycledOutline[i + 1]
    const p2 = cycledOutline[i + 2] ?? cycledOutline[0] // end case
    const horizVec = p1.sub(p0)
    const vertVec = p2.sub(p1)
    if (
      getDirection(horizVec) !== horizDir ||
      getDirection(vertVec) !== vertDir
    ) {
      current.points.push(p0)
      groups.push(current)
      horizDir = getDirection(horizVec)
      vertDir = getDirection(vertVec)
      current = {
        dir: horizDir[0] + vertDir[0],
        points: [p0, p1],
      }
    } else {
      current.points.push(p0)
      current.points.push(p1)
    }
  }
  current.points.push(cycledOutline[0])
  groups.push(current)
  return groups
}

function getDirection(v: Vector) {
  if (v.x === 0 && v.y > 0) {
    return "down"
  } else if (v.x === 0 && v.y < 0) {
    return "up"
  } else if (v.x > 0 && v.y === 0) {
    return "right"
  } else if (v.x < 0 && v.y === 0) {
    return "left"
  } else {
    throw new Error(`Invalid cardinal direction given: ${v.toString()}`)
  }
}
