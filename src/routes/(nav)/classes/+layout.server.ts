import type { LayoutServerLoad } from "./$types"
import { classSymbols } from "./helpers.server"

export const load: LayoutServerLoad = () => {
  return { classSymbols }
}
