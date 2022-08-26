require('dotenv').config();
const appName = require('./../package').name;
const express = require('express');
const cors = require('cors');
const url = require('url');
const compression = require('compression');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const log4js = require('log4js');
const jwt = require('express-jwt');
const responseService = require('./services/response');
const localConfig = require('./config/local.json');
const path = require('path');
const serveStatic = require('serve-static');
const revUtils = require('./services/revUtils');
const notification = require('./services/notification');
const cwd = process.cwd();

const logger = log4js.getLogger(appName);
logger.setLevel(process.env.LOG_LEVEL || 'debug');

const app = express();
const auth = jwt({ secret: process.env.JWT_SECRET, credentialsRequired: true });

app.use(log4js.connectLogger(logger, { level: 'debug' }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(compression());
app.use(cors());
app.use(cookieParser());

// Initialize database connection
require('./model/db');

// Restore notifications scheduled before serve downtime
notification.restoreScheduledNotifications();

// Schedule upcoming events notification
notification.notifyUpcomingEvents();


const dataRouter = require('./routers/data');
app.use('/data', dataRouter);

// Authentication
app.use('/api', auth, (err, req, res, next) => {
  const path = url.parse(req.url).pathname;
  if (err.name === 'UnauthorizedError' && path !== '/login' && path !== '/metadata' && path !== '/assert') {
    logger.warn(`Unauthorized ${req.method} to ${req.baseUrl}: ${err.message}`);
    responseService.json(res, 401, { message: err.message });
  }
  else {
    next();
  }
});

// Set API endpoint
const apiRouter = require('./routers/api');
app.use('/api', apiRouter);

if (process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'test') {
  app.enable('trust proxy');

  app.use((req, res, next) => {
    if (req.secure)
      next();
    else
      res.redirect(`https://${req.headers.host}${req.url}`);
  });

  // Redirect to W3 login page if not logged in
  app.use((req, res, next) => {
    if (!req.cookies.token) {
      res.cookie('redirectTo', req.originalUrl);
      res.redirect(`${req.baseUrl}/api/login`);
    }
    else {
      next();
    }
  });

  // Serve static revved files with uncoditional cache
  app.use(serveStatic(path.join(cwd, 'build'), {
    index: false,
    setHeaders: (res, path) => {
      if (revUtils.isRevved(path))
        res.setHeader('Cache-Control', 'public, immutable, max-age=31536000');      
    }
  }));

  // Route any non API and non static file to React Client Router for SPA development
  app.use((req, res) => {
    res.sendFile(path.join(cwd, 'build', 'index.html'));
  });
}

// Fallback to 404
app.use((req, res) => {
  res.status(404);
  res.json({ message: '404 - Not Found' });
});

const port = process.env.PORT || localConfig.port;
app.listen(port, () => {
  logger.info(`CWD: ${cwd}`);
  logger.info(`Server listening on http://localhost:${port}`);
});
