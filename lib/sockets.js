const Async = require('async');

module.exports = exports = function (redisClient) {
    const internals = {};

    return socketHandler = function (socket) {
        socket.emit('userStatus', "You're connected");

        socket.on('getUser', (data) => {

            redisClient.hget(`auths`, data.token, (err, res) => {
                if (err || res === null) {
                    return socket.emit('userGet', 'err', 'authentication failed');
                }

                redisClient.hget(`users`, data.userName, (err, userId) => {
                    redisClient.hmget(`user:${userId}`, 'userName', 'fullName', 'avatar', (err, results) => {
                        let res = {
                            userName: results[0],
                            fullName: results[1],
                            avatar: results[2]
                        }
                        socket.emit('userGet', res);
                    })
                })
            })
        })

        socket.on('getSlides', (data) => {

        })

        socket.on('addSlide', (data) => {

        })

        socket.on('addMessage', (data) => {

        })

        socket.on('addComment', (data) => {

        })
    }

    internals.authenticate = function () {

    }
}




