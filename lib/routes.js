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
    path: '/assets/images/{filename}',
    handler: handlers.imagesHandler,
    config: { auth: false },
  });

  server.route({
    method: 'GET',
    path: '/assets/previews/{filename}',
    handler: handlers.previewHandler,
    config: { auth: false },
  });

  server.route({
    method: 'GET',
    path: '/assets/uploads/{filename}',
    handler: handlers.uploadsHandler,
    config: { auth: false },
  });

  server.route({
    method: 'GET',
    path: '/assets/{path}/{filename}',
    handler: handlers.avatarsHandler,
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
