import { getSlides } from '../api';

/* let slide: {
    document: String,
    content: String,
    preview: String,
    user: {
        id: String,
        name: String,
        roll: String
    },
    dateCreated: Date,
    comments: [{
        userId: String,
        userName: String,
        content: String,
        dateCreated: Date
    }]
}*/

const state = {
  items: [],
};

const actions = {
  /*GET_SLIDES({ commit }) {
    getSlides((err, data) => {
      console.log(data);
      if (err || !data) return;
      commit('SLIDES_GET', data);
    });
  },*/
};

const mutations = {
  SOCKET_SLIDESGET(state, payload) {
    state.items = payload;
  },
  SOCKET_SLIDEGET(state, post) {
    state.items.push(post);
  },
};


export default {
  state,
  mutations,
  actions,
};
