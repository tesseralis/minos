export function getTerms() {
  return Object.keys(import.meta.glob("./[term]/subpages/*.svx")).map((term) =>
    term.replace(".svx", "").replace("./[term]/subpages/", ""),
  )
}
