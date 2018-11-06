import React from 'react'
import Wrapper from './newprocess'
import Modal from '../modal'

export default ({toggleModal, modalIsOpen}) => (
  <Modal
    isOpen={modalIsOpen}
    toggleModal={toggleModal}
    >
      <Wrapper
        toggleModal={toggleModal}
      />
  </Modal>
)

