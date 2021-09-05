import { groupBy, sortBy } from "lodash-es"
import { nodes } from "components/graph"
import { Polyomino, MinoClass } from "mino"

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

const minos = nodes.flat()
const classes = groupBy(minos, (mino) => mino.classes.best())

function groupBoundaryFamilies(minoClass: Polyomino[]) {
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
 * Return the polyominoes belonging to the given polyomino class
 * grouped by their boundary families.
 */
export function getBoundaryFamilies(cls: MinoClass) {
  return groupBoundaryFamilies(classes[cls])
}

export function escapeClass(cls: string) {
  return cls.toLowerCase().replace(/ /g, "-")
}

export function unescapeClass(cls: string): MinoClass {
  return cls.replace(/-/g, " ").replace("ferrers", "Ferrers") as MinoClass
}
