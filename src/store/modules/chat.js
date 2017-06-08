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
};


export default {
  state,
  mutations,
  actions,
};

function compare(a, b) {
  if (!a.time) {
    return 1;
  }
  if (!b.time) {
    return -1;
  }
  if (a.time < b.time) {
    return -1;
  } else if (a.time > b.time) {
    return 1;
  }
  return 0;
}

function addChat(oldChats, newChats) {
  if (!Array.isArray(newChats)) {
    newChats = [newChats];
  }
  const chats = [...oldChats, ...newChats];
  return chats.sort(compare);
}


