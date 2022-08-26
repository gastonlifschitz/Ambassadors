import React, { Component, Fragment } from "react";
import { Button } from "reactstrap";
import MotiveModal from "./MotiveModal";

class UnsubscribeAmbassadors extends Component {
  state = { isOpen: false };

  componentDidMount() {
    const { showOnMount } = this.props;
    this.setState({ isOpen: showOnMount });
  }

  toggle = (e) => {
    this.setState(({ isOpen }) => ({ isOpen: !isOpen }));
  };

  render() {
    return (
      <Fragment>
        <MotiveModal toggle={this.toggle} isOpen={this.state.isOpen} />
        <Button
          className="download-btn blue-btn float-right"
          onClick={this.toggle}
        >
          Eliminar suscriptor
        </Button>
      </Fragment>
    );
  }
}

export default UnsubscribeAmbassadors;
