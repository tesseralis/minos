import { getTerms } from "./helpers"

export const load = async () => {
  return {
    terms: getTerms(),
  }
}
