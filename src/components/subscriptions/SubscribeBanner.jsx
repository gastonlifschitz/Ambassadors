import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";
import { translate } from "react-i18next";
import { Button } from "reactstrap";
import SubscriptionModal from "../subscriptions/SubscriptionModal";

class SubscribeBanner extends Component {
  state = {
    isOpen: false,
  };

  componentDidMount() {
    const { showOnMount } = this.props;
    this.setState({ isOpen: showOnMount });
  }

  toggle = (e) => {
    this.setState(({ isOpen }) => ({ isOpen: !isOpen }));
  };

  render() {
    const { t, onSubscribe } = this.props;

    const modalProps = { onSubscribe };

    return (
      <Fragment>
        <div>
          {/* <CardTitle>{t('wantToBe')}</CardTitle>
          <CardText>{t('getAllUpdates')}</CardText> */}
          <Button className="teal-btn" onClick={this.toggle}>
            {t("subscribe")}
          </Button>
        </div>
        <SubscriptionModal
          toggle={this.toggle}
          isOpen={this.state.isOpen}
          {...modalProps}
        />
      </Fragment>
    );
  }
}

SubscribeBanner.propTypes = {
  onSubscribe: PropTypes.func.isRequired,
  showOnMount: PropTypes.bool,
};

export default translate("subscriptions")(SubscribeBanner);
