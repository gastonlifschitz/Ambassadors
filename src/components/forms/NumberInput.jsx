import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Input } from 'reactstrap';

// TODO: may be more general with min and max attributes. Also does not support negative
// numbers
export default class NumberInput extends Component {
  static propTypes = {
    onChange: PropTypes.func
  }

  isNumeric(value) {
    return !isNaN(value);
  }

  onChange = e => {
    e.target.value = e.target.value.trim();
    if (this.isNumeric(e.target.value)) {
      if (e.target.value.length) {
        const inputNumber = parseInt(e.target.value, 10);
        e.target.value = inputNumber > 0 ? inputNumber : '';
      }

      this.props.onChange(e);
    }
  }

  render() {
    return <Input {...this.props} onChange={this.onChange} type="text" />;
  }
}
