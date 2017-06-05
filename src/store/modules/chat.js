// import { getChats } from '../api';

const state = {
  messages: [],
  tick: 1,
  id: '',
};

const actions = {
  addChat(context, message) {
    let user = context.rootState.user;
    message.user = user;
    context.commit('CHATS_ADD', message);
  },
};

const mutations = {
  CHATS_GET(state, payload) {
    state.messages = payload;
  },
  CHATS_ADD(state, payload) {
    state.messages.push(payload);
  },
  TICK(state) {
    if (state.tick > 1000) {
      state.tick = 1;
    }
    state.tick++;
  },
  SOCKET_CHATGET(state, payload) {
    state.messages.push(payload);
  }
};


export default {
  state,
  mutations,
  actions,
};
