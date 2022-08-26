import React, { Component } from "react";
import authService from "../../services/authService";
import api from "../../services/apiService";
import { Label, Input } from "reactstrap";
import SpinnerButton from "../commons/SpinnerButton";
import snackbarService from "../../services/snackbarService";

export default class SubscribersList extends Component {
  motives = [
    "Baja solicitada por el embajador",
    "El embajador dejó la compañía",
    "Embajador no participativo",
    "Otros",
  ];

  isAdmin() {
    return authService.getUser().isAdmin;
  }

  constructor(props) {
    super(props);
    this.state = {
      subscribers: [],
    };
  }
  static defaultProps = {
    submitting: false,
    editting: false,
  };

  async componentDidMount() {
    const { showOnMount } = this.props;

    await this.setState({ isOpen: showOnMount });
    try {
      const response = await api.getSubscribers();
      this.setState({
        subscribers: response.data,
        loading: false,
        selectedsubscribers: response.data[0]._id,
        selectedmotives: this.motives[0],
      });
    } catch (error) {
      this.setState({ error, loading: false });
    }
  }

  handleInputChange = (e) => {
    const { name, value } = e.target;
    this.setState({ ["selected" + name]: value });
  };

  handleOnSubmit = (async) => {
    const unsubscriber = {
      motive: this.state.selectedmotives,
      id: this.state.selectedsubscribers,
    };
    try {
      api.addUnsubscriber(unsubscriber);
      snackbarService.show("deleted", 5000);
      window.location.reload();
    } catch (error) {
      snackbarService.show("Error", 7000);
    }
  };

  render() {
    const { subscribers } = this.state;
    const { toggle } = this.props;

    return (
      <form className="selector">
        <Label className="form-label" for="Pick subscriber">
          {" "}
          Elegí el embajador:{" "}
        </Label>
        <Input
          name="subscribers"
          type="select"
          value={subscribers._id}
          onClick={this.handleInputChange}
        >
          {subscribers.map((subscriber) => (
            <option value={subscriber.user.uid} key={subscriber._id}>
              {subscriber.user.fullName}
            </option>
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
      </form>
    );
  }
}
