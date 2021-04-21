import createStateContext from "./createStateContext"
import { Polyomino } from "mino"

type SelectedState = Polyomino | null

const SelectedContext = createStateContext<SelectedState>(null)

export default SelectedContext

export function useSelected() {
  return SelectedContext.useValue()
}

export function useSetSelected() {
  return SelectedContext.useSetValue()
}

// TODO define more selectors
