import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Input } from 'reactstrap';

export default class TimePicker extends Component {
  static propTypes = {
    step: PropTypes.number,
    minTime: PropTypes.string,
    maxTime: PropTypes.string,
    onChange: PropTypes.func
  }

  static defaultProps = {
    step: 30,
    minTime: '00:00',
    maxTime: '24:00',
    onChange: () => {}
  }

  pad(num) {
    return `0${num}`.slice(-2);
  }

  stringToTime(str) {
    const timeSplit = str.split(':');
    const hour = parseInt(timeSplit[0], 10);
    const minute = parseInt(timeSplit[1], 10);

    return { hour, minute, second: 0 };    
  }

  stringToMinutes(str) {
    const { hour, minute } = this.stringToTime(str);
    return hour * 60 + minute;
  }

  handleOnChange = e => {
    const str = e.target.value;
    e.target.time = this.stringToTime(str);
    this.props.onChange(e);    
  }

  render() {
    const options = [];
    const { minTime, maxTime, step, ...otherProps } = this.props;
    const minMinutes = this.stringToMinutes(minTime);
    const maxMinutes = this.stringToMinutes(maxTime);

    for (let i = minMinutes; i < maxMinutes; i += step) {
      const h = parseInt(i / 60, 10);
      const m = i % 60;
      const time = `${this.pad(h)}:${this.pad(m)}`;
      options.push(<option key={i} value={time}>{time}</option>);
    }

    return (
      <Input {...otherProps} type="select" onChange={this.handleOnChange}>
        {options}
      </Input>
    );
  }
}
