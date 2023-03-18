import React, { ReactNode } from "react"
import { css } from "@emotion/react"
import { getSymmetryColor } from "components/graph"
import Layout from "components/Layout"
import NavAndContent from "components/NavAndContent"
import SymmetryIcon from "components/SymmetryIcon"
import { capitalize } from "lodash"
import { printSymmetry, symmetries } from "mino"
import Link from "next/link"
import { useRouter } from "next/router"
import { colors } from "style/theme"
import { Polygon, svgTransform } from "components/svg"

export default function SymmetryLayout({ children }: { children?: ReactNode }) {
  return (
    <Layout>
      <NavAndContent
        columns="20rem 1fr"
        nav={
          <div
            css={css`
              padding-top: 2rem;
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: center;
              width: 100%;
              gap: 2rem;
            `}
          >
            <SubsectionLinks />
            <Link
              href={`/symmetry/table`}
              css={css`
                font-size: 1.5rem;
                text-decoration: none;
                padding: 0.5rem 1rem;
                border: 1px solid ${colors.border};
              `}
            >
              Full Table
            </Link>
          </div>
        }
      >
        {children}
      </NavAndContent>
    </Layout>
  )
}

function SubsectionLinks() {
  const router = useRouter()
  return (
    <div
      css={css`
        display: grid;
        gap: 2rem 0.75rem;
        align-content: start;
        grid-template-columns: repeat(3, 1fr);
        grid-template-rows: repeat(4, 1fr);
        grid-template-areas:
          "a     all  b"
          "axis2 rot2 diag2"
          "axis  rot  diag"
          "c     none d";
        [data-area="all"] {
          align-self: end;
        }
      `}
    >
      {symmetries.map((symmetry) => {
        const route = `/symmetry/${symmetry}`
        const isActive = router.asPath === route
        const name = capitalize(printSymmetry(symmetry))
        // split into two lines based on where the first space is
        // https://stackoverflow.com/a/4607799 (why is JS so bad)
        const [first, last] = name.split(/ (.*)/)
        return (
          <Link
            key={symmetry}
            href={route}
            data-active={isActive}
            data-area={symmetry}
            css={css`
              grid-area: ${symmetry};
              display: flex;
              flex-direction: column;
              align-items: center;
              text-align: center;
              gap: 0.5rem;
              padding-top: 0.5rem;
              text-decoration: none;
              &[data-active="true"] {
                color: ${colors.highlight};
              }
            `}
          >
            <SymmetryIcon
              symmetry={symmetry}
              size={50}
              fill="none"
              stroke={getSymmetryColor(symmetry)}
            />
            {last ? (
              <>
                {first}
                <br />
                {last}
              </>
            ) : (
              first
            )}
          </Link>
        )
      })}
      {arrows.map(([gridArea, direction], index) => {
        return (
          <div
            key={index}
            css={css`
              grid-area: ${gridArea.flatMap((x) => [x, x]).join(" / ")};
              align-self: center;
              justify-self: center;
            `}
          >
            <Arrow direction={direction} />
          </div>
        )
      })}
    </div>
  )
}

const arrows: [(string | number)[], string][] = [
  [["all", "rot2"], "up"],
  [["a", "rot2"], "up right"],
  [["all", "diag2"], "up left"],
  [["axis2", "axis"], "up"],
  [["axis2", "rot"], "up left"],
  [["rot2", "rot"], "up"],
  [["rot2", "diag"], "up right"],
  [["diag2", "diag"], "up"],
  [["axis", "none"], "up left"],
  [["rot", "none"], "up"],
  [["rot", "d"], "up right"],
]

function Arrow({ direction = "down" }: { direction?: string }) {
  const width = 1
  return (
    <svg viewBox="-2 -2 4 4" width={20}>
      <Polygon
        transform={svgTransform().rotate(getAngle(direction))}
        fill="none"
        stroke={colors.muted}
        strokeWidth="0.1"
        points={[
          [0, 1],
          [-width, 2],
          [0, -2],
          [width, 2],
        ]}
      />
    </svg>
  )
}

function getAngle(direction: string) {
  switch (direction) {
    case "up right":
      return 45
    case "up left":
      return -45
    case "down":
    default:
      return 0
  }
}
