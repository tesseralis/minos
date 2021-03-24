import React from "react"
import { css } from "@emotion/css"
import Pattern from "./Pattern"
import { NavLink, useMatch } from "react-router-dom"
import { colors } from "style/theme"

const sizes = ["1_4", 5, 6, 7, 8]
const shapes = ["rect", "square"]

function getSizeText(size: string | number) {
  if (size === "1_4") return "1..4"
  return size
}

function getShapeText(shape: string) {
  if (shape === "rect") return "rectangle"
  return shape
}

function PatternNavLink(props: any) {
  return (
    <NavLink
      className={css`
        font-size: 1.25rem;
        margin-left: 0.5rem;
        color: ${colors.fg};
        text-decoration: none;
      `}
      activeClassName={css`
        color: ${colors.highlight};
      `}
      {...props}
    />
  )
}

function PatternNav({ shape }: any) {
  return (
    <nav
      className={css`
        margin-top: 2rem;

        a {
          .active {
            color: ${colors.highlight};
          }
        }
      `}
    >
      <div>
        𝑛 =
        {sizes.map((size) => (
          <PatternNavLink key={size} to={`../../${size}/${shape}`}>
            {getSizeText(size)}
          </PatternNavLink>
        ))}
      </div>
      <div>
        pattern =
        {shapes.map((shape) => (
          <PatternNavLink key={shape} to={`../${shape}`}>
            {getShapeText(shape)}
          </PatternNavLink>
        ))}
      </div>
    </nav>
  )
}

export default function PatternPage() {
  const { params } = useMatch("/packing/:size/:shape")!
  const { size, shape } = params

  return (
    <div
      className={css`
        width: 100%;
        max-width: 48rem;
        height: 100vh;
        margin-left: 10rem;
        overflow-y: scroll;
        display: flex;
        flex-direction: column;
        align-items: center;
      `}
    >
      <PatternNav shape={shape} />
      <div
        className={css`
          margin: 1rem 0;
        `}
      >
        <Pattern size={size} shape={shape} />
      </div>
    </div>
  )
}
