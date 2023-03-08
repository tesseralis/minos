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
    case "2-cis":
      return "2\\textrm{c}"
    case "2-trans":
      return "2\\textrm{t}"
    default:
      return level
  }
}
