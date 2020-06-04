import React from "react"
import { css } from "emotion"

export default function Content() {
  const style = css`
    font-family: sans-serif;
    font-weight: 300;
    line-height: 1.25;
    display: flex;
    flex-direction: column;

    h1 {
      font-size: 1.875rem;
      font-family: serif;
      font-style: italic;
      font-weight: normal;
      margin-block-start: 0.5rem;
      margin-block-end: 1.5rem;
      letter-spacing: 1px;
      text-align: center;
    }

    p {
      font-size: 1rem;
      line-height: 1.5;
      margin-block-start: 0;
      margin-block-end: 1.25rem;
    }
    em {
      font-weight: 400;
    }
  `

  return (
    <div className={style}>
      <h1>The Labyrinth of Minos</h1>
      <p>
        A <em>polyomino</em> is a shape composed of squares joined together at
        their edges.
      </p>

      <p>
        This labyrinth shows the family tree of polyominoes up to 8 squares. Two
        polyominoes are connected if one is a <em>child</em> of another—that is,
        if it can be created by adding a single square to the parent.
      </p>

      <p>
        Each polyomino is shaded according to its symmetry and the colors of its
        parents.
      </p>

      <p>
        Click/tap on a mino to highlight its parents and children. Drag to pan
        across the graph and scroll/pinch to zoom.
      </p>
    </div>
  )
}
