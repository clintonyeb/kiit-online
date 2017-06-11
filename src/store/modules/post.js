const state = {
  items: [],
  done: false,
};

const actions = {
};

const mutations = {
  SOCKET_POSTGET(state, payload) {
    if (payload === 'err') {
      return;
    }
    if (payload === 'done') {
      return state.done = true;
    }
    state.items.push(payload);
  },
  SOCKET_POSTMORE(state, payload) {
    if (payload === 'err') {
      return;
    }
    if (payload === 'done') {
      return state.done = true;
    }
    state.items.push(payload);
  },
};


export default {
  state,
  mutations,
  actions,
};
