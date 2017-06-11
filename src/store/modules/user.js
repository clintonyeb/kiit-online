const state = {
  token: '',
  userName: '',
  fullName: '',
  avatar: '',
  password: '',
  email: '',
  class: '',
  year: '',
  step: 0,
};

const getters = {
  GET_PAYLOAD() {
    return {
      userName: state.userName,
      fullName: state.fullName,
      password: state.password,
      email: state.email,
      class: state.class,
      year: state.year,
    };
  },
};

const actions = {

};

const mutations = {
  SET_REG(state, payload) {
    state.fullName = payload.fullName;
    state.class = payload.class;
    state.year = payload.year;
    state.step = 1;
  },
  SET_USER_NAME(state, userName) {
    state.userName = userName;
  },
  SET_PAYLOAD(state, payload) {
    state.name = payload.fullName;
    state.password = payload.password;
    state.email = payload.email;
    state.step = 2;
  },
  STORE_TOKEN(state, payload) {
    state.token = payload.token;
    state.userName = payload.userName;
    localStorage.setItem('token', payload.token);
  },
  SET_TOKEN(state, payload) {
    state.token = payload.token;
    state.userName = payload.userName;
  },
  SOCKET_USERGET(state, payload) {
    state.userName = payload.userName;
    state.fullName = payload.fullName;
    state.avatar = payload.avatar || '';
  },
  SOCKET_CONNECT(state) {
    // console.log('socket connected');
  },
  SOCKET_AUTH(state, payload) {
    if (payload == '401') {
      if (location.pathname != '/login') {
        location.replace('/login');
      }
    } else {
      console.log('authentication success', payload);
    }
  },
  REMOVE_TOKEN(state, payload) {
    localStorage.removeItem('token');
    document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
  },
};


export default {
  state,
  mutations,
  actions,
  getters,
};
