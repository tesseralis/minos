import { groupBy, partition, sortBy } from "lodash-es"
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
    display: "Ferrers Diagram",
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

function getEquivalencies(minoClass: Polyomino[]) {
  const groups = Object.values(
    groupBy(minoClass, (mino) => mino.boundaryClass()),
  )
  return sortBy(groups, (group) => -group.length)
}

function getClasses() {
  let minos = nodes.flat().map((mino) => mino.transform.apply("flipMainDiag"))
  const classMap: Record<string, Polyomino[][]> = {}
  for (const cls of classes) {
    const [matches, nonMatches] = partition(minos, cls.predicate)
    minos = nonMatches
    classMap[cls.name] = getEquivalencies(matches)
  }
  return classMap
}

function BoundaryClass({ minos }: { minos: Polyomino[] }) {
  return (
    <div
      className={css`
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        border: 1px grey solid;
        padding: 1rem;
      `}
    >
      {minos.map((mino, key) => {
        const { stroke, fill } = getMinoColor(mino)
        return (
          <div
            key={key}
            className={css`
              margin: 0 0.5rem;
            `}
          >
            <MinoDiv mino={mino} size={10} fill={fill} stroke={stroke} />
          </div>
        )
      })}
    </div>
  )
}

function MinoClass({
  name,
  display,
  minos,
}: {
  name: string
  display: string
  minos: Polyomino[][]
}) {
  return (
    <section
      className={css`
        grid-area: ${name};
        border: 2px grey solid;
        padding: 1rem;
      `}
    >
      <h2
        className={css`
          font-weight: normal;
          margin: 0;
        `}
      >
        {display}
      </h2>
      <div
        className={css`
          display: flex;
          /* justify-content: center; */
          align-items: center;
          flex-wrap: wrap;
        `}
      >
        {minos.map((boundaryClass, key) => {
          return <BoundaryClass minos={boundaryClass} key={key} />
        })}
      </div>
    </section>
  )
}

function Info() {
  return (
    <section
      className={css`
        grid-area: info;
      `}
    >
      <h1>Special Classes of Polyominoes</h1>
      <p>
        Several classes of polyominoes are well-studied. This page shows the
        hierarchy of some of these special classes.
      </p>
    </section>
  )
}

function ClassesChart() {
  const classMap = getClasses()
  return (
    <div
      className={css`
        display: grid;
        grid-gap: 1rem;
        grid-template-areas:
          "rect          rect          rect          rect          info       info"
          "ferrer        ferrer        ferrer        ferrer        info       info"
          "stack         stack         stair         stair         stair      stair"
          "bar           bar           dirConvex     dirConvex     dirConvex  dirConvex"
          "dirSemiConvex dirSemiConvex dirSemiConvex dirSemiConvex convex     convex"
          "directed      semiConvex    semiConvex    semiConvex    semiConvex semiConvex"
          "other         other         .             .             .          .";
      `}
    >
      <Info />
      {classes.map((minoClass, i) => (
        <MinoClass
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
        max-width: 60rem;
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
