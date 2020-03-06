import React, { useState } from 'react'
import styled from '@emotion/styled'
import Icon from '@mdi/react'
import { mdiInformationVariant } from '@mdi/js'
import InfoModal from './InfoModal'

import { colors } from 'style/theme'

const Button = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;

  width: 3rem;
  height: 3rem;

  border: 2px solid ${colors.fg};
  background-color: ${colors.bg};
  color: ${colors.fg};
  cursor: pointer;

  &:hover {
    background-color: #333;
  }
`

export default function InfoButton() {
  const [open, setOpen] = useState(false)

  return (
    <>
      <Button aria-label="App Information" onClick={() => setOpen(true)}>
        <Icon size="2.5rem" path={mdiInformationVariant} color={colors.fg} />
      </Button>
      <InfoModal isOpen={open} onClose={() => setOpen(false)} />
    </>
  )
}
