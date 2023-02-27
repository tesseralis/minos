import { Circle, Line, Polyline } from "components/svg"
import { DirClass } from "mino"
import { colors } from "style/theme"
import { getDirColor } from "./words"

interface Props {
  dirClass: DirClass
}

export default function Automaton({ dirClass }: Props) {
  const height = 40
  const rad = (height - 10) / 2
  return (
    <svg viewBox={`0 ${-height / 2} ${height * 10} ${height}`} height={height}>
      <defs>
        <marker
          id="arrowhead"
          viewBox="0 0 10 10"
          refX="9"
          refY="5"
          markerWidth={6}
          markerHeight={6}
          markerUnits="strokeWidth"
          orient="auto-start-end"
        >
          <path d="M 0 0 L 10 5 L 0 10" stroke="context-stroke" fill="none" />
        </marker>
      </defs>
      <Line
        p1={[0, 0]}
        p2={[rad, 0]}
        stroke={colors.fg}
        markerEnd="url(#arrowhead)"
      />
      <Circle center={[2 * rad, 0]} r={rad} stroke={colors.fg} fill="none" />
      <Line
        p1={[3 * rad, 0]}
        p2={[5 * rad, 0]}
        stroke={getDirColor("ru")}
        markerEnd="url(#arrowhead)"
      />
      <Circle center={[6 * rad, 0]} r={rad} stroke={colors.fg} fill="none" />
      <Line
        p1={[7 * rad, 0]}
        p2={[9 * rad, 0]}
        stroke={getDirColor("ld")}
        markerEnd="url(#arrowhead)"
      />
      <Circle center={[10 * rad, 0]} r={rad} stroke={colors.fg} fill="none" />
      <Circle
        center={[10 * rad, 0]}
        r={rad * 0.75}
        stroke={colors.fg}
        fill="none"
      />
    </svg>
  )
}
