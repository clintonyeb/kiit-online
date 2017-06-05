const handlers = require('./handlers');
const Path = require('path');

exports.init = function init(server) {
  // general routes

  // Set root route
  server.route({
    method: 'GET',
    path: '/',
    handler: handlers.rootHandler,
    config: { auth: false },
  });

  // assets
  server.route({
    method: 'GET',
    path: '/assets/{filename}',
    handler: handlers.assetsHandler,
    config: { auth: false },
  });

  server.route({
    method: 'GET',
    path: '/dist/{filename}',
    handler(request, reply) {
      const path = Path.resolve(__dirname, `../dist/${request.params.filename}`);
      return reply.file(path);
    },
  });

  // user routes

  // assets
  server.route({
    method: 'GET',
    path: '/authenticate',
    handler(request, reply) {
      return reply();
    },
    config: { auth: 'simple' },
  });

  server.route({
    method: 'POST',
    path: '/login',
    handler: handlers.loginUser,
    config: { auth: false },
  });


  server.route({
    method: 'POST',
    path: '/users/confirmRoll',
    handler: handlers.confirmRoll,
  });

  server.route({
    method: 'POST',
    path: '/users',
    handler: handlers.saveUser,
  });

  server.route({
    method: '*',
    path: '/{path*}',
    handler: handlers.rootHandler,
    config: {
      auth: false,
    },
  });
};
