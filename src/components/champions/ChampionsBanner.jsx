import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { Button } from 'reactstrap';
import ChampionsModal from './ChampionsModal';

class ChampionsBanner extends Component {
  state = {
    isOpen: false
  }

  componentDidMount() {
    const { showOnMount } = this.props;
    this.setState({ isOpen: showOnMount });
  }

  toggle = e => {
    this.setState(({ isOpen }) => ({ isOpen: !isOpen }));
  }

  render() {
    const { onSubscribe } = this.props;
    const modalProps = { onSubscribe };
    
    return (
      <Fragment>
        <div className="champions-banner">
          <Button className="teal-btn" onClick={this.toggle}>¡Conocelos!</Button>
        </div>
        <ChampionsModal toggle={this.toggle} isOpen={this.state.isOpen} {...modalProps} />
      </Fragment>
    );
  }
}

ChampionsBanner.propTypes = {
  showOnMount: PropTypes.bool
};

export default ChampionsBanner;
