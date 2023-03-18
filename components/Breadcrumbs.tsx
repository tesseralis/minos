import React, { ReactNode } from "react"
import Link from "next/link"
import { FaChevronRight } from "react-icons/fa"
import { css } from "@emotion/react"

interface Props {
  paths: CrumbPath[]
}

type CrumbPath = [name: ReactNode, url: string]

export default function Breadcrumbs({ paths }: Props) {
  return (
    <nav
      css={css`
        margin-bottom: 1rem;
        display: flex;
        gap: 0.5rem;
        align-items: center;

        a {
          text-decoration: none;
        }
      `}
    >
      <BreadcrumbPart paths={paths} />
    </nav>
  )
}

function BreadcrumbPart({ paths }: Props) {
  const [name, url] = paths[0]
  if (paths.length === 1) {
    return <Link href={url}>{name}</Link>
  }

  return (
    <>
      <Link href={url}>{name}</Link>
      <FaChevronRight />
      <BreadcrumbPart paths={paths.slice(1)} />
    </>
  )
}
