import Axios from 'axios';
import Upload from '../../node_modules/socketio-file-upload/client';

function get(url, cb) {
  return Axios.get(url)
    .then(res => cb(null, res))
    .catch(err => cb(err));
}

function post(url, data, cb) {
  return Axios.post(url, data)
    .then(response => cb(null, response.data))
    .catch(err => cb(err));
}

export function authenticate(callback) {
  return get('/authenticate', callback);
}

export function validateRollNumber(userName, callback) {
  const data = { userName };
  return post('/users/confirmRoll', data, callback);
}

export function postAccountDetails(data, callback) {
  return post('/users', data, callback);
}

export function loginUser(payload, cb) {
  return post('/login', payload, cb);
}

export function Uploader(socket) {
  let uploader = new Upload(socket);

  const complete = (event) => {
    console.log('complete', event.file, event.success, event.detail);
  };

  const failed = (event) => {
    console.log('failed', event.file, event.message, event.code);
  };

  const start = (event) => {
    console.log('start', event.file);
  };

  uploader.addEventListener('start', start);
  uploader.addEventListener('progress', (event) => {
    console.log('progress', event);
  });
  uploader.addEventListener('load', (event) => {
    console.log('load', event);
  });
  uploader.addEventListener('choose', (event) => {
    console.log('load', event.files);
  });
  uploader.addEventListener('complete', complete);
  uploader.addEventListener('error', failed);

  return {
    sendFiles: (files) => {
      uploader.submitFiles(files);
    },
    destroy: () => {
      uploader.removeEventListener('complete', complete);
      uploader.removeEventListener('err', failed);
      uploader.destroy();
      uploader = null;
    },
  };
}
