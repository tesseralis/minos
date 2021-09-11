import { Polyomino } from "mino"
import { atom } from "jotai"
import { useAtomValue, useUpdateAtom } from "jotai/utils"

type SelectedState = Polyomino | null

export const selectedAtom = atom<SelectedState>(null)

export function useSelected() {
  return useAtomValue(selectedAtom)
}

export function useSetSelected() {
  return useUpdateAtom(selectedAtom)
}
