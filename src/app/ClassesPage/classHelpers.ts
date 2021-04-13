import { groupBy, sortBy } from "lodash-es"
import { nodes } from "app/graph"
import { Polyomino, MinoClass } from "mino"

interface ClassInfo {
  name: MinoClass
  area: string
  display: string
  link?: string
}

interface ClassMinos extends ClassInfo {
  minos: Polyomino[][]
}

const classInfo: ClassInfo[] = [
  {
    name: "rectangle",
    area: "rect",
    display: "Rectangle",
  },
  {
    name: "ferrersGraph",
    area: "ferr",
    display: "Ferrers Graph",
    link: "https://mathworld.wolfram.com/FerrersGraphPolygon.html",
  },
  {
    name: "staircase",
    area: "stair",
    display: "Staircase",
    link: "https://mathworld.wolfram.com/StaircasePolygon.html",
  },
  {
    name: "stack",
    area: "stack",
    display: "Stack",
    link: "https://mathworld.wolfram.com/StackPolyomino.html",
  },
  {
    name: "directedConvex",
    area: "dcvx",
    display: "Directed Convex",
    link: "https://mathworld.wolfram.com/DirectedConvexPolyomino.html",
  },
  {
    name: "barGraph",
    area: "bar",
    display: "Bar Graph",
    link: "https://mathworld.wolfram.com/BarGraphPolygon.html",
  },
  {
    name: "convex",
    area: "cvx",
    display: "Convex",
    link: "https://mathworld.wolfram.com/ConvexPolyomino.html",
  },
  {
    name: "directedSemiConvex",
    area: "dscvx",
    display: "Directed Semi-Convex",
  },
  {
    name: "semiConvex",
    area: "scvx",
    display: "Semi-Convex",
    link: "https://mathworld.wolfram.com/Row-ConvexPolyomino.html",
  },
  {
    name: "directed",
    area: "dir",
    display: "Directed",
  },
  { name: "other", area: "other", display: "Other" },
]

function countLetters(s: string) {
  const count: Record<string, number> = {}
  for (const c of s) {
    if (!count[c]) {
      count[c] = 0
    }
    count[c]++
  }
  return count
}

/**
 * Get the boundary family for this polyomino and the transform
 * we want to use to represent it in the class diagram.
 */
function getBoundaryFamily(mino: Polyomino) {
  const transforms = mino.transform.all()

  // If the mino is convex, filter out transforms based on locations of anchors
  let filtered = transforms
  if (mino.classes.isRectangle()) {
    // get rid of rectangle as possibility
  } else if (mino.classes.isFerrers()) {
    // Make sure ferrers diagrams are rooted in the top-left
    // by making sure the opposite end isn't included
    filtered = transforms.filter(
      (f) => !f.classes.hasAnchor({ x: "end", y: "end" }),
    )
  } else if (mino.classes.isBar()) {
    // Make sure both anchors for bar minos are on the left
    filtered = transforms.filter((f) =>
      f.classes.directedAnchors().every((anchor) => anchor.x === "start"),
    )
  } else if (mino.classes.isDirected()) {
    // Make sure directed minos are rooted in the bottom-left
    filtered = transforms.filter((f) =>
      f.classes.isDirectedAtAnchor({ x: "start", y: "end" }),
    )
  }

  // Make sure semi-convex minos are in their column-convex state
  // TODO column and row are reversed
  if (mino.classes.isSemiConvex()) {
    filtered = filtered.filter((f) => f.classes.isConvexAtAxis("column"))
  }

  const families = filtered.map((mino) => ({
    mino,
    family: mino.boundary().family(),
  }))
  // Choose the boundary word that minimizes the number of "left" and "down"
  // which puts "longer" segments on top
  const family = sortBy(families, (c) => {
    const counts = countLetters(c.family)
    return [counts["l"], counts["d"]]
  })[0].family

  // Get the representative mino of the family
  const possibleMinos = families
    .filter((f) => f.family === family)
    .map((f) => f.mino)
  // Choose the mino that comes first in the default sort order
  return {
    family,
    mino: Polyomino.sort(possibleMinos)[0],
  }
}

/**
 * For the mino class, group it up into the different boundary classes
 * and sort them in a way that makes sense.
 */
function getBoundaryFamilies(minoClass: Polyomino[]) {
  const groups = Object.values(
    groupBy(minoClass.map(getBoundaryFamily), (mc) => mc.family),
  )
  return sortBy(groups, (group) => -group.length).map((group) =>
    sortBy(
      group.map((item) => item.mino),
      (mino) => [mino.order, -mino.height, -mino.width],
    ),
  )
}

/**
 * Sort the list of polyominoes the various classes
 */
export function* getMinoClasses(): Generator<ClassMinos> {
  const minos = nodes.flat()
  const classes = groupBy(minos, (mino) => mino.classes.best())
  for (const cls of classInfo) {
    yield { ...cls, minos: getBoundaryFamilies(classes[cls.name]) }
  }
}
