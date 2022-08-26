import React, { Component } from "react";
import { Row, Col, Modal, ModalBody } from "reactstrap";
import SpinnerButton from "../commons/SpinnerButton";

const ambChampions = [
  {
    name: "Agile",
    ambassadors: [
      {
        name: "Fabian Albino",
        pic: "fabianalbino",
      },
      {
        name: "Lucila Ranucci",
        pic: "lucilaranucci",
      },
      {
        name: "Marcelo Ayres",
        pic: "marceloayres",
      },
      {
        name: "Valeria Estela",
        pic: "valeriaestela",
      },
    ],
  },
  {
    name: "Blockchain",
    ambassadors: [
      {
        name: "Valeria Cremona",
        pic: "valeriacremona",
      },
    ],
  },
  {
    name: "Cloud",
    ambassadors: [
      {
        name: "Lourdes Cabrera",
        pic: "lourdescabrera",
      },
      {
        name: "Matías Budano",
        pic: "matiasbudano",
      },
      {
        name: "Agustín La Salvia",
        pic: "agustinlasalvia",
      },
    ],
  },
  {
    name: "Data Science & AI",
    ambassadors: [
      {
        name: "Julián Sambucetti",
        pic: "juliansambucetti",
      },
      {
        name: "Juliana Moriones",
        pic: "julianamoriones",
      },
      {
        name: "Marcelo Ripoll",
        pic: "marceloripoll",
      },
    ],
  },
  {
    name: "Design Thinking",
    ambassadors: [
      {
        name: "Juan Cruz Bruni",
        pic: "juancruzbruni",
      },
      {
        name: "Leandro De Bueno",
        pic: "leandrodebueno",
      },
    ],
  },
  {
    name: "Developers",
    ambassadors: [
      {
        name: "Cecilia Bel",
        pic: "ceciliabel",
      },
      {
        name: "Diego Tabares",
        pic: "diegotabares",
      },
      {
        name: "Nicolas Nappe",
        pic: "nicolasnappe",
      },
    ],
  },
  {
    name: "Diversidad & Inclusión",
    ambassadors: [
      {
        name: "Delfina Daglio",
        pic: "delfinadaglio",
      },
      {
        name: "Julieta Reyes",
        pic: "julietareyes",
      },
    ],
  },
  {
    name: "Internet of Things",
    ambassadors: [
      {
        name: "Germán Santini",
        pic: "germansantini",
      },
      {
        name: "Gustavo Giuffre",
        pic: "gustavogiuffre",
      },
    ],
  },
  {
    name: "Robótica",
    ambassadors: [
      {
        name: "Josefina Obiglio",
        pic: "josefinaobiglio",
      },
      {
        name: "Martín Canteros",
        pic: "martincanteros",
      },
    ],
  },
  {
    name: "Seguridad",
    ambassadors: [
      {
        name: "Pablo Acevedo",
        pic: "pabloacevedo",
      },
    ],
  },
];

class ChampionsModal extends Component {
  render() {
    const { toggle, isOpen } = this.props;

    return (
      <Modal isOpen={isOpen} toggle={toggle} className="champions-modal">
        <ModalBody className="champions-modal-body">
          <Row>
            <Col>
              <h3>Ambassador Champions</h3>
            </Col>
          </Row>
          <div className="champions">
            {ambChampions.map((category) => (
              <div key={category.name} className="category">
                <h4 className="category-title">{category.name}</h4>
                <div className="champions-pictures">
                  {category.ambassadors.map((ambassador) => (
                    <div key={ambassador.pic} className="champion">
                      <img
                        src={`/img/champions/` + ambassador.pic + `.png`}
                        alt={ambassador.name}
                        className="champion-pic"
                      />
                      <span className="champion-name">{ambassador.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <Row className="justify-content-end">
            <Col xs="auto">
              <SpinnerButton
                className="float-right teal-btn close-champions"
                message="Cerrar"
                onClick={toggle}
              />
            </Col>
          </Row>
        </ModalBody>
      </Modal>
    );
  }
}

export default ChampionsModal;
