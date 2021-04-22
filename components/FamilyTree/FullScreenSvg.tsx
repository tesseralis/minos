import { ReactNode, useMemo } from "react"
import { css } from "@emotion/react"
import { colors } from "style/theme"

interface Props {
  width: number
  children: ReactNode
}

// A full screen SVG
export default function FullScreenSvg({ width, children }: Props) {
  // Only change the viewbox if the prop width changes, not the window ratio
  const viewBox = useMemo(() => {
    // TODO does setting this matter if the window size is different?
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
