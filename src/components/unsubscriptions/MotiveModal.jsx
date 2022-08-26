import React, { Component } from "react";
import { Modal, ModalBody, ModalHeader } from "reactstrap";
import UnsubscribeForm from "./UnsubscribeForm";

class MotiveModal extends Component {
  render() {
    const { toggle, isOpen } = this.props;

    return (
      <Modal isOpen={isOpen} toggle={toggle} centered>
        <ModalHeader> Cancelar suscripción </ModalHeader>
        <ModalBody className="motive-modal">
          <UnsubscribeForm toggle={toggle} />
        </ModalBody>
      </Modal>
    );
  }
}

export default MotiveModal;
