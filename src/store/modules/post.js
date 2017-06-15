const state = {
  items: [],
  done: false,
  comment: {},
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
    const comment = state.comment;

    if (typeof (comment[postId]) === 'undefined') {
      comment[postId] = {};
      comment[postId].items = [];
    }

    return comment[postId].items;
  },
};

const actions = {
  addComment(context, message) {
    const user = context.rootState.user;
    message.user = user;
    context.commit('ADD_COMMENT', message);
  },
  socket_post(context, payload) {
    context.commit('SOCKET_POSTMORE', payload);
  },
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
    state.items.unshift(payload);
  },
  POST_FINISHED(state) {
    state.done = true;
  },
  ADD_COMMENT(state, payload) {
    const comment = state.comment;
    const postId = payload.postId;

    if (typeof comment[postId] === 'undefined') {
      comment[postId] = {};
      comment[postId].items = [];
    }
    comment[postId].items.push(payload);
  },
  SOCKET_COMMENTGET(state, payload) {
    const comment = state.comment;
    const postId = payload.postId;

    if (typeof (comment[postId]) === 'undefined') {
      comment[postId] = {};
      comment[postId].items = [];
    }
    comment[postId].items.unshift(payload);
  },
  SOCKET_COMMENT(state, payload) {
    const post = state.items.filter(item => item.id === payload.postId);
    if (post.length < 1) {
      return;
    }

    const p = post[0];
    p.commentsCount += 1;

    const postId = payload.postId;
    const comment = state.comment;
    if (typeof (comment[postId]) !== 'undefined') {
      comment[postId].items.push(payload);
    }
  },
};


export default {
  state,
  getters,
  mutations,
  actions,
};
