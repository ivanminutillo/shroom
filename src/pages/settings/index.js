import React from "react";
import CardModal from "./settings";
import Modal from "../../components/modal";

export default ({ toggleModal, modalIsOpen, providerId }) => (
  <Modal isOpen={modalIsOpen} toggleModal={toggleModal}>
    <CardModal providerId={providerId} toggleModal={toggleModal}  />
  </Modal>
);
