import fs from "fs"
import Link from "next/link"
import { css } from "@emotion/react"
import Pattern from "components/Pattern"
import { navLinks } from "components/Nav"
import { colors } from "style/theme"
import { media } from "style/media"

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
          justify-self: center;
          align-self: center;
          overflow: hidden;
          transform: scale(3);

          @media ${media.sm} {
            transform: scale(4);
          }

          @media ${media.md} {
            transform: scale(5);
          }
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
          padding: 1rem;
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
                  font-size: 3rem;
                  @media ${media.sm} {
                    font-size: 4rem;
                  }
                `}
              >
                Labyrinth
              </span>{" "}
              of
            </span>{" "}
            <span
              css={css`
                font-size: 4rem;
                @media ${media.sm} {
                  font-size: 6rem;
                }
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
            <a
              target="_blank"
              rel="noreferrer"
              href="https://tesseralis.site"
              css={css`
                font-family: monospace;
              `}
            >
              @tesseralis
            </a>
          </p>
        </div>
        <EnterLink />
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

function HomePageNav() {
  return (
    <nav
      css={css`
        display: flex;
        flex-direction: column;
        flex-wrap: wrap;
        gap: 0.5rem 1.5rem;
        font-size: 1.5rem;
        text-align: center;

        @media ${media.md} {
          flex-direction: row;
        }
      `}
    >
      {navLinks.map((link) => (
        <Link key={link} href={`/${link}`}>
          {link}
        </Link>
      ))}
    </nav>
  )
}

function EnterLink() {
  return (
    <Link
      href="/intro"
      passHref
      css={css`
        background-color: ${colors.bg};
        border: 1px solid ${colors.fg};
        padding: 0.5rem 2rem;
        margin: 1rem;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 1.5rem;
        text-decoration: none;
        transition: background-color 250ms ease-in-out;

        :hover {
          background-color: #333;
        }
      `}
    >
      Enter
    </Link>
  )
}
