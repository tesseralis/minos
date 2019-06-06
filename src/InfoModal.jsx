import React from 'react'
import Modal from 'react-modal'
import { css } from 'glamor'
import Icon from '@mdi/react'
import { mdiClose } from '@mdi/js'

Modal.setAppElement('#root')

export default function InfoModal({ isOpen, onClose }) {
  const overlayStyle = css({
    backgroundColor: 'rgba(128, 128, 128, .4)',

    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,

    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  })
  const style = css({
    width: '32rem',
    height: '32rem',
    backgroundColor: '#222',
    border: '2px solid #AAA',
    outline: 'none', // FIXME need what-input
    padding: '2rem',
    color: '#AAA',
    fontFamily: 'Garamond',
  })
  const headerStyle = css({
    display: 'flex',
    marginBottom: '1.5rem',
  })

  const headingStyle = css({
    fontWeight: 400,
  })

  const descriptionStyle = css({
    fontSize: '1.25rem',
    lineHeight: 1.25,
    display: 'flex',
    flexDirection: 'column',
    height: '80%',
    alignItems: 'center',
  })

  const closeButtonStyle = css({
    marginLeft: 'auto',
    fontSize: '2rem',
    backgroundColor: 'Transparent',
    color: '#AAA',
    border: 'none',
  })
  const enterButtonStyle = css({
    marginTop: 'auto',
    width: '8rem',
    height: '4rem',
    backgroundColor: '#444',
    color: '#CCC',
    fontSize: '1.5rem',
    fontFamily: 'Garamond',
  })

  return (
    <Modal
      isOpen={isOpen}
      className={`${style}`}
      overlayClassName={`${overlayStyle}`}
      onRequestClose={onClose}
    >
      <header {...headerStyle}>
        <h1 {...headingStyle}>The Labyrinth of Minos</h1>
        <button {...closeButtonStyle} onClick={onClose}>
          <Icon path={mdiClose} size="1.5rem" color="#AAA" />
        </button>
      </header>
      <main {...descriptionStyle}>
        <p>This app displays the hierachy of polyominoes up to 8 squares.</p>

        <p>
          Clicking each mino will highlights its direct parents and children.
        </p>

        <p>Drag the screen to pan, and scroll or pinch to zoom.</p>

        <button {...enterButtonStyle} onClick={onClose}>
          Enter
        </button>
      </main>
    </Modal>
  )
}
