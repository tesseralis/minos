import React from "react"
import { Link } from "react-router-dom"
import { css } from "@emotion/css"
import MinoDiv, { Props as MinoDivProps } from "app/MinoList/MinoDiv"

interface Props extends Omit<MinoDivProps, "onClick" | "children"> {
  to: string
}

export default function MinoLink({ to, ...props }: Props) {
  return (
    <Link
      to={to}
      className={css`
        cursor: pointer;
      `}
    >
      <MinoDiv {...props} />
    </Link>
  )
}
