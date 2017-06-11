const Async = require('async');
const Uploader = require('socketio-file-upload');
const Path = require('path');

module.exports = function main(redisClient, io) {
  const internals = {};

  const socketHandler = function socketHandler(socket) {
    const uploader = new Uploader();
    uploader.dir = Path.resolve(__dirname, '../uploads');
    uploader.listen(socket);

    uploader.on('saved', (event) => {
      console.log('complete');
    });

    uploader.on('error', (event) => {
      console.log('error');
    });

    uploader.on('start', (event) => {
      console.log('start', event);
    });

    uploader.on('progress', (event) => {
      console.log('progress', event);
    });

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

    socket.on('getPosts', (data, cb) => {
      Async.waterfall([
        function getUserClass(callback) {
          redisClient.hget(`user:${data.userName}`, 'class', (err, userClass) => callback(err, userClass));
        },
        function getIds(userClass, callback) {
          redisClient.lrange(`classes:${userClass}`, data.offset, data.offset + 25, (err, postIds) => callback(err, postIds));
        },
      ], (err, postIds) => {
        if (err) {
          socket.emit('postGet', 'err');
          return cb(err);
        }
        if (postIds.length < 1) {
          socket.emit('postGet', 'done');
          return cb(null, 'done');
        }

        Async.each(postIds, (id, callback) => {
          redisClient.hgetall(`post:${id}`, (err, post) => {
            redisClient.hmget(`user:${post.userName}`, 'userName', 'fullName', 'class', 'avatar',
              (err, docs) => {
                const res = post;
                res.id = id;
                const user = {
                  userName: docs[0],
                  fullName: docs[1],
                  class: docs[2],
                  avatar: docs[3],
                };
                res.user = user;
                res.offset = data.offset;
                if (data.offset == 0) {
                  socket.emit('postGet', res);
                } else {
                  socket.emit('postMore', res);
                }
                callback();
              });
          });
        }, err => cb(err, 'done'));
      });
    });

    socket.on('post', (data, cb) => {
      const time = new Date().getTime();

      Async.waterfall([
        function getUserClass(callback) {
          redisClient.hget(`user:${data.userName}`, 'class', (err, userClass) =>
            callback(err, userClass));
        },
        function getPostId(userClass, callback) {
          redisClient.incr('post_id', (err, postId) => callback(err, userClass, postId));
        },
        function savePost(userClass, postId, callback) {
          redisClient.hmset(`post:${postId}`, 'userName', data.userName, 'title', data.title,
            'content', data.content, 'time', time, 'type', data.type, 'date', data.date, err => callback(err, userClass, postId));
        },
        function saveDocuments(userClass, postId, callback) {
          if (data.files.length > 0) {
            redisClient.sadd(`files:${postId}`, ...data.files, err =>
              callback(err, userClass, postId));
          }
          callback(null, userClass, postId);
        },
        function addToClass(userClass, postId, callback) {
          redisClient.lpush(`classes:${userClass}`, postId, err => callback(err, postId));
        },
        function addToType(postId, callback) {
          redisClient.lpush(`type:${data.type}`, postId, err => callback(err));
        },
      ], (err) => {
        if (err) {
          return cb(err);
        }
        return cb(null, 'done');
      });
    });

    socket.on('chat', (data) => {
      const time = new Date().getTime();
      const user = {};

      Async.waterfall([
        function getChatId(callback) {
          redisClient.incr('chat_id', (err, chatId) => callback(err, chatId));
        },
        function saveChat(chatId, callback) {
          redisClient.hmset(`chat:${chatId}`, 'content', data.content, 'userName', data.userName, 'time', time, err => callback(err, chatId));
        },
        function getUserClass(chatId, callback) {
          redisClient.hmget(`user:${data.userName}`, 'userName', 'fullName', 'class', 'avatar', (err, results) => {
            user.userName = results[0];
            user.fullName = results[1];
            user.class = results[2];
            user.avatar = results[3];
            return callback(err, chatId, user.class);
          });
        },
        function addToClass(chatId, userClass, callback) {
          redisClient.lpush(`chats:${userClass}`, chatId, (err, res) => callback(err, userClass));
        },
      ], (_, userClass) => {
        data.user = user;
        data.time = time;
        io.to(userClass).emit('chat', data);
      });
    });

    socket.on('getChats', (data, callback) => {
      Async.waterfall([
        function getUserClass(callback) {
          redisClient.hget(`user:${data.userName}`, 'class', (err, userClass) => callback(err, userClass));
        },
        function getClassChats(userClass, callback) {
          redisClient.lrange(`chats:${userClass}`, data.offset, data.offset + 25, (err, chatIds) => callback(err, chatIds));
        },

      ], (err, chatIds) => {
        if (err) {
          socket.emit('chatGet', 'err');
          return callback(null, 'err');
        }
        if (chatIds.length < 1) {
          socket.emit('chatGet', 'done');
          return callback(null, 'done');
        }

        Async.each(chatIds, (id, cb) => {
          redisClient.hgetall(`chat:${id}`, (err, chat) => {
            redisClient.hmget(`user:${chat.userName}`, 'userName', 'fullName', 'class', 'avatar', (err, docs) => {
              const res = chat;
              res.id = id;
              const user = {
                userName: docs[0],
                fullName: docs[1],
                class: docs[2],
                avatar: docs[3],
              };
              res.user = user;
              res.offset = data.offset;
              if (data.offset == 0) {
                socket.emit('chatGet', res);
              } else {
                socket.emit('chatMore', res);
              }
              cb();
            });
          });
        }, (err) => callback(null, 'done'));
      });
    });

    socket.on('comment', (data, callback) => {

    });

    socket.on('getComments', (data, callback) => {

    });

    socket.on('profile', (data, callback) => {

    });

    socket.on('setting', (data, callback) => {

    });
  };

  return socketHandler;
};

