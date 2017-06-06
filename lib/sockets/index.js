const Async = require('async');


module.exports = function main(redisClient) {
  const internals = {};

  const socketHandler = function socketHandler(socket) {
    socket.emit('userStatus', "You're connected");

    socket.on('getUser', (data) => {
      redisClient.hmget(`user:${data.userName}`, 'userName', 'fullName', 'avatar', (err, results) => {
        const res = {
          userName: results[0],
          fullName: results[1],
          avatar: results[2],
        };
        return socket.emit('userGet', res);
      });
    });

    socket.on('getSlides', (data) => {
      Async.waterfall([
        function getUserClass(callback) {
          redisClient.hget(`user:${data.userName}`, 'class', (err, userClass) => callback(err, userClass));
        },
        function getIds(userClass, callback) {
          redisClient.lrange(`classes:${userClass}`, 0, 10, (err, postIds) => callback(err, postIds));
        },
      ], (err, postIds) => {
        if (err) {
          return socket.emit('slidesGet', 'err');
        }
        return postIds.map(id => redisClient.hgetall(`post:${id}`, (err, post) => {
          const res = post;
          res.id = id;
          return socket.emit('slideGet', res);
        }));
      });
    });

    socket.on('addSlide', (data) => {
      const time = new Date().getTime();

      Async.waterfall([
        function getUserClass(callback) {
          redisClient.hget(`user:${data.userName}`, 'class', (err, userClass) => callback(err, userClass));
        },
        function getPostId(userClass, callback) {
          redisClient.incr('post_id', (err, postId) => callback(err, userClass, postId));
        },
        function savePost(userClass, postId, callback) {
          redisClient.hmset(`post:${postId}`, 'userName', data.userName, 'title', data.title, 'content', data.content, 'time', time, err => callback(err, userClass, postId));
        },
        function saveDocuments(userClass, postId, callback) {
          redisClient.sadd(`documents:${postId}`, ...data.documents, err => callback(err, userClass, postId));
        },
        function addToClass(userClass, postId, callback) {
          redisClient.lpush(`classes:${userClass}`, postId, (err, res) => callback(err, res));
        },
      ], (err, res) => {
        if (err) {
          return socket.emit('slideAdd', 'err');
        }
        return socket.emit('slideAdd', 'done');
      });
    });

    socket.on('chat', (data) => {
      const time = new Date().getTime();

      Async.waterfall([
        function getChatId(callback) {
          redisClient.incr('chat_id', (err, chatId) => callback(err, chatId));
        },
        function saveChat(chatId, callback) {
          redisClient.hmset(`chat:${chatId}`, 'content', data.content, 'userName', data.userName, 'time', time, err => callback(err, chatId));
        },
        function getUserClass(chatId, callback) {
          redisClient.hget(`user:${data.userName}`, 'class', (err, userClass) => callback(err, chatId, userClass));
        },
        function addToClass(chatId, userClass, callback) {
          redisClient.lpush(`chats:${userClass}`, chatId, (err, res) => callback(err, res));
        },
      ]);
    });

    socket.on('getChats', (data) => {
      Async.waterfall([
        function getUserClass(callback) {
          redisClient.hget(`user:${data.userName}`, 'class', (err, userClass) => callback(err, userClass));
        },
        function getClassChats(userClass, callback) {
          redisClient.lrange(`chats:${userClass}`, 0, 10, (err, chatIds) => callback(err, chatIds));
        },

      ], (err, chatIds) => {
        if (err) {
          return socket.emit('chatsGet', 'err');
        }
        return (chatIds.reverse()).map(id => redisClient.hgetall(`chat:${id}`, (err, chat) => {
          redisClient.hmget(`user:${data.userName}`, 'userName', 'fullName', 'class', 'avatar', (err, docs) => {
            const res = chat;
            res.id = id;
            const user = {
              userName: docs[0],
              fullName: docs[1],
              class: docs[2],
              avatar: docs[3],
            };
            res.user = user;
            return socket.emit('chatGet', res);
          });
        }));
      });
    });
  };

  internals.broadCastMessage = function broadCastMessage(event, data) {
    switch (event) {
      case 'chat':

        break;

      default:
        break;
    }
  };

  return socketHandler;
};

