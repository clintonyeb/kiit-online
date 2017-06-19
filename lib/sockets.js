const Async = require('async');
const Uploader = require('socketio-file-upload');
const Path = require('path');
const Sharp = require('sharp');
const Fs = require('fs');
const Bcrypt = require('bcrypt');

module.exports = function main(redisClient, io) {
  const socketHandler = function socketHandler(socket) {
    const uploader = new Uploader();
    uploader.dir = Path.resolve(__dirname, './uploads');
    uploader.listen(socket);

    uploader.on('error', (event) => {
      console.log(event.error);
    });

    const findUserByUserName = (userName, cb) => {
      redisClient.hmget(`user:${userName}`, 'userName', 'fullName', 'class', 'avatar', 'status', 'email', (err, results) => {
        const res = {
          userName: results[0],
          fullName: results[1],
          class: results[2],
          avatar: results[3],
          status: results[4],
          email: results[5],
        };
        return cb(err, res);
      });
    };

    function hashPassword(password, callback) {
      Bcrypt.hash(password, 10, (err, hashedPassword) => {
        if (err) {
          return callback(err);
        }
        return callback(null, hashedPassword);
      });
    }

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
          redisClient.lpush(`type:${data.type}`, postId, err => callback(err, postId, user));
        },
      ], (err, postId, user) => {
        if (err) {
          return cb(err);
        }
        const results = data;
        results.user = user;
        results.time = time;
        results.id = postId;
        socket.to(user.class).emit('post', results);
        return cb(null, results);
      });
    });

    socket.on('chat', (data, cb) => {
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
        return cb(null, data.id);
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
          callback(err, {
            postId: data.postId,
            id: data.id,
          });
        });
      });
    });

    socket.on('getComments', (data, callback) => {
      console.log('requested');
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
        }, (err) => {
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

    socket.on('avatar', (data, callback) => {
      const time = new Date().getTime();
      const props = data.props;

      Async.waterfall([
        (cb) => {
          const path = Path.resolve(__dirname, `./uploads/${data.avatar}`);
          const des = Path.resolve(__dirname, `./assets/avatars/${data.avatar}`);
          Sharp(path)
            .extract({
              left: Math.round(props.x) > 0 ? Math.round(props.x) : 0,
              top: Math.round(props.y) > 0 ? Math.round(props.y) : 0,
              width: Math.round(props.width) > 0 ? Math.round(props.width) : 0,
              height: Math.round(props.height) > 0 ? Math.round(props.height) : 0,
            })
            .resize(75, 75)
            .crop(Sharp.strategy.entropy)
            .toFile(des)
            .then(d => cb(null, d))
            .catch(err => cb(err));
        },
        (d, cb) => {
          redisClient.hset(`user:${data.userName}`, 'avatar', `${data.avatar}`, (err, res) => cb(err, res));
        },
        (res, cb) => {
          const path = Path.resolve(__dirname, `./uploads/${data.avatar}`);
          const des = Path.resolve(__dirname, `./assets/dp/${data.avatar}`);
          Sharp(path)
            .extract({
              left: Math.round(props.x) > 0 ? Math.round(props.x) : 0,
              top: Math.round(props.y) > 0 ? Math.round(props.y) : 0,
              width: Math.round(props.width) > 0 ? Math.round(props.width) : 0,
              height: Math.round(props.height) > 0 ? Math.round(props.height) : 0,
            })
            .resize(150, 150)
            .crop(Sharp.strategy.entropy)
            .toFile(des)
            .then(d => Fs.unlink(path, err => cb(err, d)))
            .catch(err => cb(err));
        },
        (d, cb) => {
          redisClient.hset(`settings:${data.userName}`, 'display', `${data.avatar}`, (err, res) => cb(err, res));
        },
      ], (err, res) => {
        callback(err, res);
      });
    });

    socket.on('getProfile', (data, callback) => {
      findUserByUserName(data.userName, (err, res) => {
        callback(err, res);
      });
    });

    socket.on('settings', (data, callback) => {
      console.log(data);
      Async.waterfall([
        (cb) => {
          if (data.type === 'email') {
            redisClient.hset(`user:${data.userName}`, 'email', data.data, (err, res) => {
              findUserByUserName(data.userName, (err, res) => {
                callback(err, res);
                return cb(err, res);
              });
            });
          } else if (data.type === 'password') {
            redisClient.hget(`user:${data.userName}`, 'password', (err, pass) => {
              Bcrypt.compare(data.data, pass, (err, isValid) => {
                if (isValid) {
                  redisClient.hset(`user:${data.userName}`, 'password', data.data, (err, res) => {
                    findUserByUserName(data.userName, (err, res) => {
                      callback(err, res);
                      cb(err, res);
                    });
                  });
                } else return cb(new Error('could not authenticate user'));
              });
            });
          } else {
            redisClient.hset(`settings:${data.userName}`, data.type, data.value, (err, res) => {
              callback(err, data);
              cb(err, res);
            });
          }
        },
      ], (err, res) => {
        if (err) {
          return callback(err);
        }
      });
    });

    socket.on('getSettings', (data, callback) => {
      redisClient.hgetall(`settings:${data.userName}`, (err, docs) => {
        findUserByUserName(data.userName, (err, user) => {
          docs = docs || {};
          docs.user = user;
          callback(err, docs);
        });
      });
    });
  };

  return socketHandler;
};
