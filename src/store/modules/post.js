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
  create: {
    currStep: 0,
    type: '',
    title: '',
    date: null,
    files: [],
    content: '',
    group: '',
  }
};

const actions = {
};

const mutations = {
  SET_TYPE(state, type) {
    state.create.type = type;
    state.create.currStep = 1;
  },
  SET_CONTENT(state, data) {
    state.create.title = data.title;
    state.create.content = data.content || '';
    state.create.date = data.date;
    state.create.group = data.group;
    state.create.currStep = 2;
  },
};


export default {
  state,
  mutations,
  actions,
};
