import React from "react";
import Modal from '../modal'

const HelperModal = ({
  modalIsOpen,
  toggleModal,
}) => {
  return (
  <Modal
    isOpen={modalIsOpen}
    toggleModal={toggleModal}
    >
   <h1>ciao</h1>
  </Modal>
)};

export default HelperModal;
