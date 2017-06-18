import Axios from 'axios';

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

export function recoverPass(payload, cb) {
  return post('/recover', payload, cb);
}
