import Link from "next/link"
import MinoDiv, { Props as MinoDivProps } from "components/MinoDiv"
import { css } from "@emotion/react"

interface Props extends Omit<MinoDivProps, "onClick"> {
  to: string
}

/**
 * A visual inline polyomino that links to another page.
 */
export default function MinoLink({ to, ...props }: Props) {
  return (
    <Link
      href={to}
      css={css`
        svg {
          transition: transform 150ms ease-in-out;
        }
        svg:hover {
          transform: scale(1.1);
        }
      `}
    >
      <MinoDiv {...props} />
    </Link>
  )
}
