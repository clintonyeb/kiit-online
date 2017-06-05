const Boom = require('boom');

const internals = {};


internals.implementation = function (server, options) {
    let redisClient = server.app.redisClient;

    const scheme = {
        authenticate: function (request, reply) {
            const token = request.state ? request.state.token : (request.payload ? request.payload.token : null);

            if (!token) {
                return reply(Boom.unauthorized(null, 'Simple'));
            }

            // validate token
            redisClient.get('token', (err, data) => {
                if (err || data === null) {
                    return reply(Boom.unauthorized(null, 'Simple'));
                }

                redisClient.hget(`users${data}`, 'auth', (err, data) => {
                    if (data === token) {
                        return reply.continue({ token: token });
                    }
                    else {
                        return reply(Boom.unauthorized(null, 'Simple'));
                    }
                })
            })
        }
    }

    return scheme;
}

exports.register = function (plugin, options, next) {
    plugin.auth.scheme('simple', internals.implementation);
    next();
};

exports.register.attributes = {
    name: "simple"
};
