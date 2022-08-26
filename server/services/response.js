const service = {};

service.json = (res, status, json) => {
  res.status(status);
  res.json(json);
};

service.csv = (res, csv, separator) => {
  res.type('text/csv');
  res.set('Content-Disposition', 'attachment');
  res.send(`sep=${separator}\n${csv}`);
};

module.exports = service;
