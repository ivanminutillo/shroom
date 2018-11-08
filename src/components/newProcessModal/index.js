import React from "react";
import Wrapper from "./newprocess";
import Modal from "../modal";

class ProcessModal extends React.Component {
  render() {
    const { toggleModal, modalIsOpen } = this.props;
    return (
      <Modal isOpen={modalIsOpen} toggleModal={toggleModal}>
        <Wrapper toggleModal={toggleModal} />
      </Modal>
    );
  }
}

export default ProcessModal;
