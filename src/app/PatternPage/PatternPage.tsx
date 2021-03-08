import React from "react"
import { css } from "emotion"
import Pattern from "./Pattern"

const sizes = ["1_4", 5, 6, 7, 8]
const shapes = ["rect", "square"]

export default function PatternPage() {
  // FIXME make this navigation
  const [patternSize, setPatternSize] = React.useState(sizes[0])
  const [patternShape, setPatternShape] = React.useState(shapes[0])

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
      <nav
        className={css`
          margin-top: 2rem;
        `}
      >
        <div>
          {sizes.map((size) => (
            <button key={size} onClick={() => setPatternSize(size)}>
              {size}
            </button>
          ))}
        </div>
        <div>
          {shapes.map((shape) => (
            <button key={shape} onClick={() => setPatternShape(shape)}>
              {shape}
            </button>
          ))}
        </div>
      </nav>
      <div
        className={css`
          margin: 2rem 0;
        `}
      >
        <Pattern size={patternSize} shape={patternShape} />
      </div>
    </div>
  )
}
