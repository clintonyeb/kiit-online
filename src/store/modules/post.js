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
  },
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
  ADD_FILES(state, data) {

    state.create.currStep = 3;
  },
};


export default {
  state,
  mutations,
  actions,
};
