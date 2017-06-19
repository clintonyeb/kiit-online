const state = {
  items: [],
  done: false,
};

const getters = {
  getPostById: state => (id) => {
    if (id) {
      for (let i = 0; i < state.items.length; i++) {
        if (state.items[i].id == id) {
          return state.items[i];
        }
      }
    } else {
      return {
        title: '',
        user: {
          fullName: '',
        },
        content: '',
        files: [],
      };
    }
  },
  getCommentsById: state => (postId) => {
    if (!postId) return [];
    let post = state.items.find(post => post.id === postId);
    return post.comments;
  },
};

const actions = {
  addComment(context, message) {
    const user = context.rootState.user;
    message.user = user;
    message.local = true;
    context.commit('ADD_COMMENT', message);
  },
  socket_post(context, payload) {
    context.commit('SOCKET_POSTMORE', payload);
  },
  socket_commentGet(context, payload) {
    payload.local = false;
    context.commit('ADD_COMMENT', payload);
  },
};

const mutations = {
  SOCKET_POSTGET(state, payload) {
    if (payload === 'err') {
      return;
    }
    if (payload === 'done') {
      state.done = true;
      return;
    }
    payload.comments = [];
    state.items.push(payload);
  },
  SOCKET_POSTMORE(state, payload) {
    if (payload === 'err') {
      return;
    }
    if (payload === 'done') {
      return state.done = true;
    }
    payload.comments = [];
    state.items.unshift(payload);
  },
  POST_FINISHED(state) {
    state.done = true;
  },
  ADD_COMMENT(state, payload) {
    const postId = payload.postId;
    let post = state.items.find(post => post.id === postId);
    let comments = post.comments;
    comments = payload.local ? comments.push(payload) : comments.unshift(payload);
  },
  SOCKET_COMMENT(state, payload) {
    const postId = payload.postId;
    let post = state.items.find(post => post.id === postId);
    post.commentsCount += 1;

    const comments = post.comments;
    comments.push(payload);
  },
  SET_POST_TIME(state, payload) {
    const postId = payload.postId;    
    let post = state.items.find(post => post.id === postId);
    post.commentsCount += 1;

    let comments = post.comments;

    for (let i = comments.length - 1; i >= 0; i -= 1) {
      const comm = comments[i];
      if (comm.id && comm.id === payload.id) {
        comm.time = new Date().getTime();
        break;
      }
    }
  },
};


export default {
  state,
  getters,
  mutations,
  actions,
};
