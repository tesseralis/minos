import { css } from "emotion"
import React from "react"
import Modal from "react-modal"
import Icon from "@mdi/react"
import { mdiClose } from "@mdi/js"
import styled from "@emotion/styled"

import { colors } from "style/theme"
import Content from "./InfoContent"

Modal.setAppElement("#root")

const CloseButton = styled.button`
  margin-right: -1rem;
  margin-left: auto;
  padding: 0;
  background: none;
  border: none;
  cursor: pointer;
`

const timeout = 350
export default function InfoModal({ isOpen, onClose }: any) {
  const [isOpened, setOpened] = React.useState(isOpen)
  const overlayStyle = css`
    background-color: rgba(32, 32, 32, 0.5);

    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;

    display: flex;
    align-items: center;
    justify-content: center;

    opacity: ${isOpened ? 1 : 0};
    transition: opacity ${timeout}ms ease-in-out;
  `

  const style = css`
    background-color: ${colors.bg};
    padding: 1rem 2rem;
    line-height: 1.5;
    font-family: sans-serif;
    overflow: visible;

    display: flex;
    flex-direction: column;

    transition: transform ${timeout}ms ease-in-out;

    @media (min-device-width: 813px) {
      width: 32rem;
      height: 32rem;
      border: 2px solid ${colors.fg};
      transform: scale(${isOpened ? 1 : 0});
    }

    @media (max-device-width: 812px) {
      width: 100%;
      height: 100%;
      transform: translate3d(0, ${isOpened ? 0 : "100%"}, 0);
    }
  `

  function requestClose() {
    setOpened(false)
    onClose()
  }

  return (
    <Modal
      isOpen={isOpen}
      className={style}
      overlayClassName={overlayStyle}
      onAfterOpen={() => setOpened(true)}
      onRequestClose={requestClose}
      closeTimeoutMS={timeout}
    >
      <CloseButton onClick={requestClose}>
        <Icon size="2rem" color={colors.fg} path={mdiClose} />
      </CloseButton>
      <Content />
    </Modal>
  )
}
