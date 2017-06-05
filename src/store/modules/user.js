const state = {
  token: '',
  userName: '',
  fullName: '',
  avatar: '',
  registration: {
    rollNumber: '',
    name: '',
    password: '',
    email: '',
    class: '',
    year: '',
  },
  step: 0,
};

const getters = {
  GET_PAYLOAD() {
    return {
      userName: state.registration.rollNumber,
      fullName: state.registration.name,
      password: state.registration.password,
      email: state.registration.email,
      class: state.registration.class,
      year: state.registration.year,
    };
  },
};

const actions = {

};

const mutations = {
  SET_REG(state, payload) {
    state.registration.name = payload.fullName;
    state.registration.class = payload.class;
    state.registration.year = payload.year;
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
      console.log('authentication error');
      console.log(location.pathname);
      if (location.pathname != '/login') {
        location.replace('/login');
      }
    }
    state.userName = payload.userName;
    state.fullName = payload.fullName;
    state.avatar = payload.avatar || '';
  },
  SOCKET_CONNECT(state) {
    console.log('socket connected');
  },
};


export default {
  state,
  mutations,
  actions,
  getters,
};
