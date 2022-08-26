const service = {};
const moment = require('moment');
const pug = require('pug');
const juice = require('juice');
const path = require('path');

const link = process.env.URL;
const cwd = process.cwd();

const nameMapper = {
  name: 'Nombre del evento',
  description: 'Descripción',
  institution: 'Institución',
  address: 'Dirección',
  date: 'Fecha',
  expected: 'Cantidad de asistentes',
  actual: 'Cantidad de asistentes finales',
  feedback: 'Comentario del embajador',
  speakers: 'Speakers'
};

const buildContent = (filename, params) => {
  const html = pug.renderFile(path.join(cwd, 'server', 'emails', `${filename}.pug`), params);
  const content = juice(html);

  return content;
};

service.eventCreatedAdmin = event => {
  const content = buildContent('created', {
    event,
    link
  });

  return {
    title: `Evento creado - ${event.name}`,
    content
  };
};

service.eventCreated = event => {
  const content = buildContent('created_ambassador', {
    event,
    link
  });

  return {
    title: `Evento creado - ${event.name}`,
    content
  };
};

service.eventRejected = (event, message) => {
  const content = buildContent('rejected_ambassador', {
    event,
    link,
    message
  });

  return {
    title: `Acción requerida - Revisar evento ${event.name}`,
    content
  };
};

// FALTA MODIFICAR (¡Edited con una T!)
// TODO_2: Usando i servicio, crear un mail que muestre los cambios.
service.eventEditted = (event, diff) => {

  const changes = diff.map(d => {

    if (d.path[0] === 'speakers') // TODO: extract speakers
      return '';
    else if (d.path[0] === 'notifications')
      return '';


    const name = d.path.length > 1 ? d.path[1] : d.path[0];
    const nameStr = `<p><strong>${nameMapper[name]}</strong></p>`;
    let oldStr = d.lhs;
    let newStr = d.rhs;

    if (name === 'date') {
      oldStr = moment(d.lhs)
        .utc(-3)
        .format('DD/MM/YYYY, HH:mm');

      newStr = moment(d.rhs)
        .utc(-3)
        .format('DD/MM/YYYY, HH:mm');
    }


    return `${nameStr}<p>Valor anterior: <em>${oldStr}</em></p><p>Nuevo valor: <em>${newStr}</em></p>`;
  }).join('\n');

  return {
    title: `Evento editado - ${event.name}`,
    content: `
     <h4>El evento ${event.name} ha sido editado.</h4>
     <p>Cambios realizados:</p>
     ${changes}
     <a href="${link}/event/${event.id}">Ver evento</a>
    `
  };
};

service.eventApproved = (event, message) => {
  const content = buildContent('approved_ambassador', {
    event,
    link,
    message
  });

  return {
    title: `Evento aprobado - ${event.name}`,
    content
  };
};

service.eventApprovedFinished = (event, message) => {
  const content = buildContent('approvedAndFinished_ambassador', {
    event,
    link,
    message
  });

  return {
    title: `Acción requerida - Evento finalizado ${event.name}`,
    content
  };
};

service.eventFinishedAdmin = event => {
  const content = buildContent('finished', {
    event,
    link
  });

  return {
    title: `Evento finalizado - ${event.name}`,
    content
  };
};

service.eventFinished = event => {
  const content = buildContent('finished_ambassador', {
    event,
    link
  });

  return {
    title: `Acción requerida - Completar evento ${event.name}`,
    content
  };
};

service.eventCompleted = (event, message) => {
  const content = buildContent('completed', {
    event,
    link,
    message
  });

  return {
    title: `Evento completado - ${event.name}`,
    content
  };
};

service.eventCancelled = (event, message) => {
  const content = buildContent('cancelled', {
    event,
    link,
    message
  });

  return {
    title: `Evento cancelado - ${event.name}`,
    content
  };
};

service.eventDeleted = event => {
  const content = buildContent('deleted', {
    event,
    link
  });

  return {
    title: `Evento eliminado - ${event.name}`,
    content
  };
};

service.userSubscribed = subscriber => {
  const content = buildContent('subscribed', {
    subscriber
  });

  return {
    title: '¡Bienvenido a la comunidad de embajadores!',
    content
  };
};

service.upcomingEvents = events => {
  events = events.map(e => {
    const date = moment(e.date);
    e.dateNumber = date.format('D');
    e.dateMonth = date.format('MMM').replace('.', '');

    return e;
  });

  const content = buildContent('upcoming_events', {
    events,
    link
  });

  return {
    title: 'Próximos eventos',
    content
  };
};

module.exports = service;