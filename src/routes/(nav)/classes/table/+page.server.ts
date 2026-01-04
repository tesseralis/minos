import type { PageServerLoad } from "./$types"
import { classSymbols } from "../helpers.server"

export const load: PageServerLoad = () => {
  return { classSymbols }
}
