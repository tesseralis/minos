import { css } from "@emotion/react"
import Layout from "components/Layout"
import NavAndContent from "components/NavAndContent"
import Link from "next/link"
import { useRouter } from "next/router"
import { ReactElement } from "react"

interface Props {
  children: ReactElement
  terms: string[]
}

export default function GlossaryLayout({ children, terms }: Props) {
  return (
    <Layout>
      <NavAndContent columns="24rem 1fr" nav={<GlossaryNav terms={terms} />}>
        {children}
      </NavAndContent>
    </Layout>
  )
}

function GlossaryNav({ terms }: { terms: string[] }) {
  const router = useRouter()
  return (
    <div
      css={css`
        padding: 2rem;
      `}
    >
      <ul>
        {terms.map((term) => {
          const path = `/glossary/${term}`
          const isActive = path === router.asPath
          return (
            <li key={term}>
              <Link
                href={path}
                css={css`
                  text-decoration: ${isActive ? "underline" : "none"};
                `}
              >
                {term.replace("-", " ")}
              </Link>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
