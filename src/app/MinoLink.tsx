import React from "react"
import { Link } from "react-router-dom"
import { css } from "@emotion/react"
import MinoDiv, { Props as MinoDivProps } from "app/MinoList/MinoDiv"

interface Props extends Omit<MinoDivProps, "onClick" | "children"> {
  to: string
}

/**
 * A visual inline polyomino that links to another page.
 */
export default function MinoLink({ to, ...props }: Props) {
  return (
    <Link
      to={to}
      css={css`
        cursor: pointer;
      `}
    >
      <MinoDiv {...props} />
    </Link>
  )
}
