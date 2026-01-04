import fs from "fs"
export const load = async () => {
  const pattern = (
    await import("../(nav)/packing/[pattern]/data/8-square.txt?raw")
  ).default
  return { pattern }
}
