import React from "react"
import InputTitle from "./InputTitle"
import { css } from "@emotion/css"
import { colors } from "style/theme"
import { YesNoName, YesNoOptions } from "./common"

interface YesNoItem {
  name: YesNoName
  display: string
  optDisplays: {
    yes: string
    no: string
  }
}

const yesNoItems: YesNoItem[] = [
  {
    name: "isDirected",
    display: "Directedness",
    optDisplays: {
      yes: "directed",
      no: "undirected",
    },
  },
  {
    name: "isConvex",
    display: "Convexity",
    optDisplays: {
      yes: "convex",
      no: "concave",
    },
  },
  {
    name: "hasHole",
    display: "Holes",
    optDisplays: {
      yes: "has hole",
      no: "no holes",
    },
  },
  {
    name: "hasTiling",
    display: "Tiling",
    optDisplays: {
      yes: "has tiling",
      no: "no tiling",
    },
  },
]

interface YesNoProps extends YesNoItem {
  value?: string
  onUpdate(val?: string): void
}

/**
 * A three-valued input that can be affirmative, negative, or undefined
 */
function YesNoInput({
  display,
  name,
  value,
  onUpdate,
  optDisplays,
}: YesNoProps) {
  return (
    <div
      className={css`
        margin-bottom: 1rem;
      `}
    >
      <div>
        <InputTitle display={display} onClear={() => onUpdate()} />
      </div>
      {(["yes", "no"] as const).map((val) => {
        const checked = value === val
        return (
          <label key={val}>
            <input
              type="radio"
              className="visually-hidden"
              name={name}
              value={val}
              checked={checked}
              onChange={(e) => onUpdate(e.target.value)}
            />
            <span
              className={css`
                margin-right: 1rem;
                color: ${checked ? colors.highlight : colors.fg};
                text-decoration: ${checked ? "underline" : "none"};
                cursor: pointer;
              `}
            >
              {optDisplays[val]}
            </span>
          </label>
        )
      })}
    </div>
  )
}

interface Props {
  value?: YesNoOptions
  onUpdate(value: YesNoOptions): void
}

/**
 * Display all possible yes-no inputs that can be filtered.
 */
export default function YesNoInputs({ value = {}, onUpdate }: Props) {
  return (
    <>
      {yesNoItems.map((item) => (
        <YesNoInput
          {...item}
          key={item.name}
          value={value[item.name]}
          onUpdate={(val) => onUpdate({ ...value, [item.name]: val })}
        />
      ))}
    </>
  )
}
