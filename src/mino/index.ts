export type { Coord } from "./data"

export type { Symmetry, Transform } from "./transform"
export { default as Polyomino } from "./Polyomino"
export type { PossibleRelativeLink, RelativeLink } from "./Polyomino"
export { MONOMINO, O_OCTOMINO } from "./constants"
export { MinoPattern, parsePattern } from "./pattern"
// this shouldn't actually be used; it's a hack to solve the circular dependency problem
// TODO (refactor) use the "internal index" pattern:
// https://medium.com/visual-development/how-to-fix-nasty-circular-dependency-issues-once-and-for-all-in-javascript-typescript-a04c987cf0de
export { getTiling } from "./tiling"
