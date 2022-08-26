import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { Button, Tooltip } from 'reactstrap';

export default class TooltipButton extends Component {
  static propTypes = {
    children: PropTypes.node,
    buttonProps: PropTypes.object,
    tooltipMessage: PropTypes.string.isRequired
  }

  state = {
    tooltipOpen: false
  }

  toggle = e => {
    this.setState(({ tooltipOpen }) => ({ tooltipOpen: !tooltipOpen }));
  }

  render() {
    // TODO: Asi solo se puede poner un tooltipButton por pagina
    return (
      <Fragment>
        <Button id="tooltip" {...this.props.buttonProps}>{this.props.children}</Button>
        <Tooltip placement="right" isOpen={this.state.tooltipOpen} target="tooltip" toggle={this.toggle}>
          {this.props.tooltipMessage}
        </Tooltip>
      </Fragment>
    );
  }
}
