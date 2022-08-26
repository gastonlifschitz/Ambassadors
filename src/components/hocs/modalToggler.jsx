import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';

export default function modalToggler(Toggler, Modal) {
  const togglerDisplayName = Toggler.displayName || Toggler.name || 'Component';
  const modalDisplayName = Modal.displayName || Modal.name || 'Component';

  return class extends Component {
    static propTypes = {
      togglerProps: PropTypes.object,
      modalProps: PropTypes.object,
      isOpen: PropTypes.bool,
      children: PropTypes.node
    }

    static defaultProps = {
      togglerProps: { },
      modalProps: { },
      isOpen: false
    }

    static displayName = `modalToggler(${togglerDisplayName}, ${modalDisplayName})`

    state = {
      isOpen: this.props.isOpen
    }

    toggle = e => {
      this.setState(({ isOpen }) => ({ isOpen: !isOpen }));
    }

    render() {
      return (
        <Fragment>
          <Toggler onClick={this.toggle} {...this.props.togglerProps}>
            {this.props.children}
          </Toggler>
          <Modal toggle={this.toggle} isOpen={this.state.isOpen} {...this.props.modalProps} />
        </Fragment>
      );
    }
  };
}
