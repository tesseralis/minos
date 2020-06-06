import React from "react"
import { css } from "emotion"

import { Transform } from "mino"
import { colors } from "style/theme"
import { SVGTransform, svgTransform, Text } from "app/svg"
import { useSetSelected } from "app/SelectedContext"
import {
  TransformCtx,
  innerRingRadius,
  useSelected,
  useSelectedColor,
} from "./compassHelpers"

import { reflectionOrder } from "./ReflectionAxes"
const radius = innerRingRadius + 5

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
  const setTransform = TransformCtx.useSetValue()

  return (
    <Text
      className={css`
        cursor: pointer;
        fill: ${color};
        pointer-events: initial;
        user-select: none;
        dominant-baseline: middle;
        :hover {
          fill: ${colors.highlight};
        }
        ${className}
      `}
      onClick={() => setSelected(mino.transform(trans))}
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
      className={css`
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
            className={css`
              font-size: 20px;
              text-anchor: middle;
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
