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

function getBoundaryFamily(mino: Polyomino) {
  const classes = mino.transform
    .all()
    .map((t) => ({ transform: t, class: t.boundary().family() }))

  // If the mino is convex, make filter out transforms based on locations of anchors
  let filtered = classes
  if (mino.classes.isConvex()) {
    switch (mino.classes.anchors().length) {
      case 3:
        filtered = classes.filter(
          (cls) => !cls.transform.classes.hasAnchor({ x: "end", y: "end" }),
        )
        break
      case 2:
        if (mino.classes.isStaircase()) {
          filtered = classes.filter((cls) =>
            cls.transform.classes.hasAnchor({ x: "start", y: "end" }),
          )
        } else {
          filtered = classes.filter((cls) =>
            cls.transform.classes
              .anchors()
              .every((anchor) => anchor.x === "start"),
          )
        }
        break
      case 1:
        filtered = classes.filter((cls) =>
          cls.transform.classes.hasAnchor({ x: "start", y: "end" }),
        )
        break
      default:
        filtered = classes
    }
  } else if (mino.classes.isBarChart()) {
    filtered = classes.filter((cls) =>
      cls.transform.classes
        .directedAnchors()
        .every((anchor) => anchor.x === "start"),
    )
  } else if (mino.classes.isDirected()) {
    filtered = classes.filter((cls) =>
      cls.transform.classes.isDirectedAtAnchor({ x: "start", y: "end" }),
    )
  }

  if (mino.classes.isSemiConvex()) {
    filtered = filtered.filter((cls) =>
      cls.transform.classes.isConvexAtAxis("column"),
    )
  }
  // Get the right boundary class out of the filtered options
  const boundaryClass = sortBy(filtered, (c) => {
    const counts = countLetters(c.class)
    return [counts["l"], counts["d"]]
  })[0].class
  // Get the representative mino of the class
  const possibleMinos = filtered
    .filter((f) => f.class === boundaryClass)
    .map((f) => f.transform)
  return {
    class: boundaryClass,
    transform: Polyomino.sort(possibleMinos)[0],
  }
}

/**
 * For the mino class, group it up into the different boundary classes
 * and sort them in a way that makes sense.
 */
function getBoundaryFamilies(minoClass: Polyomino[]) {
  const groups = Object.values(
    groupBy(minoClass.map(getBoundaryFamily), (mc) => mc.class),
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
