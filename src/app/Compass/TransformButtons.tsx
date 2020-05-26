import React from "react"
import { css } from "emotion"

import { Mino, Transform, transform } from "mino"
import { colors } from "style/theme"
import { SVGTransform, svgTransform, Text } from "app/svg"

import { reflectionOrder } from "./ReflectionAxes"

// TODO replace these icons with actual SVG
const rotationSymbols = {
  rotateRight: "⃕",
  rotateHalf: "↻",
  rotateLeft: "⃔",
}

interface Props {
  // The mino to transform
  mino: Mino
  // The color of the transform buttons
  color: string
  // The radius of the buttons
  radius: number
  // Function to call when a mino is selected
  onSelect?(mino: Mino): void
  // Function to call when a transform is selected
  onHover?(trans?: Transform): void
}

/**
 * Buttons that can be used to transform the mino into one of its reflections/rotations
 */
export default function TransformButtons({
  mino,
  color,
  radius,
  onSelect,
  onHover,
}: Props) {
  interface ButtonProps {
    icon: string
    trans: Transform
    svgTrans: SVGTransform
    className?: string
  }

  function Button({ icon, trans, svgTrans, className }: ButtonProps) {
    return (
      <Text
        className={css`
          cursor: pointer;
          fill: ${color};
          pointer-events: initial;
          dominant-baseline: middle;
          :hover {
            fill: ${colors.highlight};
          }
          ${className}
        `}
        onClick={() => onSelect?.(transform(mino, trans))}
        onHover={(hovered) => onHover?.(hovered ? trans : undefined)}
        transform={svgTrans}
      >
        {icon}
      </Text>
    )
  }

  return (
    <g>
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
