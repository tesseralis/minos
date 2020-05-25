import React from "react"
import { css } from "emotion"

import type { Mino } from "mino/mino"
import { Transform, transform } from "mino/transform"
import { colors } from "style/theme"
import { SVGTransform, svgTransform } from "app/svg"

// FIXME this is duplicated
const reflectionList = [
  "flipVert",
  "flipMainDiag",
  "flipHoriz",
  "flipMinorDiag",
] as const

// TODO replace these icons with actual SVG
const rotationSymbols: any = {
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
      <text
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
        onMouseOver={() => onHover?.(trans)}
        onMouseOut={() => onHover?.(undefined)}
        transform={svgTrans.toString()}
      >
        {icon}
      </text>
    )
  }

  return (
    <g>
      {reflectionList.map((trans, i) => (
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
