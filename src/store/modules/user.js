import { getUser } from '../api';

const state = {
    token: '',
    userName: '',
    fullName: '',
    avatar: '',
    registration: {
        rollNumber: '',
        name: '',
        password: '',
        email: ''
    },
    step: 0
}

const getters = {
    GET_PAYLOAD() {
        return {
            userName: state.registration.rollNumber,
            fullName: state.registration.name,
            password: state.registration.password,
            email: state.registration.email
        }
    }
}

const actions = {
    GET_USER_PROFILE({ commit }) {

    },
}

const mutations = {
    SET_NAME(state, name) {
        state.registration.name = name;
        state.step = 1;
    },
    SET_ROLL(state, roll) {
        state.registration.rollNumber = roll;
    },
    SET_PAYLOAD(state, payload) {
        state.registration.name = payload.fullName;
        state.registration.password = payload.password;
        state.registration.email = payload.email;
        state.step = 2;
    },
    STORE_TOKEN(state, payload) {
        state.token = payload.token;
        state.userName = payload.userName;
        localStorage.setItem('token', payload.token);
        localStorage.setItem('userName', payload.userName);
    },
    SET_TOKEN(state, payload) {
        state.token = payload.token;
        state.userName = payload.userName;
    },
    SOCKET_USERGET(state, payload) {
        if (payload === 'err') {
            
        }
        state.userName = payload.userName;
        state.fullName = payload.fullName;
        state.avatar = payload.avatar || '';
    },
    SOCKET_CONNECT(state) {
        console.log('socket connected');
    }
}


export default {
    state,
    mutations,
    actions,
    getters
}