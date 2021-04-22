import {
  ReactElement,
  createContext,
  useContext,
  useState as useReactState,
} from "react"
/**
 * A React Context corresponding to a single state object.
 * Provides hooks for getting and setting the current value.
 *
 * @param defaultValue the default value of the state
 */
export default function createStateContext<T>(defaultValue: T) {
  const ValueContext = createContext(defaultValue)
  const SetValueContext = createContext((_: T) => {
    /* noop */
  })

  // TODO find a better typing for multiple children
  // for this and other wrapper components
  interface ProviderProps {
    children: ReactElement | ReactElement[]
  }

  function Provider({ children }: ProviderProps) {
    const [value, setValue] = useReactState(defaultValue)

    return (
      <SetValueContext.Provider value={setValue}>
        <ValueContext.Provider value={value}>{children}</ValueContext.Provider>
      </SetValueContext.Provider>
    )
  }

  function useValue() {
    return useContext(ValueContext)
  }

  function useSetValue() {
    return useContext(SetValueContext)
  }

  function useState(): [T, (_: T) => void] {
    return [useValue(), useSetValue()]
  }

  return {
    Provider,
    useValue,
    useSetValue,
    useState,
  }
}
