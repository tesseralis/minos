import React from "react"

import { Mino } from "mino"

type SelectedState = Mino | null

const SelectedContext = React.createContext<SelectedState>(null)
const SetSelectedContext = React.createContext((_: SelectedState) => {
  void 0
})

interface ProviderProps {
  children: React.ReactElement
}

export function SelectedProvider({ children }: ProviderProps) {
  const [selected, setSelected] = React.useState<SelectedState>(null)
  return (
    <SetSelectedContext.Provider value={setSelected}>
      <SelectedContext.Provider value={selected}>
        {children}
      </SelectedContext.Provider>
    </SetSelectedContext.Provider>
  )
}

export function useSelected() {
  return React.useContext(SelectedContext)
}

export function useSetSelected() {
  return React.useContext(SetSelectedContext)
}
