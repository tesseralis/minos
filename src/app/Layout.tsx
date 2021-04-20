import React from "react"
import { css } from "@emotion/css"
import { useLocation } from "react-router-dom"

interface Props {
  children?: React.ReactElement
  topLeft?: React.ReactElement
  topRight?: React.ReactElement
  bottomLeft?: React.ReactElement
  bottomRight?: React.ReactElement
}

const overlayInfo = [
  { name: "topLeft", align: "start", justify: "start" },
  { name: "topRight", align: "start", justify: "end" },
  { name: "bottomLeft", align: "end", justify: "start" },
  { name: "bottomRight", align: "end", justify: "end" },
] as const

/**
 * A Layout that supports central content and one overlay at each corner.
 */
export default function Layout({ children, ...overlays }: Props) {
  // hack to not display nav on homepage for now
  const location = useLocation()
  if (location.pathname === "/") {
    return children || null
  }
  return (
    <div
      className={css`
        display: grid;
        position: fixed;
        top: 0;
        left: 0;
        bottom: 0;
        right: 0;
        /* Needed to make the content full-height in Safari */
        width: 100%;
        height: 100%;
      `}
    >
      {overlayInfo.map(
        ({ name, align, justify }) =>
          overlays[name] && (
            <div
              key={name}
              className={css`
                grid-area: 1/1;
                align-self: ${align};
                justify-self: ${justify};
                padding: 2rem;
                /* Overlays should be above the content below */
                z-index: 100;
                /* TODO Hack for the Compass */
                pointer-events: ${name === "topRight" ? "none" : "initial"};
              `}
            >
              {overlays[name]}
            </div>
          ),
      )}
      {/* Render the main content at the very last */}
      <div
        className={css`
          grid-area: 1 / 1;
          /* Needed to make the content full-height in Safari */
          display: flex;
        `}
      >
        {children}
      </div>
    </div>
  )
}
