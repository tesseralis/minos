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
import HierarchyArrow from "components/HierarchyArrow"

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
                transition: background-color 150ms ease-in-out;

                :hover {
                  background-color: ${colors.bg2};
                }
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
        gap: 2rem 0;
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
              gap: 0.25rem;
              padding: 0.5rem;
              padding-top: 0.75rem;
              text-decoration: none;
              &[data-active="true"] {
                color: ${colors.highlight};
              }
              border-radius: 4px;

              transition: background-color 150ms ease-in-out;
              :hover {
                background-color: ${colors.bg2};
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
            <HierarchyArrow direction={direction} size={20} />
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
