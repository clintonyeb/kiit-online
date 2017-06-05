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

exports.loginUser = function (request, reply) {
  const payload = request.payload;
  const db = request.server.app.redisClient;

  Async.waterfall([
    function (callback) {
      if (payload && payload.userName && payload.password) {
        db.hget('users', payload.userName, (err, userId) => {
          if (err || userId === null) {
            return callback(err || new Error('Username and password incorrect'));
          }
          return callback(null, userId);
        });
      }
    },
    function (userId, callback) {
      db.hget(`user:${userId}`, 'password', (err, userPassword) => {
        callback(null, userId, userPassword);
      });
    },
    function (userId, userPassword, callback) {
      Bcrypt.compare(payload.password, userPassword, (err, isValid) => {
        if (err) {
          return callback(err);
        }

        if (isValid) {
          const token = internals.createToken(db, userId);

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
    return reply({
      userName: payload.userName, token,
    })
      .header('Authorization', token)
      .state('token', token, cookieOpts);
  });
};

exports.confirmRoll = function confirmRoll(request, reply) {
  const roll = request.payload.rollNumber;
  const client = request.server.app.redisClient;

  if (!roll) {
    return reply(Boom.wrap(new Error('Invalid payload')));
  }

  const stud = students[roll];
  if (stud != null) {
    client.hexists('users', roll, (err, res) => {
      if (res !== 0) {
        return reply(Boom.conflict('Account already exists'));
      }
      return reply(stud).code(200);
    });
  }
  return reply(Boom.notFound('Data not found'));
};

internals.saltRounds = 10;

exports.saveUser = function (request, reply) {
  const payload = request.payload;
  const client = request.server.app.redisClient;

  Async.waterfall([
    function (callback) {
      Bcrypt.hash(payload.password, internals.saltRounds, (err, hashedPassword) => {
        if (err) {
          return callback(err);
        }
        return callback(null, hashedPassword);
      });
    },
    function (password, callback) {
      client.incr('user_id', (err, res) => {
        console.log(res);
        return callback(null, password, res);
      });
    },
    function (password, userId, callback) {
      client.hmset(`user:${userId}`, 'userName', payload.userName, 'fullName', payload.fullName, 'password', password, 'email', payload.email, (err) => {
        if (err) {
          return callback(err);
        }
        return callback(null, userId);
      });
    },
    function (userId, callback) {
      client.hset('users', payload.userName, userId, (err, res) => {
        callback(null, res);
      });
    },
  ], (err) => {
    if (err) {
      console.log(err);
      return Boom.wrap(err, 'Error registering account');
    }

    return reply({ message: 'Account creation success' });
  });
};

internals.createToken = function (redisClient, userId) {
  const token = Aguid();
  redisClient.hset('auths', token, userId);
  redisClient.hset(`user:${userId}`, 'auth', token);
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
    encoding: 'none',    // we already used JWT to encode
    isSecure: false,      // warm & fuzzy feelings
    isHttpOnly: true,    // prevent client alteration
    clearInvalid: false, // remove invalid cookies
    strictHeader: true,   // don't allow violations of RFC 6265
  };

  return cookieOptions;
};
// exports.userHandlers = require('./user');
// exports.slideHandlers = require('./slide');
