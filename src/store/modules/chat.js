// import { getChats } from '../api';

const state = {
  messages: [],
  tick: 1,
  id: '',
};

const actions = {
  addChat(context, message) {
    const user = context.rootState.user;
    message.user = user;
    context.commit('CHATS_ADD', message);
  },
};

const mutations = {
  CHATS_GET(state, payload) {
    state.messages = payload;
  },
  CHATS_ADD(state, payload) {
    state.messages = addChat(state.messages, payload);
  },
  TICK(state) {
    if (state.tick > 1000) {
      state.tick = 1;
    }
    state.tick++;
  },
  SOCKET_CHATGET(state, payload) {
    state.messages = addChat(state.messages, payload);
  },
};


export default {
  state,
  mutations,
  actions,
};

function compare(a, b) {
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


