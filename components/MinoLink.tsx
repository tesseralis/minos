import Link from "next/link"
import { css } from "@emotion/react"
import MinoDiv, { Props as MinoDivProps } from "components/MinoList/MinoDiv"

interface Props extends Omit<MinoDivProps, "onClick" | "children"> {
  to: string
}

/**
 * A visual inline polyomino that links to another page.
 */
export default function MinoLink({ to, ...props }: Props) {
  return (
    <Link href={to}>
      <a
        css={css`
          cursor: pointer;
        `}
      >
        <MinoDiv {...props} />
      </a>
    </Link>
  )
}
