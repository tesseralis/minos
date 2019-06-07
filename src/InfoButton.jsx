import React, { useState } from 'react'
import { css } from 'glamor'
import Icon from '@mdi/react'
import { mdiInformationVariant } from '@mdi/js'
import InfoModal from './InfoModal'

export default function InfoButton() {
  const [open, setOpen] = useState(true)

  const style = css({
    width: '3rem',
    height: '3rem',
    backgroundColor: '#222',
    border: '1px black #AAA',
    color: '#AAA',
    fontSize: '3rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',

    ':hover': {
      backgroundColor: '#333',
    },
  })

  return (
    <>
      <button
        {...style}
        aria-label="App Information"
        onClick={() => setOpen(true)}
      >
        <Icon size="2.5rem" path={mdiInformationVariant} color="#AAA" />
      </button>
      <InfoModal isOpen={open} onClose={() => setOpen(false)} />
    </>
  )
}
