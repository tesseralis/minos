import React from "react"

export default function createStateContext<T>(defaultValue: T) {
  const ValueContext = React.createContext(defaultValue)
  const SetValueContext = React.createContext((_: T) => {
    /* noop */
  })
  interface ProviderProps {
    children: React.ReactElement
  }

  function Provider({ children }: ProviderProps) {
    const [value, setValue] = React.useState(defaultValue)

    return (
      <SetValueContext.Provider value={setValue}>
        <ValueContext.Provider value={value}>{children}</ValueContext.Provider>
      </SetValueContext.Provider>
    )
  }

  return {
    Provider,
    useValue() {
      return React.useContext(ValueContext)
    },
    useSetValue() {
      return React.useContext(SetValueContext)
    },
  }
}
