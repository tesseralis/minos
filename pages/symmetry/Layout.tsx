import React from "react"
import { css } from "@emotion/react"
import { getSymmetryColor } from "components/graph"
import Layout from "components/Layout"
import NavAndContent from "components/NavAndContent"
import SymmetryIcon from "components/SymmetryIcon"
import { capitalize, range } from "lodash"
import { printSymmetry, symmetries } from "mino"
import Link from "next/link"
import { useRouter } from "next/router"
import { ReactElement } from "react"
import { colors } from "style/theme"

export default function SymmetryLayout({
  children,
}: {
  children?: ReactElement
}) {
  return (
    <Layout>
      <NavAndContent
        columns="24rem 1fr"
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
        gap: 1rem 0.75rem;
        align-content: start;
        grid-template-columns: repeat(3, 1fr);
        grid-template-areas:
          ".     all  ."
          "axis2 rot2 diag2"
          "axis  rot  diag"
          ".     none .";
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
            css={css`
              grid-area: ${symmetry};
              display: flex;
              flex-direction: column;
              align-items: center;
              text-align: center;
              gap: 0.5rem;
              text-decoration: ${isActive ? "underline" : "none"};
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
    </div>
  )
}
