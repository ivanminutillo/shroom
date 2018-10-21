import React from "react";
import CardModal from "./intent";
import Modal from "../modal";

export default ({ toggleModal, modalIsOpen, addIntent, intent, providerId, scopeId }) => (
  <Modal isOpen={modalIsOpen} toggleModal={toggleModal}>
    <CardModal toggleModal={toggleModal} addIntent={addIntent} intentId={intent} providerId={providerId} scopeId={scopeId}  />
  </Modal>
);
