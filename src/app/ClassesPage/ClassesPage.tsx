import { groupBy, partition, sortBy } from "lodash-es"
import React from "react"
import { css } from "@emotion/css"
import { nodes, getMinoColor } from "app/graph"
import MinoDiv from "app/MinoList/MinoDiv"
import { Polyomino } from "mino"
import { colors } from "style/theme"

interface ClassType {
  name: string
  display: string
  predicate(m: Polyomino): boolean
  link?: string
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
    link: "https://mathworld.wolfram.com/FerrersGraphPolygon.html",
  },
  {
    name: "stair",
    display: "Staircase",
    predicate: (m) => m.classes.isStaircase(),
    link: "https://mathworld.wolfram.com/StaircasePolygon.html",
  },
  {
    name: "stack",
    display: "Stack",
    predicate: (m) => m.classes.isStack(),
    link: "https://mathworld.wolfram.com/StackPolyomino.html",
  },
  {
    name: "dirConvex",
    display: "Directed Convex",
    predicate: (m) => m.classes.isDirected() && m.classes.isConvex(),
    link: "https://mathworld.wolfram.com/DirectedConvexPolyomino.html",
  },
  {
    name: "bar",
    display: "Bar Chart",
    predicate: (m) => m.classes.isBarChart(),
    link: "https://mathworld.wolfram.com/BarGraphPolygon.html",
  },
  {
    name: "convex",
    display: "Convex",
    predicate: (m) => m.classes.isConvex(),
    link: "https://mathworld.wolfram.com/ConvexPolyomino.html",
  },
  {
    name: "dirSemiConvex",
    display: "Directed Semi-Convex",
    predicate: (m) => m.classes.isDirected() && m.classes.isSemiConvex(),
  },
  {
    name: "semiConvex",
    display: "Semi-Convex",
    predicate: (m) => m.classes.isSemiConvex(),
    link: "https://mathworld.wolfram.com/Row-ConvexPolyomino.html",
  },
  {
    name: "directed",
    display: "Directed",
    predicate: (m) => m.classes.isDirected(),
  },
  { name: "other", display: "Other", predicate: () => true },
]

function getEquivalencies(minoClass: Polyomino[]) {
  const groups = Object.values(
    groupBy(
      minoClass.map((mino) => mino.boundaryClassWithTransform()),
      (mc) => mc.class,
    ),
  )
  return sortBy(groups, (group) => -group.length).map((group) =>
    sortBy(
      group.map((item) => item.transform),
      (mino) => [mino.order, -mino.height, -mino.width],
    ),
  )
}

function getClasses() {
  let minos = nodes.flat()
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
        margin: 0.25rem;
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
            <MinoDiv mino={mino} size={8} fill={fill} stroke={stroke} />
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
  link,
}: {
  name: string
  display: string
  minos: Polyomino[][]
  link?: string
}) {
  return (
    <section
      className={css`
        grid-area: ${name};
        border: 2px grey solid;
        padding: 1rem;
      `}
    >
      <div
        className={css`
          display: flex;
        `}
      >
        <h2
          className={css`
            font-weight: normal;
            font-size: 1.5rem;
            margin: 0;
          `}
        >
          {display}
        </h2>
        {link && (
          <a
            href={link}
            className={css`
              color: ${colors.fg};
              margin-left: auto;
              font-size: 1.25rem;
            `}
          >
            ref
          </a>
        )}
      </div>
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
        margin: 1rem;

        h1 {
          font-weight: normal;
        }

        p {
          font-size: 1.125rem;
        }
      `}
    >
      <h1>Special Classes of Polyominoes</h1>
      <p>
        Several classes of polyominoes are well-studied. This page shows the
        hierarchy of some of these special classes.
      </p>
      <p>
        Sections that share a horizontal boundary are connected--for example,
        all Ferrers diagrams are staircase polyominoes.
      </p>
      <p>Additionally, classes with similar boundaries are grouped together.</p>
    </section>
  )
}

function ClassesChart() {
  const classMap = getClasses()
  return (
    <div
      className={css`
        display: grid;
        /* grid-gap: 1rem; */
        grid-template-areas:
          "info          info          .             rect          rect"
          "info          info          ferrer        ferrer        ferrer"
          "stair         stair         stair         stack         stack"
          "dirConvex     dirConvex     dirConvex     dirConvex     bar"
          "convex        dirSemiConvex dirSemiConvex dirSemiConvex dirSemiConvex"
          "semiConvex    semiConvex    semiConvex    semiConvex    directed"
          ".             .             .             other         other";
      `}
    >
      <Info />
      {classes.map((minoClass, i) => (
        <MinoClass
          key={i}
          minos={(classMap as any)[minoClass.name]}
          display={minoClass.display}
          name={minoClass.name}
          link={minoClass.link}
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
        max-width: 72rem;
        height: 100vh;
        margin-left: 12rem;
        padding: 1rem 0;
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
