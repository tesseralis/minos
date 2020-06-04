import createStateContext from "./createStateContext"
import { Mino } from "mino"

type SelectedState = Mino | null

const SelectedContext = createStateContext<SelectedState>(null)

export default SelectedContext

export function useSelected() {
  return SelectedContext.useValue()
}

export function useSetSelected() {
  return SelectedContext.useSetValue()
}

// TODO define more selectors
