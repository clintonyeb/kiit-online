
const state = {
    messages: [],
}

const actions = {
    GET_COMMENTS({ commit }) {
       /* getChats((err, data) => {
            commit('COMMENTS_GET', data);
        });*/
    }
}

const mutations = {
    COMMENTS_GET(state, payload) {
        state.messages = payload;
    },
    COMMENTS_ADD(state, payload) {
        state.messages.push(payload);
    }
}


export default {
    state,
    mutations,
    actions
}