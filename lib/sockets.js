const Async = require('async');
const Uploader = require('socketio-file-upload');
const Path = require('path');

module.exports = function main(redisClient, io) {
  const socketHandler = function socketHandler(socket) {
    const uploader = new Uploader();
    uploader.dir = Path.resolve(__dirname, './uploads');
    uploader.listen(socket);

    uploader.on('error', (event) => {
      console.log(event.error);
    });

    const findUserByUserName = (userName, cb) => {
      redisClient.hmget(`user:${userName}`, 'userName', 'fullName', 'class', 'avatar', 'status', (err, results) => {
        const res = {
          userName: results[0],
          fullName: results[1],
          class: results[2],
          avatar: results[3],
          status: results[4],
          statusUpdate: results[5],
        };
        return cb(err, res);
      });
    };

    socket.on('getUser', data => findUserByUserName(data.userName, (err, res) => {
      socket.emit('userGet', err || res);
    }));

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
        if (postIds.length < 25) {
          socket.emit('postGet', 'done');
          // cb(null, 'done');
        }
        return Async.each(postIds, (id, callback) => {
          redisClient.hgetall(`post:${id}`, (err1, post) => {
            findUserByUserName(post.userName, (err2, user) => {
              redisClient.llen(`comments:${id}`, (err3, commentCnt) => {
                redisClient.smembers(`files:${id}`, (err4, files) => {
                  const res = post;
                  res.id = id;
                  res.files = files;
                  res.commentsCount = commentCnt;
                  res.user = user;
                  res.offset = data.offset;
                  if (Number(data.offset) === 0) {
                    socket.emit('postGet', res);
                  } else {
                    socket.emit('postMore', res);
                  }
                  callback(err1 || err2 || err3 || err4);
                });
              });
            });
          });
        }, errf => cb(errf, 'done'));
      });
    });

    socket.on('post', (data, cb) => {
      const time = new Date().getTime();

      Async.waterfall([
        function getPostId(callback) {
          redisClient.incr('post_id', (err, postId) => callback(err, postId));
        },
        function savePost(postId, callback) {
          redisClient.hmset(`post:${postId}`, 'userName', data.userName, 'title', data.title,
            'content', data.content, 'time', time, 'type', data.type, 'date', data.date, err => callback(err, postId));
        },
        function saveDocuments(postId, callback) {
          if (data.files.length > 0) {
            redisClient.sadd(`files:${postId}`, ...data.files, err =>
              callback(err, postId));
          }
        },
        function getUser(postId, callback) {
          findUserByUserName(data.userName, (err1, user) => callback(err1, postId, user));
        },
        function addToClass(postId, user, callback) {
          redisClient.lpush(`classes:${user.class}`, postId, err => callback(err, postId, user));
        },
        function addToType(postId, user, callback) {
          redisClient.lpush(`type:${data.type}`, postId, err => callback(err, user));
        },
      ], (err, user) => {
        if (err) {
          return cb(err);
        }
        const results = data;
        results.user = user;
        results.time = time;
        socket.to(user.class).emit('post', results);
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
          redisClient.hmget(`user:${data.userName}`, 'userName', 'fullName', 'class', 'avatar', 'status', (err, results) => {
            user.userName = results[0];
            user.fullName = results[1];
            user.class = results[2];
            user.avatar = results[3];
            user.status = results[4];
            return callback(err, chatId, user.class);
          });
        },
        function addToClass(chatId, userClass, callback) {
          redisClient.lpush(`chats:${userClass}`, chatId, err => callback(err, userClass));
        },
      ], (_, userClass) => {
        const results = data;
        results.user = user;
        results.time = time;
        socket.to(userClass).emit('chat', results);
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
        if (chatIds.length < 25) {
          socket.emit('chatGet', 'done');
          callback(null, 'done');
        }

        return Async.each(chatIds, (id, cb) => {
          redisClient.hgetall(`chat:${id}`, (err, chat) => {
            redisClient.hmget(`user:${chat.userName}`, 'userName', 'fullName', 'class', 'avatar',
              'status', 'statusUpdate', (err, docs) => {
                const res = chat;
                res.id = id;
                const user = {
                  userName: docs[0],
                  fullName: docs[1],
                  class: docs[2],
                  avatar: docs[3],
                  status: docs[4],
                  statusUpdate: docs[5],
                };
                res.user = user;
                res.offset = data.offset;
                if (Number(data.offset) === 0) {
                  socket.emit('chatGet', res);
                } else {
                  socket.emit('chatMore', res);
                }
                cb();
              });
          });
        }, err => callback(err, 'done'));
      });
    });

    socket.on('comment', (data, callback) => {
      const time = new Date().getTime();

      Async.waterfall([
        (cb) => {
          redisClient.incr('comment_id', (err, id) => {
            redisClient.hmset(`comment:${id}`, 'userName',
              data.userName, 'postId', data.postId, 'content', data.content, 'time', time,
              err => cb(err, id));
          });
        },
        (commentId, cb) => {
          redisClient.lpush(`comments:${data.postId}`, commentId, (err, res) => cb(err, res));
        },
      ], (err, res) => {
        findUserByUserName(data.userName, (err, user) => {
          const response = data;
          response.user = user;
          response.time = time;
          socket.to(data.class).emit('comment', response);
          callback(err, res);
        });
      });
    });

    socket.on('getComments', (data, callback) => {
      Async.waterfall([
        (cb) => {
          redisClient.lrange(`comments:${data.postId}`, 0, 25, (err, commentIds) => cb(err, commentIds));
        },
      ], (err, commentIds) => {
        Async.each(commentIds, (id, cb) => {
          redisClient.hgetall(`comment:${id}`, (err, comment) => {
            findUserByUserName(comment.userName, (err, user) => {
              const res = comment;
              res.user = user;
              res.postId = data.postId;
              socket.emit('commentGet', res);
              cb(err);
            });
          });
        }, err => {
          callback(err, 'done');
        });
      });
    });

    socket.on('status', (data, callback) => {
      const time = new Date().getTime();
      Async.waterfall([
        (cb) => {
          redisClient.hmset(`user:${data.userName}`, 'status', data.status, 'statusUpdate', time, (err, res) => cb(err, res));
        },
      ], (err, res) => {
        data.time = time;
        socket.emit('status', data);
        return callback(err, res);
      });
    });
  };

  return socketHandler;
};

