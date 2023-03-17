import { css } from "@emotion/react"
import { getClassColor } from "components/graph"

import { DirClass } from "mino"
import InputTitle from "./InputTitle"
import { upsert, remove } from "./common"
import * as Tooltip from "@radix-ui/react-tooltip"
import { colors } from "style/theme"
import ClassIcon from "components/ClassIcon"

// Choose a dimmer neutral color
const outlineColor = "#999"

interface Props {
  value?: DirClass[]
  onUpdate(value: DirClass[]): void
}

/**
 * Input to select what symmetries should be filtered out.
 */
export default function ClassInput({ value = [], onUpdate }: Props) {
  return (
    <div>
      <InputTitle display="Classes" onClear={() => onUpdate([])} />
      <div
        css={css`
          margin-top: 0.5rem;
          display: grid;
          grid-gap: 1rem 0.75rem;
          align-items: center;
          grid-template-areas:
            ".     .     rect  ."
            ".     wedge rect  ."
            "stair wedge stack ."
            "stair fork  stack bar"
            "diam  fork  wing  bar"
            "diam  cres  wing  ant"
            "range cres  btree ant"
            "range tree  btree ."
            ".     tree  other ."
            ".     .     other .";
          justify-items: center;
        `}
      >
        {DirClass.all().map((cls) => {
          const checked = value.includes(cls)
          return (
            <Tooltip.Root key={cls.name()}>
              <Tooltip.Trigger asChild>
                <label
                  css={css`
                    cursor: pointer;
                  `}
                  style={{ gridArea: cls.code() }}
                >
                  {/* TODO maybe use the Radix toggle group instead? */}
                  <input
                    type="checkbox"
                    className="visually-hidden"
                    checked={checked}
                    onChange={(e) =>
                      onUpdate(
                        e.target.checked
                          ? upsert(value, cls)
                          : remove(value, cls),
                      )
                    }
                  />
                  <ClassIcon
                    class={cls}
                    fill={checked ? getClassColor(cls.name()) : "none"}
                    stroke={outlineColor}
                    size={30}
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
                  {cls.name()}
                </Tooltip.Content>
              </Tooltip.Portal>
            </Tooltip.Root>
          )
        })}
      </div>
    </div>
  )
}
