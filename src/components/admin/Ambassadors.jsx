import "../../styles/faq.css";
import React, { Fragment, Component } from "react";
import { translate } from "react-i18next";
import DocumentTitle from "react-document-title";
import { Row, Col, Container } from "reactstrap";
import Footer from "../Footer";
import api from "../../services/apiService";
import SubscriberItem from "./SubscriberItem";

class Ambassadors extends Component {
  state = {
    subscribers: [],
  };
  async componentDidMount() {
    try {
      const { data } = await api.getSubscriberList();
      this.setState({ subscribers: data });
      console.log("data", data);
    } catch (error) {}
  }

  toggle = (e) => {
    this.setState(({ isOpen }) => ({ isOpen: !isOpen }));
  };

  render() {
    // const { t, onSubscribe } = this.props;
    const { t } = this.props;
    const { subscribers } = this.state;
    // const modalProps = { onSubscribe };

    return (
      <DocumentTitle title={t("titleAdmin")}>
        <Fragment>
          <Container>
            <Row>
              <Col xs="12">
                <div className="faq-title">{t("titleAdmin")}</div>
              </Col>
              {subscribers.map((sub) => (
                <SubscriberItem key={sub._id} subscriber={sub} />
              ))}
            </Row>
          </Container>
          <Footer />
        </Fragment>
      </DocumentTitle>
    );
  }
}
export default translate("admin")(Ambassadors);
