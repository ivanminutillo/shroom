import React from "react";
import Wrapper from "./index";
import Modal from "../../components/modal";
import {withRouter} from 'react-router-dom'
import { PropsRoute } from "../../helpers/router";

class ProcessModal extends React.Component {
    componentDidMount() {
        if (this.props.match.params.id && !this.props.modalIsOpen) {
            return this.props.toggleModal(this.props.match.params.id)
        }
    }
    render() {
        const {toggleModal, modalIsOpen, location, providerId} = this.props
      return (
        <Modal isOpen={modalIsOpen} toggleModal={toggleModal}>
        <Wrapper
            toggleModal={toggleModal}
            location={location}
            providerId={providerId}
            id={this.props.match.params.id}
        />
      </Modal>
      )
  }  
}

export default withRouter(ProcessModal) 