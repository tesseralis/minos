import { Polyomino } from "$lib/mino"
import type { PageLoad } from "./$types"

export const load: PageLoad = ({ params }) => {
  return {
    mino: Polyomino.of(params.mino),
  }
}
