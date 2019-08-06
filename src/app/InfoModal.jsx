import React, { useState } from 'react'
import Modal from 'react-modal'
import { css } from 'glamor'

import { colors } from 'style/theme'

Modal.setAppElement('#root')

// TODO use markdown instead when we'll have lots of paragraphs
function P({ children }) {
  const style = css({
    fontSize: '1rem',
    lineHeight: 1.4,
    marginBottom: '1rem',
  })
  return <p {...style}>{children}</p>
}

function Em({ children }) {
  const style = css({
    fontStyle: 'italic',
    fontWeight: 400,
  })
  return <em {...style}>{children}</em>
}

function Content() {
  const style = css({
    fontFamily: 'sans-serif',
    fontWeight: 300,
    lineHeight: 1.25,
    display: 'flex',
    flexDirection: 'column',
  })
  const headingStyle = css({
    fontSize: '1.875rem',
    fontFamily: 'fantasy',
    marginBottom: '1.25rem',
    letterSpacing: '1px',
    textAlign: 'center',
  })

  return (
    <div {...style}>
      <h1 {...headingStyle}>The Labyrinth of Minos</h1>
      <P>
        A <Em>polyomino</Em> is a shape composed of squares joined together at
        their edges.
      </P>

      <P>
        This labyrinth shows the family tree of polyominoes up to 8 squares. Two
        polyominoes are connected if one is a <Em>child</Em> of another—that is,
        if it can be created by adding a single square to the parent.
      </P>

      <P>
        Each polyomino is shaded according to its symmetry and the colors of its
        parents.
      </P>

      <P>
        Click/tap on a mino to highlight its parents and children. Drag to pan
        across the graph and scroll/pinch to zoom.
      </P>
    </div>
  )
}

const timeout = 350
export default function InfoModal({ isOpen, onClose }) {
  const [isOpened, setOpened] = useState(isOpen)
  const overlayStyle = css({
    backgroundColor: 'rgba(32, 32, 32, .5)',

    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,

    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',

    opacity: isOpened ? 1 : 0,
    transition: `opacity ${timeout}ms ease-in-out`,
  })

  const style = css({
    backgroundColor: colors.bg,
    padding: '3rem 2rem',
    color: colors.fg,
    lineHeight: 1.5,
    fontFamily: 'sans-serif',

    display: 'flex',
    flexDirection: 'column',

    transition: `transform ${timeout}ms ease-in-out`,

    '@media (min-device-width: 813px)': {
      width: '32rem',
      height: '32rem',
      border: `2px solid ${colors.fg}`,
      transform: `scale(${isOpened ? 1 : 0})`,
    },

    '@media (max-device-width: 812px)': {
      width: '100%',
      height: '100%',
      transform: `translate3d(0, ${isOpened ? 0 : '100%'}, 0)`,
    },
  })

  const enterButtonStyle = css({
    width: '8rem',
    height: '4rem',

    alignSelf: 'center',
    marginTop: 'auto',
    paddingTop: 8,

    backgroundColor: colors.bg2,
    color: colors.fg,
    border: `2px solid ${colors.fg}`,
    cursor: 'pointer',

    fontSize: '1.5rem',
    fontFamily: 'fantasy',
    fontWeight: 300,
    letterSpacing: '1px',

    ':hover': {
      // TODO make this a "lighten" function
      backgroundColor: '#444',
    },
  })

  function requestClose() {
    setOpened(false)
    onClose()
  }

  return (
    <Modal
      isOpen={isOpen}
      className={`${style}`}
      overlayClassName={`${overlayStyle}`}
      onAfterOpen={() => setOpened(true)}
      onRequestClose={requestClose}
      closeTimeoutMS={timeout}
    >
      <Content />
      <button {...enterButtonStyle} onClick={requestClose}>
        Enter
      </button>
    </Modal>
  )
}
