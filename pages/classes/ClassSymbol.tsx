import { DirClass } from "mino"
import { InlineMath } from "react-katex"

interface Props {
  dirClass: DirClass
}
export default function ClassSymbol({ dirClass }: Props) {
  return (
    <InlineMath
      math={`\\textrm{Dir}_{${printLevel(dirClass.ortho)}}^{${printLevel(
        dirClass.diag,
      )}}`}
    />
  )
}

function printLevel(level: any) {
  switch (level) {
    case "2-meta":
      return "2\\textrm{m}"
    case "2-para":
      return "2\\textrm{p}"
    default:
      return level
  }
}
