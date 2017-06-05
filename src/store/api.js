import axios from 'axios';

export function getUser(callback) {
    const url = '/users'
}

export function getSlides(callback) {
    let url = '/slides';
    axios.get(url)
        .then(response => callback(null, response.data))
        .catch(err => callback(err))
}

export function uploadFiles(files, callback) {
    const access_token = 'iDcopksrBPAAAAAAAAABE3N0I6eLXhaRI_l_Oh_LWxjZ7lHYhW2ieQCA1YaWKhgo'
    const dbx = new Dropbox({
        accessToken: access_token
    });

    let res = [];
    files.forEach(function (_, index) {
        res[index] = -1;
    }, this);
    let promises = [];

    files.forEach(function (file, index) {
        let name = new Date().getTime() + '-' + file.name;
        dbx.filesUpload({ path: "/" + name, contents: file })
            .then((response) => {
                callback(null, index, name);
            })
            .catch((err) => {
                callback(err, index);
            })
    }, this);

}

export function sendSlide(data, callback) {
    let url = '/slides';
    console.log('payload', data);
}


export function getChats(callback) {
    let chats = [];
    return callback(null, chats);

}

export function authenticate(callback) {
    return get('/authenticate', callback);
}

export function validateRollNumber(roll, callback) {
    let data = {
        rollNumber: roll
    }
    return post('/users/confirmRoll', data, callback);
}

export function postAccountDetails(data, callback) {
    return post('/users', data, callback);
}

export function loginUser(payload, cb) {
    return post('/login', payload, cb);
}

function post(url, data, cb) {
    return axios.post(url, data)
        .then(response => cb(null, response.data))
        .catch(err => cb(err))
}

function get(url, cb) {
    return axios.get(url)
        .then(res => {
            return cb(null);
        })
        .catch(err => {
            return cb(err);
        })
}