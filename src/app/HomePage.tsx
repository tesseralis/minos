import Link from "next/link"
import { css } from "@emotion/css"
import Pattern from "app/PackingPage/Pattern"

const links = ["catalog", "packing", "tiling", "classes", "genealogy"]
function HomePageNav() {
  return (
    <nav
      className={css`
        margin-top: 2rem;
      `}
    >
      {links.map((link) => (
        <Link key={link} href={`/${link}`}>
          <a
            className={css`
              margin: 1rem;
              font-size: 1.5rem;
            `}
          >
            {link}
          </a>
        </Link>
      ))}
    </nav>
  )
}

export default function HomePage() {
  return (
    <div
      className={css`
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
        className={css`
          grid-area: center;
          opacity: 25%;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          transform: scale(5);
        `}
      >
        {/* <Pattern pattern="8-square" /> */}
      </div>
      <main
        className={css`
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
            className={css`
              display: flex;
              flex-direction: column;
              line-height: 1;
              margin: 0;
            `}
          >
            The
            <span>
              <span
                className={css`
                  font-size: 4rem;
                `}
              >
                Labyrinth
              </span>{" "}
              of
            </span>{" "}
            <span
              className={css`
                font-size: 6rem;
              `}
            >
              Polyominoes
            </span>
          </h1>
          <p
            className={css`
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
