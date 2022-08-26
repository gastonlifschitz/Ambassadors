const urlParser = require('url');

const service = {};

const fullUrl = req => new urlParser.URL(`${req.protocol}://${req.get('host')}${req.originalUrl}`);

const urlPage = (req, page) => {
  const url = fullUrl(req);
  url.searchParams.set('page', page);

  return url.href;
};

service.build = (req, page, maxPage) => {
  let link = '';

  if (maxPage === 1) {
    link = link.concat(`<${urlPage(req, 1)}>; rel="first", `);
    link = link.concat(`<${urlPage(req, 1)}>; rel="last"`);
  }

  if (page < maxPage) {
    link = link.concat(`<${urlPage(req, page + 1)}>; rel="next", `);
    link = link.concat(`<${urlPage(req, maxPage)}>; rel="last"`);
  }

  if (page > 1) {
    if (link.length)
      link = link.concat(', ');

    link = link.concat(`<${urlPage(req, page - 1)}>; rel="prev",`);
    link = link.concat(`<${urlPage(req, 1)}>; rel="first"`);
  }

  return link.slice(0, -1); // Remove last trailing comma
};

module.exports = service;
