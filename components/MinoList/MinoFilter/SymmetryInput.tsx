import React, { ReactNode } from "react"
import { css } from "@emotion/react"
import { getSymmetryColor } from "components/graph"
import { Circle, Line } from "components/svg"

import { Polyomino, Symmetry, printSymmetry, symmetries } from "mino"
import InputTitle from "./InputTitle"
import { upsert, remove } from "./common"
import * as Tooltip from "@radix-ui/react-tooltip"
import { colors } from "style/theme"
import SymmetryIcon from "components/SymmetryIcon"

// Choose a dimmer neutral color
const outlineColor = "#999"

interface Props {
  value?: Symmetry[]
  onUpdate(value: Symmetry[]): void
}

/**
 * Input to select what symmetries should be filtered out.
 */
export default function SymmetryInput({ value = [], onUpdate }: Props) {
  return (
    <div>
      <InputTitle display="Symmetries" onClear={() => onUpdate([])} />
      <div
        css={css`
          margin-top: 0.5rem;
          display: grid;
          grid-gap: 0.5rem 1rem;
          grid-template-areas:
            ".     all  ."
            "axis2 rot2 diag2"
            "axis  rot  diag"
            ".     none .";
        `}
      >
        {symmetries.map((sym) => {
          const checked = value.includes(sym)
          return (
            <Tooltip.Root key={sym}>
              <Tooltip.Trigger asChild>
                <label
                  css={css`
                    grid-area: ${sym};
                  `}
                >
                  {/* TODO (a11y) tab navigation */}
                  <input
                    type="checkbox"
                    className="visually-hidden"
                    checked={checked}
                    onChange={(e) =>
                      onUpdate(
                        e.target.checked
                          ? upsert(value, sym)
                          : remove(value, sym),
                      )
                    }
                  />
                  <SymmetryIcon
                    symmetry={sym}
                    fill={checked ? getSymmetryColor(sym) : "none"}
                    stroke={outlineColor}
                  />
                </label>
              </Tooltip.Trigger>
              <Tooltip.Portal>
                <Tooltip.Content
                  css={css`
                    background: ${colors.bg};
                    border: 1px solid ${outlineColor};
                    padding: 0.25rem 0.5rem;
                    border-radius: 0.5rem;
                  `}
                >
                  {printSymmetry(sym)}
                </Tooltip.Content>
              </Tooltip.Portal>
            </Tooltip.Root>
          )
        })}
      </div>
    </div>
  )
}
