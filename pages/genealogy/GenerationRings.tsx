import React, { memo, useState, useEffect, useMemo, useCallback } from "react"
import { Polyomino } from "mino"

import transition from "components/transition"
import { NUM_GENERATIONS, nodes, getMinoColor } from "components/graph"
import { useSelected, useSetSelected } from "components/SelectedContext"
import SelectableMino from "components/SelectableMino"

import { START_GENS, getCoords } from "./treeHelpers"

const graphMinos = nodes.map((gen) =>
  gen.map((mino) => mino.transform.apply("flipMainDiag")),
)

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
  const setSelected = useSetSelected()
  return (
    <SelectableMino
      mino={mino}
      coord={coord}
      size={getBlockSize(gen)}
      selected={!!selected?.has(mino)}
      onHover={onHover}
      onSelect={setSelected}
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
    const [visIndex, setVisIndex] = useState(0)
    useEffect(() => {
      if (skipAnimation) {
        return
      }
      const trans = transition({
        duration: minos.length * 10,
        onUpdate(val) {
          setVisIndex(val * minos.length)
        },
      })
      return () => trans.cancel()
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

  // Split up the "selected" parent and child minos by generation for performance
  const getSelected = useCallback(
    (gen) => {
      const parents = selected
        ? selected.relatives.freeParents()
        : new Set<Polyomino>()
      const children = selected
        ? selected.relatives.freeChildren()
        : new Set<Polyomino>()
      if (!selected) return
      const selectedGen = selected.order
      if (gen === selectedGen) {
        return new Set([selected.transform.free()])
      } else if (gen === selectedGen - 1) {
        return parents
      } else if (gen === selectedGen + 1) {
        return children
      }
    },
    [selected],
  )

  return (
    <g>
      {graphMinos.map((minos, i) => {
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
