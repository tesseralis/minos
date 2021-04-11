import { groupBy, partition, sortBy } from "lodash-es"
import { nodes } from "app/graph"
import { Polyomino } from "mino"

interface ClassInfo {
  name: string
  display: string
  predicate(m: Polyomino): boolean
  link?: string
}

interface ClassMinos extends ClassInfo {
  minos: Polyomino[][]
}

const classInfo: ClassInfo[] = [
  {
    name: "rect",
    display: "Rectangle",
    predicate: (m) => m.classes.isRectangle(),
  },
  {
    name: "ferr",
    display: "Ferrers Graph",
    predicate: (m) => m.classes.isFerrers(),
    link: "https://mathworld.wolfram.com/FerrersGraphPolygon.html",
  },
  {
    name: "stair",
    display: "Staircase",
    predicate: (m) => m.classes.isStaircase(),
    link: "https://mathworld.wolfram.com/StaircasePolygon.html",
  },
  {
    name: "stack",
    display: "Stack",
    predicate: (m) => m.classes.isStack(),
    link: "https://mathworld.wolfram.com/StackPolyomino.html",
  },
  {
    name: "dcvx",
    display: "Directed Convex",
    predicate: (m) => m.classes.isDirected() && m.classes.isConvex(),
    link: "https://mathworld.wolfram.com/DirectedConvexPolyomino.html",
  },
  {
    name: "bar",
    display: "Bar Graph",
    predicate: (m) => m.classes.isBarChart(),
    link: "https://mathworld.wolfram.com/BarGraphPolygon.html",
  },
  {
    name: "cvx",
    display: "Convex",
    predicate: (m) => m.classes.isConvex(),
    link: "https://mathworld.wolfram.com/ConvexPolyomino.html",
  },
  {
    name: "dscvx",
    display: "Directed Semi-Convex",
    predicate: (m) => m.classes.isDirected() && m.classes.isSemiConvex(),
  },
  {
    name: "scvx",
    display: "Semi-Convex",
    predicate: (m) => m.classes.isSemiConvex(),
    link: "https://mathworld.wolfram.com/Row-ConvexPolyomino.html",
  },
  {
    name: "dir",
    display: "Directed",
    predicate: (m) => m.classes.isDirected(),
  },
  { name: "other", display: "Other", predicate: () => true },
]

/**
 * For the mino class, group it up into the different boundary classes
 * and sort them in a way that makes sense.
 */
function getBoundaryFamilies(minoClass: Polyomino[]) {
  const groups = Object.values(
    groupBy(
      minoClass.map((mino) => mino.boundaryClassWithTransform()),
      (mc) => mc.class,
    ),
  )
  return sortBy(groups, (group) => -group.length).map((group) =>
    sortBy(
      group.map((item) => item.transform),
      (mino) => [mino.order, -mino.height, -mino.width],
    ),
  )
}

/**
 * Sort the list of polyominoes the various classes
 */
function* populateMinos(): Generator<ClassMinos> {
  let minos = nodes.flat()
  for (const cls of classInfo) {
    const [matches, nonMatches] = partition(minos, cls.predicate)
    minos = nonMatches
    yield { ...cls, minos: getBoundaryFamilies(matches) }
  }
}

const classes = [...populateMinos()]

export { classes }
