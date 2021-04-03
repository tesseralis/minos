import React from "react"
import InputTitle from "./InputTitle"
import { css } from "@emotion/css"
import { colors } from "style/theme"

interface YesNoItem {
  name: string
  display: string
  yes: string
  no: string
}

const yesNoItems: YesNoItem[] = [
  {
    name: "isConvex",
    display: "Convexity",
    yes: "convex",
    no: "concave",
  },
  {
    name: "hasHole",
    display: "Holes",
    yes: "has hole",
    no: "no holes",
  },
  {
    name: "hasTiling",
    display: "Tiling",
    yes: "has tiling",
    no: "no tiling",
  },
]

interface YesNoProps {
  name: string
  item: YesNoItem
  display: string
  value?: string
  onUpdate(val?: string): void
}

function YesNoOption({ display, name, value, onUpdate, item }: YesNoProps) {
  return (
    <div
      className={css`
        margin-bottom: 1rem;
      `}
    >
      <div>
        <InputTitle display={display} onClear={() => onUpdate()} />
      </div>
      {["yes", "no"].map((val) => {
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
              {(item as any)[val]}
            </span>
          </label>
        )
      })}
    </div>
  )
}

export default function YesNoOptions({ value, onUpdate }: any) {
  return (
    <>
      {yesNoItems.map((item) => (
        <YesNoOption
          key={item.name}
          name={item.name}
          display={item.display}
          item={item}
          value={(value as any)[item.name]}
          onUpdate={(val: any) => onUpdate({ ...value, [item.name]: val })}
        />
      ))}
    </>
  )
}
