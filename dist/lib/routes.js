'use strict';

var index = require('./controllers');

/**
 * Application routes
 */
module.exports = function(app) {

  // All other routes to use Angular routing in app/scripts/app.js
  app.get('/partials/*', index.partials);
  app.get('/fonts/:file', index.fonts);
  app.get('/auth/client', function(req, res) {
    res.send({id: process.env.PORTO_CLIENT_ID, secret: process.env.PORTO_CLIENT_SECRET});
  });
  app.get('/*', index.index);
};
