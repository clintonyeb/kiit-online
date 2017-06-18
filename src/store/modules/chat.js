// import { getChats } from '../api';

const state = {
  messages: [],
  loading: false,
  done: false
};

const actions = {
  addChat(context, message) {
    const user = context.rootState.user;
    message.user = user;
    context.commit('CHATS_ADD', message);
  },
  socket_chat(context, payload) {
    context.commit('CHATS_ADD', payload);
  },
};


const mutations = {
  CHATS_ADD(state, payload) {
    state.messages.unshift(payload);
  },
  SOCKET_CHATGET(state, payload) {
    if (payload === 'err') {
      return;
    }
    if (payload === 'done') {
      return state.done = true;
    }
    state.messages.push(payload);
  },
  SOCKET_CHATMORE(state, payload) {
    if (payload === 'err') {
      return;
    }
    if (payload === 'done') {
      return state.done = true;
    }
    state.messages.push(payload);
  },
  START_LOADING(state, bool = true) {
    state.loading = bool;
  },
  SET_TIME(state, id) {
    const res = [];
    for (let i = 0; i < state.messages.length; i++) {
      const mess = state.messages[i];
      if (mess.id && mess.id === id) {
        mess.time = new Date().getTime();
      }
      res.push(mess);
    }

    state.messages = res;
  },
};


export default {
  state,
  mutations,
  actions,
};
