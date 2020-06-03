import React, { memo, useMemo, useCallback } from "react"
import { Mino, getSize } from "mino"

import SelectableMino from "app/SelectableMino"
import transition from "app/transition"

import {
  NUM_GENERATIONS,
  nodes,
  getCanonicalParents,
  getCanonicalChildren,
  getMinoColor,
} from "app/graph"

import { START_GENS, getCoords } from "./treeHelpers"

function getBlockSize(gen: number) {
  return 2 + (NUM_GENERATIONS - gen) ** 2 / 2
}

interface MinoProps {
  mino: Mino
  gen: number
  i: number
  selected?: Set<Mino>
  onSelect?(mino: Mino): void
  onHover?(mino: Mino): void
}

/**
 * Memoized wrapper around the mino to efficiently calculate it
 */
const RingMino = memo(function ({
  mino,
  gen,
  i,
  selected,
  onSelect,
  onHover,
}: MinoProps) {
  const coord = useMemo(() => getCoords(gen, i), [gen, i])
  return (
    <SelectableMino
      mino={mino}
      coord={coord}
      size={getBlockSize(gen)}
      selected={!!selected?.has(mino)}
      onSelect={onSelect}
      onHover={onHover}
      {...getMinoColor(mino)}
    />
  )
})

interface RingProps {
  minos: Mino[]
  gen: number
  skipAnimation: boolean
  selected?: Set<Mino>
  onSelect?(mino: Mino): void
  onHover?(mino: Mino): void
}

/**
 * A semicircle containing all the minos in a generation.
 */
const GenerationRing = memo(
  ({ minos, skipAnimation, ...minoProps }: RingProps) => {
    const [visIndex, setVisIndex] = React.useState(0)
    React.useEffect(() => {
      if (skipAnimation) {
        return
      }
      transition({
        duration: minos.length * 10,
        onUpdate(val) {
          setVisIndex(val * minos.length)
        },
      })
    }, [minos, skipAnimation])

    return (
      <>
        {minos.map((mino, i) => {
          return (
            (skipAnimation || i < visIndex) && (
              <RingMino key={mino} mino={mino} i={i} {...minoProps} />
            )
          )
        })}
      </>
    )
  },
)

interface RingsProps {
  selected?: Mino
  onSelect?(mino: Mino): void
}

export default function GenerationRings({ selected, onSelect }: RingsProps) {
  const parents = selected ? getCanonicalParents(selected) : new Set<Mino>()
  const children = selected ? getCanonicalChildren(selected) : new Set<Mino>()

  // Split up the "selected" parent and child minos by generation for performance
  const getSelected = useCallback(
    (gen) => {
      if (!selected) return
      const selectedGen = getSize(selected)
      if (gen === selectedGen) {
        return new Set([selected])
      } else if (gen === selectedGen - 1) {
        return parents
      } else if (gen === selectedGen + 1) {
        return children
      }
    },
    [selected, children, parents],
  )

  return (
    <g>
      {nodes.map((minos, i) => {
        const gen = i + 1
        return (
          <GenerationRing
            minos={minos}
            gen={gen}
            key={gen}
            skipAnimation={gen <= START_GENS}
            selected={getSelected(gen)}
            onSelect={onSelect}
          />
        )
      })}
    </g>
  )
}
