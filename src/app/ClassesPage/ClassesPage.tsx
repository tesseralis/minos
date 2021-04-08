import { partition } from "lodash-es"
import React from "react"
import { css } from "@emotion/css"
import { nodes, getMinoColor } from "app/graph"
import MinoDiv from "app/MinoList/MinoDiv"
import { Polyomino } from "mino"

interface ClassType {
  name: string
  display: string
  predicate(m: Polyomino): boolean
}

const classes: ClassType[] = [
  {
    name: "rect",
    display: "Rectangle",
    predicate: (m) => m.classes.isRectangle(),
  },
  {
    name: "ferrer",
    display: "Ferrer's Diagram",
    predicate: (m) => m.classes.isFerrers(),
  },
  { name: "stack", display: "Stack", predicate: (m) => m.classes.isStack() },
  {
    name: "stair",
    display: "Staircase",
    predicate: (m) => m.classes.isStaircase(),
  },
  {
    name: "dirConvex",
    display: "Directed Convex",
    predicate: (m) => m.classes.isDirected() && m.classes.isConvex(),
  },
  {
    name: "bar",
    display: "Bar Chart",
    predicate: (m) => m.classes.isBarChart(),
  },
  { name: "convex", display: "Convex", predicate: (m) => m.classes.isConvex() },
  {
    name: "dirSemiConvex",
    display: "Directed Semi-Convex",
    predicate: (m) => m.classes.isDirected() && m.classes.isSemiConvex(),
  },
  {
    name: "directed",
    display: "Directed",
    predicate: (m) => m.classes.isDirected(),
  },
  {
    name: "semiConvex",
    display: "Semi-Convex",
    predicate: (m) => m.classes.isSemiConvex(),
  },
  { name: "other", display: "Other", predicate: () => true },
]

function getClasses() {
  let minos = nodes.flat()
  const classMap: Record<string, Polyomino[]> = {}
  for (const cls of classes) {
    const [matches, nonMatches] = partition(minos, cls.predicate)
    minos = nonMatches
    classMap[cls.name] = matches
  }
  return classMap
}

function MinoList({
  name,
  display,
  minos,
}: {
  name: string
  display: string
  minos: Polyomino[]
}) {
  return (
    <section>
      <h2>{display}</h2>
      <div
        className={css`
          border: 1px white solid;
          padding: 1rem;
          display: flex;
          flex-wrap: wrap;
        `}
      >
        {minos.map((mino, key) => {
          const { stroke, fill } = getMinoColor(mino)
          return (
            <MinoDiv
              key={key}
              mino={mino}
              size={10}
              fill={fill}
              stroke={stroke}
            />
          )
        })}
      </div>
    </section>
  )
}

function ClassesChart() {
  const classMap = getClasses()
  return (
    <div>
      {classes.map((minoClass, i) => (
        <MinoList
          key={i}
          minos={(classMap as any)[minoClass.name]}
          display={minoClass.display}
          name={minoClass.name}
        />
      ))}
    </div>
  )
}

export default function ClassesPage() {
  return (
    <div
      className={css`
        width: 100%;
        max-width: 48rem;
        height: 100vh;
        margin-left: 10rem;
        overflow-y: scroll;
        display: flex;
        flex-direction: column;
        align-items: center;
      `}
    >
      <ClassesChart />
    </div>
  )
}
