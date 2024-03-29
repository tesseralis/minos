import { ReactNode } from "react"
import Link from "next/link"
import { css } from "@emotion/react"
import Layout from "components/Layout"
import { orderName } from "mino"
import { colors } from "style/theme"
import { useRouter } from "next/router"
import NavAndContent from "components/NavAndContent"

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
    <div
      css={css`
        margin-top: 2rem;
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
                <Link
                  key={shape}
                  href={route}
                  passHref
                  data-active={isActive}
                  css={css`
                    font-size: 1.125rem;
                    margin-right: 0.5rem;
                    color: ${colors.fg};
                    text-decoration: none;
                    &[data-active="true"] {
                      color: ${colors.highlight};
                      text-decoration: underline;
                    }
                  `}
                >
                  {getShapeText(shape)}
                </Link>
              )
            })}
          </div>
        </section>
      ))}
    </div>
  )
}

export default function PackingLayout({ children }: { children: ReactNode }) {
  return (
    <Layout>
      <NavAndContent columns="18rem 1fr" nav={<PatternNav />}>
        {children}
      </NavAndContent>
    </Layout>
  )
}
