import React from "react"
import { css } from "@emotion/react"
import Pattern from "./Pattern"
import { orderName } from "mino"
import { NavLink, useMatch } from "react-router-dom"
import { colors } from "style/theme"

const sizes = ["1_4", 5, 6, 7, 8]
const shapes = ["rect", "square"]

function getSizeText(size: number | string) {
  if (typeof size === "string") {
    return "small polyominoes"
  }
  return orderName(size) + "es"
}

function getShapeText(shape: string) {
  if (shape === "rect") return "rectangle"
  return shape
}

function PatternNavLink(props: any) {
  return (
    <NavLink
      css={css`
        font-size: 1.125rem;
        margin-right: 0.5rem;
        text-decoration: none;
      `}
      activecss={css`
        color: ${colors.highlight};
        text-decoration: underline;
      `}
      {...props}
    />
  )
}

function PatternNav() {
  return (
    <nav
      css={css`
        margin-top: 2rem;
        width: 18rem;
      `}
    >
      {sizes.map((size) => (
        <section
          key={size}
          css={css`
            padding: 1rem;

            :not(:last-child) {
              border-bottom: 1px solid ${colors.fg};
            }
          `}
        >
          <h2
            css={css`
              font-size: 1.25rem;
              margin: 0;
            `}
          >
            {getSizeText(size)}
          </h2>
          <div>
            {shapes.map((shape) => {
              return (
                <PatternNavLink key={shape} to={`/packing/${size}-${shape}`}>
                  {getShapeText(shape)}
                </PatternNavLink>
              )
            })}
          </div>
        </section>
      ))}
    </nav>
  )
}

function Info() {
  return (
    <div
      css={css`
        margin: 2rem 4rem;
      `}
    >
      <h1>Packing polyominoes</h1>
      <p>
        Given a set of polyominoes, such as the set of all pentominoes, it is
        natural to ask whether that set can be arranged to form certain
        patterns, such as squares or rectangles, called <em>packing</em>.
        Polyomino packing problems are popular and have been the basis of many
        puzzles and video games.
      </p>

      <p>
        This section reprints patterns sourced from various other polyomino
        sites and publications.
      </p>
    </div>
  )
}

export default function PatternPage() {
  const match = useMatch("/packing/:pattern")!
  const pattern = match?.params?.pattern

  return (
    <div
      css={css`
        width: 100%;
        max-width: 54rem;
        height: 100vh;
        margin-left: 12rem;
        overflow-y: scroll;
        display: flex;
      `}
    >
      <PatternNav />
      <main
        css={css`
          margin: 1rem 0;
          width: 100%;
        `}
      >
        {pattern ? (
          <div
            css={css`
              margin-top: 2rem;
              width: 100%;
              display: flex;
              justify-content: center;
            `}
          >
            <Pattern pattern={pattern} />
          </div>
        ) : (
          <Info />
        )}
      </main>
    </div>
  )
}
