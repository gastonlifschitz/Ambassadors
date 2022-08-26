import "../../styles/faq.css";
import React, { Fragment } from "react";
import { translate } from "react-i18next";
import { Row, Col, Container } from "reactstrap";
import DocumentTitle from "react-document-title";
import Footer from "../Footer";
import FAQItem from "./FAQItem";

const FAQContainer = ({ t }) => {
  const questions = [
    {
      question: "Quiero ser embajador/a ¿Por dónde empiezo?",
      answer:
        '<p>Podés sumarte a eventos que organicen otros embajadores para ir de oyente y aprender. También podes sumarte al <a href="https://ibm-a91i.slack.com/archives/CN75N4VL5" target="_blank" rel="noopener noreferrer">canal de Slack</a> y buscar un Ambassador Champion para que te guíe en cómo empezar.</p>',
    },
    {
      question: "¿Qué necesito para poder crear un evento?",
      answer:
        "Para poder crear un evento necesitás contar con:\n-      Ser parte de la comunidad de embajadores. \n-      Institución en la cual se desarrollará el evento y la dirección de la misma.\n-      Fecha y horario del evento.\n-      Cantidad de asistentes aproximada.\n-      Descripción que especifique: si el evento es abierto a toda la comunidad, de qué trata la actividad, tipo de conocimientos previos, entre otros.",
    },
    {
      question: "¿Qué hago si quiero ayudar a un/a embajador/a en su evento?",
      answer:
        "Lo primero que tenés que hacer es contactarte con el embajador del evento. Para hacerlo, podés hacer click en el botón que aparecerá en el evento, <strong>Me quiero sumar</strong>, y se abrirá una pantalla para seleccionar el servicio de mail que utilices que te llevará directamente al mail del/la embajador/a donde podrás consultarle cómo podés colaborar.",
    },
    {
      question: "¿Puedo ayudar en un evento sin ser orador/a?",
      answer:
        "Sí, no todos los embajadores son oradores. Es importante que te comuniques con el/la embajador/a, quien te dirá en qué actividades podrás colaborar.",
    },
    {
      question:
        "¿Qué hago si mi evento dura más de un día o se repite varias veces?",
      answer:
        "Cuando crees el evento debés hacerlo poniendo la fecha de finalización del mismo, haciendo las aclaraciones pertinentes en la descripción (Cantidad de sesiones, fecha de inicio y finalización, etc).",
    },
    /*  {
      question:
        "¿Qué material tengo disponible si quiero realizar un evento? ¿Cómo se usa?",
      answer:
        'Contamos con <a href=" https://ibm.box.com/s/nmeusqz5dhfxjocmy3580r6nnu54hn86" target="_blank" rel="noopener noreferrer">Activity Kits</a> para cada temática que sirven como punto de partida. También podes sumar a un Ambassador Champion para que te guíe con el material a utilizar.',
    }, */
    {
      question:
        "¿Qué hago si necesito embajadores que me ayuden en uno de mis eventos?",
      answer:
        'Podes contactar a los Ambassadors Champions y ellos se encargarán de hacer masiva la difusión entre el resto de los Ambassadors. También podes sumarte al <a href="https://ibm-a91i.slack.com/archives/CN75N4VL5" target="_blank" rel="noopener noreferrer">canal de Slack</a> y contar tu propuesta allí!',
    },
    {
      question: "¿Cómo puedo acercarme a una institución académica?",
      answer:
        'Todos los embajadores deben enviar un mail presentándose ante la institución académica y contándole de qué se trata esta iniciativa de IBM. Dentro de nuestro material para embajadores contamos con una <a href="https://ibm.box.com/s/n68djm7dsmmb6dzw4mqymkk539fdbah9" target="_blank" ref="noopener noreferrer" >carta de presentación</a> que puedes utilizar a modo de “speech”.',
    },
    {
      question: "¿Es posible elegir la institución?",
      answer:
        "Sí, siempre y cuando lo consultes con anterioridad, podés participar en la institución que quieras.",
    },
    {
      question:
        "¿Cómo es el paso siguiente a nuestra participación como Embajadores?",
      answer:
        "Luego de la presentación, nos interesa saber qué les pareció! Debemos enviarle una encuesta, para generar nuestro propio NPS. Además, si la institución quisiera continuar con capacitaciones formales u otros programas de IBM, podes contactar a los Ambassadors Champions que te indicarán como continuar.",
    },
    {
      question:
        "¿Puedo programar eventos con instituciones donde ya tengo contactos?",
      answer:
        "¡Sí! Recordá mantener en copia a los Ambassadors Champions. Es importante ampliar nuestra red académica, por lo tanto, todas las nuevas conexiones que podamos generar son bienvenidas.",
    },
    {
      question: "¿Necesito cargar las horas en IBM Volunteers?",
      answer:
        'Sí, ingresando en ibm.org deberás cargar tus horas como embajador para que puedan ser donadas a distintas organizaciones de nuestra comunidad, siempre y cuando las organizaciones cumplan con los requisitos de Ciudadanía Corporativa y estén dadas de altas para recibir IBM Grants. ¡No te olvides de cargar las horas en <a href="https://yourlearning.ibm.com/" target="_blank" ref="noopener noreferrer" >Your Learning</a>!',
    },
    {
      question: "¿Puedo cargar las horas en Your Learning?",
      answer:
        'Podés cargar las horas de preparación del material, horas de estudio y el tiempo de participación en la actividad en <a href="https://yourlearning.ibm.com/" target="_blank" ref="noopener noreferrer" >Your Learning</a> para que te sume en tu Think40.',
    },
  ];

  return (
    <DocumentTitle title={t("faqTitle")}>
      <Fragment>
        <Container>
          <Row>
            <Col xs="12">
              <div className="faq-title">{t("faqTitle")}</div>
            </Col>
            <Col xs="12">
              <div id="accordion">
                {questions.map((qa) => (
                  <FAQItem key={qa} {...qa} />
                ))}
              </div>
            </Col>
          </Row>
        </Container>
        <Footer />
      </Fragment>
    </DocumentTitle>
  );
};

export default translate("faq")(FAQContainer);
