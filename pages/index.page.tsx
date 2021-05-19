import fs from "fs"
import Link from "next/link"
import { css } from "@emotion/react"
import Pattern from "components/Pattern"
import { navLinks } from "components/Nav"

function HomePageNav() {
  return (
    <nav
      css={css`
        margin-top: 2rem;

        a {
          margin: 1rem;
          font-size: 1.5rem;
        }
      `}
    >
      {navLinks.map((link) => (
        <Link key={link} href={`/${link}`}>
          <a>{link}</a>
        </Link>
      ))}
    </nav>
  )
}

interface Props {
  pattern: string
}

export default function HomePage({ pattern }: Props) {
  return (
    <div
      css={css`
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        display: grid;
        overflow: hidden;
        grid-template-areas: "center";
      `}
    >
      <div
        css={css`
          grid-area: center;
          opacity: 12.5%;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          transform: scale(5);
        `}
      >
        <Pattern pattern={pattern} />
      </div>
      <main
        css={css`
          grid-area: center;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          z-index: 1000;
        `}
      >
        <div>
          <h1
            css={css`
              display: flex;
              flex-direction: column;
              line-height: 1;
              margin: 0;
            `}
          >
            The
            <span>
              <span
                css={css`
                  font-size: 4rem;
                `}
              >
                Labyrinth
              </span>{" "}
              of
            </span>{" "}
            <span
              css={css`
                font-size: 6rem;
              `}
            >
              Polyominoes
            </span>
          </h1>
          <p
            css={css`
              text-align: right;
              font-size: 1.5rem;
              margin: 0;
            `}
          >
            by{" "}
            <a target="_blank" rel="noreferrer" href="https://www.tessera.li">
              @tesseralis
            </a>
          </p>
        </div>
        <HomePageNav />
      </main>
    </div>
  )
}

export async function getStaticProps() {
  const pattern = fs.readFileSync(
    `${process.cwd()}/pages/packing/data/8-square.txt`,
    "utf-8",
  )
  return { props: { pattern } }
}
