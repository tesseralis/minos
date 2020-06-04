import React from "react"

/**
 * A React Context corresponding to a single state object.
 * Provides hooks for getting and setting the current value.
 *
 * @param defaultValue the default value of the state
 */
export default function createStateContext<T>(defaultValue: T) {
  const ValueContext = React.createContext(defaultValue)
  const SetValueContext = React.createContext((_: T) => {
    /* noop */
  })

  // TODO find a better typing for multiple children
  // for this and other wrapper components
  interface ProviderProps {
    children: React.ReactElement | React.ReactElement[]
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
