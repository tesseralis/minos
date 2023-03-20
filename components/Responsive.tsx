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
      setIsMatch(watcher.matches)
      return () => watcher.removeEventListener("change", updateMatch)
    }
  }, [query, updateMatch])

  // TODO (static css) convert this component to something that can be done with linaria.
  // By default, render both but place one under `display: none` depending on the query.
  // The effect should toggle which one renders in the DOM tree
  return (
    <>
      {shouldShowMatch && (
        <div
          data-matches="true"
          css={css`
            /* https://stackoverflow.com/a/36584829 */
            @media not all and ${query} {
              display: none;
            }
          `}
        >
          {match}
        </div>
      )}
      {shouldShowDefault && (
        <div
          data-matches="false"
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
