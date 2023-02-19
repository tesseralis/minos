import { css } from "@emotion/react"
import React, { ReactNode, useCallback, useEffect, useState } from "react"

interface Props {
  query: string
  // what to show when the query matches
  match: ReactNode
  // what to show when it doesn't
  default: ReactNode
}
/**
 * A component that displays one thing if the given media query matches,
 * another thing if it doesn't.
 */
export default function Responsive({ query, match, default: def }: Props) {
  // TODO fix this; setting it to "initial" doesn't actually work
  const [isMatch, setIsMatch] = useState<"initial" | boolean>("initial")
  const shouldShowMatch = isMatch === "initial" || !!isMatch
  const shouldShowDefault = isMatch === "initial" || !isMatch

  const updateMatch = useCallback((e: any) => {
    setIsMatch(e.matches)
  }, [])

  useEffect(() => {
    if (typeof window !== "undefined") {
      const watcher = window.matchMedia(query)
      watcher.addEventListener("change", updateMatch)
      // setIsMatch(watcher.matches)
      return () => watcher.removeEventListener("change", updateMatch)
    }
  }, [updateMatch])

  // By default, render both but place one under `display: none` depending on the query.
  // The effect should toggle which one renders in the DOM tree
  return (
    <>
      {shouldShowMatch && (
        <div
          css={css`
            @media not ${query} {
              display: none;
            }
          `}
        >
          {match}
        </div>
      )}
      {shouldShowDefault && (
        <div
          css={css`
            @media ${query} {
              display: none;
            }
          `}
        >
          {def}
        </div>
      )}
    </>
  )
}
