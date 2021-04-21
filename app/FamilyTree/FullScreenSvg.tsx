import React from "react"
import { css } from "@emotion/react"
import { colors } from "style/theme"

interface Props {
  width: number
  children: React.ReactNode
}

// A full screen SVG
export default function FullScreenSvg({ width, children }: Props) {
  // Only change the viewbox if the prop width changes, not the window ratio
  const viewBox = React.useMemo(() => {
    // const height = (width / window.innerWidth) * window.innerHeight
    // FIXME figure out how to do this based on window
    const height = (width / 16) * 9
    return `-${width / 2} ${-height / 10} ${width} ${height}`
  }, [width])

  return (
    <svg
      css={css`
        width: 100%;
        height: 100%;
        background-color: ${colors.bg};
      `}
      viewBox={viewBox}
    >
      {children}
    </svg>
  )
}
