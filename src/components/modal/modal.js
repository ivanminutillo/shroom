import React from "react";
import Icons from '../../atoms/icons.tsx'
import styled from "styled-components";
import { clearFix } from "polished";

const Background = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(51, 60, 69, 0.95);
  z-index: 10000000;
  height: 100%;
  justify-content: center;
  overflow: auto;
  cursor: pointer;
`;

const Dialog = styled.div`
  width: 700px;
  box-shadow: 0 2px 8px 3px rgba(0, 0, 0, 0.3);
  z-index: 9999999999;
  background-color: #FFFFFF;
  padding: 0;
  margin: 40px auto;
  position: absolute;
  top: 20px;
  left: 50%;
  margin-left: -350px;
  border-radius: 3px;
  outline: none;
`;

const Action = styled.div`
  ${clearFix()};
  padding-top: 10px;
  padding-right: 10px;
  float: right;
`;

const Close = styled.div`
  float: right;
  cursor: pointer;
`;

const Content = styled.div`
  ${clearFix()};
`;

class Modal extends React.Component  {
  render() {
  const { isOpen, toggleModal, children } = this.props
  return isOpen ? (
    <div>
      <Background onClick={toggleModal} />
      <Dialog>
        <Action>
          <Close onClick={toggleModal}>
            <Icons.Cross width="20" height="20" color="#333" />
          </Close>
        </Action>
        <Content>{children}</Content>
      </Dialog>
    </div>
  ) : null;
  }
};

export default Modal;
