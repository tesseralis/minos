import React from 'react'
import Modal from 'react-modal'
import { css } from 'glamor'

Modal.setAppElement('#root')

function Content() {
  const style = css({
    fontSize: '1.125rem',
    lineHeight: 1.25,
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    alignItems: 'center',
  })
  const headingStyle = css({
    fontWeight: 400,
    marginBottom: '1.25rem',
  })

  const pStyle = css({
    marginBottom: '1rem',
  })

  return (
    <div {...style}>
      <h1 {...headingStyle}>The Labyrinth of Minos</h1>
      <p {...pStyle}>
        A <em>polyomino</em> is a shape composed of squares joined together at
        their edges.
      </p>

      <p {...pStyle}>
        This labyrinth shows the family tree of polyominoes up to 8 squares. Two
        polyominoes are connected if one is a <em>child</em> of another—that is,
        if it can be created by adding a single square to the parent.
      </p>

      <p {...pStyle}>
        Polyominoes are shaded according to their symmetry and the colors of its
        parents.
      </p>

      <p {...pStyle}>
        Click/tap on a mino to highlight its parents and children. Drag to pan
        across the graph and scroll/pinch to zoom.
      </p>
    </div>
  )
}

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
    padding: '2rem',
    color: '#AAA',
    fontFamily: 'Garamond',

    display: 'flex',
    flexDirection: 'column',
  })

  const enterButtonStyle = css({
    marginTop: 'auto',
    width: '8rem',
    height: '4rem',
    backgroundColor: '#444',
    color: '#CCC',
    fontSize: '1.5rem',
    fontFamily: 'Garamond',
    alignSelf: 'center',

    ':hover': {
      backgroundColor: '#555',
    },
  })

  return (
    <Modal
      isOpen={isOpen}
      className={`${style}`}
      overlayClassName={`${overlayStyle}`}
      onRequestClose={onClose}
    >
      <Content />
      <button {...enterButtonStyle} onClick={onClose}>
        Enter
      </button>
    </Modal>
  )
}
