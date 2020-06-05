import React, { memo, useMemo, useCallback } from "react"
import { Polyomino } from "mino"

import transition from "app/transition"
import { NUM_GENERATIONS, nodes, getMinoColor } from "app/graph"
import { useSelected } from "app/SelectedContext"
import SelectableMino from "app/SelectableMino"

import { START_GENS, getCoords } from "./treeHelpers"

function getBlockSize(gen: number) {
  return 2 + (NUM_GENERATIONS - gen) ** 2 / 2
}

interface MinoProps {
  mino: Polyomino
  gen: number
  selected?: Set<Polyomino>
  onHover?(mino: Polyomino): void
}

/**
 * Memoized wrapper around the mino to efficiently calculate it
 */
const RingMino = memo(function ({ mino, gen, selected, onHover }: MinoProps) {
  const coord = useMemo(() => getCoords(mino), [mino])
  return (
    <SelectableMino
      mino={mino}
      coord={coord}
      size={getBlockSize(gen)}
      selected={!!selected?.has(mino)}
      onHover={onHover}
      {...getMinoColor(mino)}
    />
  )
})

interface RingProps {
  minos: Polyomino[]
  gen: number
  skipAnimation: boolean
  selected?: Set<Polyomino>
  onHover?(mino: Polyomino): void
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
              <RingMino key={mino.data} mino={mino} {...minoProps} />
            )
          )
        })}
      </>
    )
  },
)

export default function GenerationRings() {
  const selected = useSelected()
  const parents = selected ? selected.freeParents() : new Set<Polyomino>()
  const children = selected ? selected.freeChildren() : new Set<Polyomino>()

  // Split up the "selected" parent and child minos by generation for performance
  const getSelected = useCallback(
    (gen) => {
      if (!selected) return
      const selectedGen = selected.order
      if (gen === selectedGen) {
        return new Set([selected.free()])
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
          />
        )
      })}
    </g>
  )
}
