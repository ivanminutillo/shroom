import React from 'react'
import Wrapper from './newrequirement'
import Modal from '../modal'

export default ({toggleModal, modalIsOpen, scopeId}) => (
  <Modal
    isOpen={modalIsOpen}
    toggleModal={toggleModal}
    >
      <Wrapper
        toggleModal={toggleModal}
        scopeId={scopeId}
      />
  </Modal>
)

