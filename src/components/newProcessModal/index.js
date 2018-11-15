import React from "react";
import Wrapper from "./newprocess";
import Modal from "../modal";

class ProcessModal extends React.Component {
  render() {
    const { toggleModal, modalIsOpen, history } = this.props;
    return (
      <Modal isOpen={modalIsOpen} toggleModal={toggleModal}>
        <Wrapper history={history} toggleModal={toggleModal} />
      </Modal>
    );
  }
}

export default ProcessModal;
