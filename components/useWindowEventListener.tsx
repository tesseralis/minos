import { useEffect } from "react"

export default function useWindowEvent<K extends keyof WindowEventMap>(
  eventType: K,
  fn: (event: WindowEventMap[K]) => void,
) {
  useEffect(() => {
    window.addEventListener(eventType, fn)
    return () => window.removeEventListener(eventType, fn)
  }, [eventType, fn])
}
