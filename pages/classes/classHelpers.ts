import { groupBy, sortBy } from "lodash"
import { nodes } from "components/graph"
import { Polyomino, O_OCTOMINO } from "mino"

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
  // and that the concavity is facing to the right
  if (mino.classes.isSemiConvex() && !mino.classes.isConvex()) {
    filtered = filtered.filter((f) => f.boundary().family().includes("lur"))
  }

  // TODO these extra conditionals have to be in because there's a bug
  // in `isPreDirected` affecting higher-classed minos
  // Predirected (bent tree) minos should go from the bottom left
  if (
    !mino.classes.isDirected() &&
    !mino.classes.isSemiConvex() &&
    mino.classes.isPreDirected()
  ) {
    filtered = filtered.filter(
      (f) =>
        f.classes.isSemiDirectedAtSide("bottom") &&
        f.classes.isSemiDirectedAtSide("left"),
    )
  }

  if (
    !mino.classes.isDirected() &&
    !mino.classes.isSemiConvex() &&
    mino.classes.isSemiDirected()
  ) {
    filtered = filtered.filter((f) => f.classes.isSemiDirectedAtSide("bottom"))
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

const minos = nodes
  .flat()
  .concat([
    Polyomino.fromString("011_101_111_101"),
    Polyomino.fromString("101_111_010_111"),
    Polyomino.fromString("110_101_111_101_011"),
    Polyomino.fromString("101_111_010_111_101"),
    Polyomino.fromString("0101_1111_1010_0111"),
    Polyomino.fromString("0111_1010_1111_1010"),
    Polyomino.fromString("0111_1010_1111_1001"),
    Polyomino.fromString("0111_1010_1111_0101"),
  ])
const classes = groupBy(minos, (mino) => mino.classes.get().name())

function groupBoundaryFamilies(minoClass: Polyomino[]) {
  const groups = Object.entries(
    groupBy(minoClass.map(getBoundaryFamily), (mc) => mc.family),
  ).map(([family, minos]) => ({ family, minos }))
  return sortBy(groups, ({ family, minos }) => -minos.length).map(
    ({ family, minos }) => {
      return {
        family,
        minos: groupAndSortFamily(minos.map((item) => item.mino)),
      }
    },
  )
}

// Group family by size and sort by width and height
function groupAndSortFamily(family: Polyomino[]) {
  const byGen = groupBy(family, (mino) => mino.order)
  const genList: Polyomino[][] = []
  for (const [gen, minos] of Object.entries(byGen)) {
    genList[+gen] = sortBy(minos, (mino) => [-mino.height, -mino.width])
  }
  return genList
}

/**
 * Return the polyominoes belonging to the given polyomino class
 * grouped by their boundary families.
 */
export function getBoundaryFamilies(cls: string) {
  return groupBoundaryFamilies(classes[cls] ?? [])
}

export function escapeClass(cls: string) {
  return cls.toLowerCase().replace(/ /g, "-")
}

export function unescapeClass(cls: string): string {
  return cls.replace(/-/g, " ") as string
}
