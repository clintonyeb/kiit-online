const Hapi = require("hapi");
const Path = require('path');
const env = require('env2')('.env');
const redis = require('redis'),
    redisClient = redis.createClient();
const routes = require('./routes');
const sockets = require('./sockets');

const server = new Hapi.Server();
module.exports = exports = server;

server.connection({
    host: "0.0.0.0",
    port: +process.env.PORT
});

// test redis is connected
redisClient.set('redis$', 'working');
redisClient.get('redis$', function (err, res) {
    if (err) {
        throw new Error('could not connect to reddis');
    }
    console.log('redis is ' + res.toString());
});

server.app.redisClient = redisClient;

// socket-io setup
const io = require('socket.io')(server.listener);

let socketHandler = sockets(redisClient);
io.on('connection', (socket) => {
    socketHandler(socket);
})

// server plugins
server.register([
    {
        register: require("inert")
    },
    {
        register: require('./scheme')
    },
    {
        register: require("good"),
        options: {
            reporters: {
                console: [
                    {
                        module: "good-squeeze",
                        name: "Squeeze",
                        args: [
                            {
                                response: "*",
                                log: "*"
                            }
                        ]
                    },
                    {
                        module: "good-console"
                    },
                    "stdout"
                ]
            }
        }
    },
], err => {
    if (err) throw err;

    server.auth.strategy('simple', 'simple');
    routes.init(server);

    server.start(err => {
        if (err) throw err;
        console.log("info", "Server running at: " + server.info.uri);
    });
});

function buildVue(callback) {
    const webpack = require('webpack');
    webpack(require('../webpack.config.js'), (err, stats) => {
        if (err) {
            return callback(err);
        }
        stats = stats.toJson();

        stats.assets.map((asset) => {
            let path = `/dist/${asset.name}`;
            server.route({
                method: 'GET',
                path: path,
                handler: {
                    file: Path.resolve(__dirname, `../dist/` + asset.name)
                }
            })
        })

        return (callback(null, true));
    })
}
