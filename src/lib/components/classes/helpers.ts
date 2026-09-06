import { colors } from "$lib/components/theme"

export function getDirColor(dir: string) {
  return colorMap[dir]
}

const colorMap: Record<string, string> = {
  ru: colors.palette[1],
  lu: colors.palette[2],
  ld: colors.palette[3],
  rd: colors.palette[0],
}
