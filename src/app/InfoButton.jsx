import React, { useState } from 'react'
import { css } from 'glamor'
import Icon from '@mdi/react'
import { mdiInformationVariant } from '@mdi/js'
import InfoModal from './InfoModal'

import { colors } from 'style/theme'

export default function InfoButton() {
  const [open, setOpen] = useState(false)

  const style = css({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',

    width: '3rem',
    height: '3rem',

    border: `1px black ${colors.fg}`,
    backgroundColor: colors.bg,
    color: colors.fg,
    fontSize: '3rem',

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
        <Icon size="2.5rem" path={mdiInformationVariant} color={colors.fg} />
      </button>
      <InfoModal isOpen={open} onClose={() => setOpen(false)} />
    </>
  )
}
