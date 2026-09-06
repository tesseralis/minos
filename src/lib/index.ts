// place files you want to import through the `$lib` alias in this folder.

export const directions = ["left", "right", "up", "down"] as const
export type Direction = (typeof directions)[number]

export function minWith<T>(xs: Iterable<T>, cmp: (a: T, b: T) => number) {
  let min = null
  for (const x of xs) {
    if (min == null) {
      min = x
    } else {
      min = cmp(min, x) <= 0 ? min : x
    }
  }
  return min!
}
