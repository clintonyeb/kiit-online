// import { getChats } from '../api';

const state = {
  messages: [],
  loading: false,
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
    state.messages = addChat(state.messages, payload);
  },
  SOCKET_CHATGET(state, payload) {
    setTimeout(() => {
      state.loading = false;
    }, 2000);

    if (payload === 'err') {
      return;
    }
    if (payload === 'done') {
      return;
    }
    state.messages = addChat(state.messages, payload);
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


