import Link from "next/link"
import { css } from "@emotion/react"
import Pattern from "components/Pattern"
import Layout from "components/Layout"
import { orderName } from "mino"
import { colors } from "style/theme"
import { useRouter } from "next/router"
import Info from "./Info.mdx"

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

function PatternNav() {
  const router = useRouter()
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
              const route = `/packing/${size}-${shape}`
              const isActive = router.asPath.startsWith(route)
              return (
                <Link key={shape} href={route} passHref>
                  <a
                    css={css`
                      font-size: 1.125rem;
                      margin-right: 0.5rem;
                      color: ${isActive ? colors.highlight : colors.fg};
                      text-decoration: ${isActive ? "underline" : "none"};
                    `}
                  >
                    {getShapeText(shape)}
                  </a>
                </Link>
              )
            })}
          </div>
        </section>
      ))}
    </nav>
  )
}

export default function PackingPage({ pattern }: { pattern?: string }) {
  return (
    <Layout>
      <div
        css={css`
          overflow-y: scroll;
          display: flex;
        `}
      >
        <PatternNav />
        <main
          css={css`
            margin: 1rem 0;
            width: 100%;
            max-width: 36rem;
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
            <div
              css={css`
                margin: 2rem 4rem;
              `}
            >
              <Info />
            </div>
          )}
        </main>
      </div>
    </Layout>
  )
}
