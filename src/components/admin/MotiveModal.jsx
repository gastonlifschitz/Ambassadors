//LO AGREGUE PARA USAR EL MODAL DESDE SUBSCRIER ITEM

import React, { Component } from "react";
import { Modal, ModalBody, ModalHeader, Label, Input } from "reactstrap";
import SpinnerButton from "../commons/SpinnerButton";
import api from "../../services/apiService";
import snackbarService from "../../services/snackbarService";

class MotiveModal extends Component {
  motives = [
    "Baja solicitada por el embajador",
    "El embajador dejó la compañía",
    "Embajador no participativo",
    "Otros",
  ];
  constructor(props) {
    super(props);
    this.state = {
      subscribers: [],
    };
  }

  handleOnSubmit = async () => {
    const sub = this.props.sub;
    const unsubscriber = {
      motive: this.state.selectedmotives,
      id: sub,
    };
    try {
      api.addUnsubscriber(unsubscriber);
      snackbarService.show("deleted", 5000);
      window.location.reload();
    } catch (error) {
      snackbarService.show("Error", 7000);
    }
  };

  handleInputChange = (e) => {
    const { name, value } = e.target;
    this.setState({ ["selected" + name]: value });
  };

  render() {
    const { isOpen, toggle, sub, name } = this.props;
    console.log("MODAL " + sub);

    return (
      <Modal isOpen={isOpen} centered toggle={toggle}>
        <ModalHeader> Cancelar suscripción </ModalHeader>
        <ModalBody className="motive-modal">
          <Label className="form-label form-padding " for=" Dar de baja">
            {" "}
            Estás dando de baja a:{" "}
          </Label>
          <Input name="motives" type="" value={name}>
            <option>{name}</option>
            ))}
          </Input>

          <Label
            className="form-label form-padding"
            for=" ¿Por qué das de baja a este embajador?"
          >
            {" "}
            Elegí el motivo:{" "}
          </Label>
          <Input
            name="motives"
            type="select"
            value={this.state.motives}
            onChange={this.handleInputChange}
          >
            {this.motives.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </Input>
          <div className="unsubscribe-box">
            <SpinnerButton
              className="teal-btn"
              message="Eliminar"
              onClick={this.handleOnSubmit}
            />
            <SpinnerButton
              className="btn-cancel"
              message="Cancelar"
              onClick={toggle}
            />
          </div>
        </ModalBody>
      </Modal>
    );
  }
}

export default MotiveModal;
