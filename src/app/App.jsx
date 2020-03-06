import styled from '@emotion/styled'
import React from 'react'

import InfoButton from './InfoButton'
import MinoGraph from './MinoGraph'

const FullScreen = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
`

const ButtonWrapper = styled.div`
  position: fixed;
  bottom: 2rem;
  right: 2rem;
`

export default function App() {
  return (
    <FullScreen>
      <ButtonWrapper>
        <InfoButton />
      </ButtonWrapper>
      <MinoGraph />
    </FullScreen>
  )
}
