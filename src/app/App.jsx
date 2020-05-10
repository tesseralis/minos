import styled from "@emotion/styled"
import React from "react"

import MinoGraph from "./MinoGraph"

const FullScreen = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
`

export default function App() {
  return (
    <FullScreen>
      <MinoGraph />
    </FullScreen>
  )
}
