import Link from "next/link"
import MinoDiv, { Props as MinoDivProps } from "components/MinoDiv"

interface Props extends Omit<MinoDivProps, "onClick" | "children"> {
  to: string
}

/**
 * A visual inline polyomino that links to another page.
 */
export default function MinoLink({ to, ...props }: Props) {
  return (
    <Link href={to}>
      <a>
        <MinoDiv {...props} />
      </a>
    </Link>
  )
}