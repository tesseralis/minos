import { orderName } from "$lib/mino"
import { capitalize } from "lodash-es"

export function getSizeText(size: number | string) {
  if (size === "1_4") {
    return "small polyominoes"
  }
  return orderName(+size) + "es"
}

export function getShapeText(shape: string) {
  if (shape === "rect") return "rectangle"
  return shape
}

export function getLongName(patternName: string) {
  const [num, type] = patternName.split("-")
  return capitalize(`${getShapeText(type)} (${getSizeText(num)})`)
}
