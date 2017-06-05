// import { getChats } from '../api';

const state = {
    messages: [],
    tick: 1
}

const actions = {
    GET_CHATS({ commit }) {
        /*getChats((err, data) => {
            commit('CHATS_GET', data);
        });*/
    }
}

const mutations = {
    CHATS_GET(state, payload) {
        state.messages = payload;
    },
    CHATS_ADD(state, payload) {
        state.messages.push(payload);
    },
    TICK(state) {
        if (state.tick > 1000) {
            state.tick = 1
        }
        state.tick++;
    }
}


export default {
    state,
    mutations,
    actions
}