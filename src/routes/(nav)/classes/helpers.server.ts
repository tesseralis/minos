// Stuff that should only be used on the server
import katex from "katex"
import { DirClass } from "$lib/mino"

function getClassTex(dirClass: DirClass) {
  return `\\textrm{Dir}_{${printLevel(dirClass.ortho)}}^{${printLevel(dirClass.diag)}}`
}

function printLevel(level: any) {
  switch (level) {
    case "2-cis":
      return "2\\textrm{c}"
    case "2-trans":
      return "2\\textrm{t}"
    default:
      return level
  }
}

export const classSymbols = Object.fromEntries(
  DirClass.all().map((cls) => {
    return [cls.code(), katex.renderToString(getClassTex(cls))]
  }),
)
