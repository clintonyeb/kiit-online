module.exports = function main(redisClient) {
  return function socketHandler(socket) {
    socket.emit('userStatus', "You're connected");

    socket.on('getUser', (data) => {
      redisClient.hget('auths', data.token, (err, res) => {
        if (err || res === null) {
          return socket.emit('userGet', 'err', 'authentication failed');
        }

        redisClient.hget('users', data.userName, (err, userId) => {
          redisClient.hmget(`user:${userId}`, 'userName', 'fullName', 'avatar', (err, results) => {
            const res = {
              userName: results[0],
              fullName: results[1],
              avatar: results[2],
            };
            return socket.emit('userGet', res);
          });
        });
      });
    });

    socket.on('getSlides', (data) => {

    });

    socket.on('addSlide', (data) => {
      
    });

    socket.on('addMessage', (data) => {

    });

    socket.on('addComment', (data) => {

    });
  };
};

