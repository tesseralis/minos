import React from 'react'
import { css } from 'glamor'

import InfoButton from './InfoButton'
import MinoGraph from './MinoGraph'

export default function App() {
  const style = css({
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  })

  const infoButtonStyle = css({
    position: 'fixed',
    bottom: '2rem',
    right: '2rem',
  })

  return (
    <div {...style}>
      <div {...infoButtonStyle}>
        <InfoButton />
      </div>

      <MinoGraph />
    </div>
  )
}
