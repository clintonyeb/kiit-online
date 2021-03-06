const Hapi = require('hapi');
const Path = require('path');
const env = require('env2')('.env');
const redis = require('redis');
const routes = require('./routes');
const sockets = require('./sockets');

const redisClient = redis.createClient();

const server = new Hapi.Server();
module.exports = server;

server.connection({
  host: '0.0.0.0',
  port: +process.env.PORT,
});

// test redis is connected
redisClient.set('redis$', 'working');
redisClient.get('redis$', (err, res) => {
  if (err) {
    throw new Error('could not connect to reddis');
  }
  console.log(`redis is ${res.toString()}`);
});

server.app.redisClient = redisClient;

// socket-io setup
const io = require('socket.io')(server.listener);

io.use((socket, next) => {
  const token = socket.handshake.query.token;
  if (!token) {
    return next(new Error('not authorized'));
  }

  redisClient.hget('auths', token, (err, userName) => {
    if (err || userName === null) {
      socket.emit('auth', 401);
      return next(new Error('not authorized'));
    }

    // socket.emit('userStatus', "You're connected");
    redisClient.hmget(`user:${userName}`, 'userName', 'fullName', 'class', 'avatar', 'status',
      'statusUpdate', 'email', (_, results) => {
        const res = {
          userName: results[0],
          fullName: results[1],
          class: results[2],
          avatar: results[3],
          status: results[4],
          statusUpdate: results[5],
          email: results[6],
        };
        socket.join(res.class);
        return socket.emit('userGet', res);
      });
    return next();
  });
});

const socketHandler = sockets(redisClient, io);
io.on('connection', (socket) => {
  socketHandler(socket);
});

// server plugins
server.register([
  {
    register: require('inert'),
  },
  {
    register: require('good'),
    options: {
      reporters: {
        console: [
          {
            module: 'good-squeeze',
            name: 'Squeeze',
            args: [
              {
                response: '*',
                log: '*',
              },
            ],
          },
          {
            module: 'good-console',
          },
          'stdout',
        ],
      },
    },
  },
], (err) => {
  if (err) throw err;

  routes.init(server);

  server.start((err) => {
    if (err) throw err;
    console.log('info', `Server running at: ${server.info.uri}`);
  });
});
