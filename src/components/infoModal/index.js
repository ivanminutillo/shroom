import React from "react";
import Wrapper from "./info";
import Modal from "../modal";

const Skills = ({ toggleModal, modalIsOpen, providerId }) => (
  <Modal isOpen={modalIsOpen} toggleModal={toggleModal}>
    <Wrapper providerId={providerId} toggleModal={toggleModal} />
  </Modal>
);

export default Skills;
