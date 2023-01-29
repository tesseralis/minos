import { css } from "@emotion/react"
import { useUpdateAtom } from "jotai/utils"

import { Transform } from "mino"
import { colors } from "style/theme"
import { SVGTransform, svgTransform, Text } from "components/svg"
import {
  transformAtom,
  innerRingRadius,
  useSelected,
  useSelectedColor,
  useSetSelected,
} from "./compassHelpers"

import { reflectionOrder } from "./ReflectionAxes"
const radius = innerRingRadius + 7.5

// TODO replace these icons with actual SVG
const rotationSymbols = {
  rotateRight: "⃕",
  rotateHalf: "↻",
  rotateLeft: "⃔",
}

interface ButtonProps {
  icon: string
  trans: Transform
  svgTrans: SVGTransform
  className?: string
}

function Button({ icon, trans, svgTrans, className }: ButtonProps) {
  const mino = useSelected()
  const color = useSelectedColor()
  const setSelected = useSetSelected()
  const setTransform = useUpdateAtom(transformAtom)

  return (
    <Text
      css={css`
        cursor: pointer;
        fill: ${color};
        text-anchor: middle;
        pointer-events: initial;
        user-select: none;
        dominant-baseline: middle;
        :hover {
          fill: ${colors.highlight};
        }
        ${className}
      `}
      onClick={() => setSelected(mino.transform.apply(trans))}
      onHover={(hovered) => setTransform(hovered ? trans : null)}
      transform={svgTrans}
    >
      {icon}
    </Text>
  )
}

interface Props {
  visible?: boolean
}

/**
 * Buttons that can be used to transform the mino into one of its reflections/rotations
 */
export default function TransformButtons({ visible }: Props) {
  return (
    <g
      css={css`
        transition: opacity 100ms ease-in-out;
        opacity: ${visible ? 1 : 0};
      `}
    >
      {reflectionOrder.map((trans, i) => (
        <Button
          key={trans}
          icon="↕︎"
          trans={trans}
          svgTrans={svgTransform()
            .translate(radius, 0)
            .rotate(45 * i)}
        />
      ))}
      {(["rotateLeft", "rotateHalf", "rotateRight"] as const).map(
        (trans, i) => (
          <Button
            key={trans}
            icon={rotationSymbols[trans]}
            trans={trans}
            css={css`
              font-size: 20px;
              dominant-baseline: ${trans === "rotateHalf"
                ? "initial"
                : "middle"};
            `}
            svgTrans={svgTransform()
              .translate(0, -radius)
              .rotate(30 * (i - 1))}
          />
        ),
      )}
    </g>
  )
}
