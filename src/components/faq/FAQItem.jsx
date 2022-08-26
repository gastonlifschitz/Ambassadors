import React, { Component } from 'react';
import { translate } from 'react-i18next';
import { Button, Card, CardHeader, CardBody, Collapse } from 'reactstrap';
import PropTypes from 'prop-types';

class FAQItem extends Component {
  static propTypes = {
    question: PropTypes.string.isRequired,
    answer: PropTypes.string.isRequired
  }

  state = {
    collapse: false
  };

  toggle = () => {
    this.setState({ collapse: !this.state.collapse });
  }

  render() {
    const { question, answer } = this.props;

    return (
      <Card className="question-card">
        <CardHeader>
          <Button color="link" className="question" onClick={this.toggle}>{question}</Button>
        </CardHeader>
        <Collapse isOpen={this.state.collapse}>
          <CardBody 
            className="answer"
            dangerouslySetInnerHTML={{ __html: answer }}
          />
            {/* {answer}
          </CardBody> */}
        </Collapse>
      </Card>
    );
  }
}

export default translate()(FAQItem);
