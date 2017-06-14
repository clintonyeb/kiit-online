const Path = require('path');
const Aguid = require('aguid');
const Async = require('async');
const Boom = require('boom');
const Bcrypt = require('bcrypt');
const students = require('./assets/students.json');

const internals = {};

exports.rootHandler = function (request, reply) {
  const path = Path.resolve(`${__dirname}/../index.html`);
  return reply.file(path);
};

exports.assetsHandler = function (request, reply) {
  const path = Path.resolve(`${__dirname}/assets/${request.params.filename}`);
  return reply.file(path);
};

exports.imagesHandler = function (request, reply) {
  const path = Path.resolve(`${__dirname}/assets/images/${request.params.filename}`);
  return reply.file(path);
};

exports.previewHandler = function (request, reply) {
  const re = /(?:\.([^.]+))?$/;
  const filename = request.params.filename;
  const ext = re.exec(filename)[1];
  const path = Path.resolve(`${__dirname}/assets/previews/${ext}.svg`);
  return reply.file(path);
};

exports.uploadsHandler = function (request, reply) {
  const path = Path.resolve(`${__dirname}/uploads/previews/${request.params.filename}`);
  return reply.file(path);
};

exports.loginUser = function (request, reply) {
  const payload = request.payload;
  const userName = payload.userName;
  const db = request.server.app.redisClient;

  Async.waterfall([
    function (callback) {
      db.hget(`user:${userName}`, 'password', (err, userPassword) => {
        callback(null, userPassword);
      });
    },
    function validatePassword(userPassword, callback) {
      Bcrypt.compare(payload.password, userPassword, (err, isValid) => {
        if (err) {
          return callback(err);
        }

        if (isValid) {
          const token = internals.createToken(db, userName);

          const cookieOpts = internals.setCookie();

          return callback(null, token, cookieOpts);
        }
        return callback(err || new Error('Username and password incorrect'));

      });
    },
  ], (err, token, cookieOpts) => {
    if (err) {
      return reply(Boom.unauthorized('Username and password incorrect'));
    }
    return reply({ userName, token })
      .header('Authorization', token)
      .state('token', token, cookieOpts);
  });
};

exports.confirmRoll = function confirmRoll(request, reply) {
  const userName = request.payload.userName;
  const client = request.server.app.redisClient;

  if (!userName) {
    return reply(Boom.wrap(new Error('Invalid payload')));
  }

  const stud = students[userName];
  if (stud != null) {
    client.hget(`user:${userName}`, 'userName', (err, res) => {
      if (res === userName) {
        return reply(Boom.conflict('Account already exists'));
      }
      return reply(stud).code(200);
    });
  } else {
    return reply(Boom.notFound('Data not found'));
  }
};

internals.saltRounds = 10;

exports.saveUser = function saveUser(request, reply) {
  const payload = request.payload;
  const userName = payload.userName;
  const client = request.server.app.redisClient;

  Async.waterfall([
    function hashPassword(callback) {
      Bcrypt.hash(payload.password, internals.saltRounds, (err, hashedPassword) => {
        if (err) {
          return callback(err);
        }
        return callback(null, hashedPassword);
      });
    },
    function (password, callback) {
      client.hmset(`user:${userName}`, 'userName', userName, 'fullName', payload.fullName, 'password', password, 'email', payload.email, 'class', payload.class, 'year', payload.year, (err) => {
        if (err) {
          return callback(err);
        }
        return callback(null);
      });
    },
  ], (err) => {
    if (err) return Boom.wrap(err, 'Error registering account');
    return reply({ message: 'Account creation success', data: payload });
  });
};

internals.createToken = function (redisClient, userId) {
  const token = Aguid();
  const expiresDefault = Math.floor(new Date().getTime() / 1000) + (4 * 7 * 24 * 60 * 60);
  redisClient.hset('auths', token, userId);
  redisClient.hmset(`user:${userId}`, 'auth', token, 'expire', expiresDefault);
  return token;
};

internals.removeToken = function (redisClient, decoded) {
  return redisClient.del(decoded.id);
};

internals.setCookie = function () {
  const expiresDefault =
    Math.floor(new Date().getTime() / 1000) + (4 * 7 * 24 * 60 * 60); // expires in a month

  const cookieOptions = {
    ttl: expiresDefault,
    encoding: 'none',
    isSecure: false,
    isHttpOnly: false,
    clearInvalid: false,
    strictHeader: true,
  };

  return cookieOptions;
};

