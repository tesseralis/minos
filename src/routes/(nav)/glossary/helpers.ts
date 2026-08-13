export function getTerms() {
  // Upgrading vite broke the previous way this was done.
  // TODO make this pull from the list again
  return [
    "boundary-word",
    "convex",
    "diagonally-directed",
    "fixed",
    "free",
    "hole",
    "one-sided",
    "orthogonally-directed",
    "puncture",
  ]
  // return Object.keys(import.meta.glob("./[term]/subpages/*.svx")).map((term) =>
  //   term.replace(".svx", "").replace("./[term]/subpages/", ""),
  // )
}
