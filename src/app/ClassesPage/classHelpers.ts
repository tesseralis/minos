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
  const families = mino.transform
    .all()
    .map((t) => ({ mino: t, family: t.boundary().family() }))

  // If the mino is convex, filter out transforms based on locations of anchors
  let filtered = families
  if (mino.classes.isRectangle()) {
    // get rid of rectangle as possibility
  } else if (mino.classes.isFerrers()) {
    // Make sure ferrers diagrams are rooted in the top-left
    // by making sure the opposite end isn't included
    filtered = families.filter(
      (f) => !f.mino.classes.hasAnchor({ x: "end", y: "end" }),
    )
  } else if (mino.classes.isBarChart()) {
    // Make sure both anchors for bar minos are on the left
    filtered = families.filter((f) =>
      f.mino.classes.directedAnchors().every((anchor) => anchor.x === "start"),
    )
  } else if (mino.classes.isDirected()) {
    // Make sure directed minos are rooted in the bottom-left
    filtered = families.filter((f) =>
      f.mino.classes.isDirectedAtAnchor({ x: "start", y: "end" }),
    )
  }

  // Make sure semi-convex minos are in their column-convex state
  // TODO column and row are reversed
  if (mino.classes.isSemiConvex()) {
    filtered = filtered.filter((f) => f.mino.classes.isConvexAtAxis("column"))
  }
  // Choose the boundary word that minimizes the number of "left" and "down"
  // which puts "longer" segments on top
  const family = sortBy(filtered, (c) => {
    const counts = countLetters(c.family)
    return [counts["l"], counts["d"]]
  })[0].family

  // Get the representative mino of the family
  const possibleMinos = filtered
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
  let minos = nodes.flat()
  for (const cls of classInfo) {
    const [matches, nonMatches] = partition(minos, cls.predicate)
    minos = nonMatches
    yield { ...cls, minos: getBoundaryFamilies(matches) }
  }
}
