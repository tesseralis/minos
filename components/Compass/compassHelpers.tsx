import { atom } from "jotai"
import { Transform, RelativeLink, Polyomino } from "mino"
import { getSymmetryColor } from "components/graph"
import { createContext, ReactNode, useContext } from "react"

// Radii for various components of the compass
export const innerRingRadius = 50
export const linkRadius = innerRingRadius + 40
export const outerRingRadius = linkRadius + 30
export const svgSize = outerRingRadius + 5
export const halfRadius = (innerRingRadius + outerRingRadius) / 2

const SelectedContext = createContext<Polyomino>(null as any)
const SetSelectedContext = createContext<(mino: Polyomino) => void>(null as any)

interface ProviderProps {
  selected: Polyomino
  setSelected(mino: Polyomino): void
  children: ReactNode
}

export function SelectedContextProvider({
  selected,
  setSelected,
  children,
}: ProviderProps) {
  return (
    <SelectedContext.Provider value={selected}>
      <SetSelectedContext.Provider value={setSelected}>
        {children}
      </SetSelectedContext.Provider>
    </SelectedContext.Provider>
  )
}

export function useSelected() {
  return useContext(SelectedContext)
}

export function useSetSelected() {
  return useContext(SetSelectedContext)
}

/**
 * Return the color of the selected mino
 */
export function useSelectedColor() {
  const selected = useSelected()
  return getSymmetryColor(selected.transform.symmetry())
}

/**
 * The currently selected relative link.
 */
export const relativeAtom = atom<RelativeLink | null>(null)

/**
 * The currently selected transform
 */
export const transformAtom = atom<Transform | null>(null)
