import Vue from 'vue';
import Vuex from 'vuex';
import user from './modules/user';
import post from './modules/post'
import chat from './modules/chat'
import layout from './modules/layout'

Vue.use(Vuex);

export default new Vuex.Store({
    modules: {
        user,
        post,
        chat,
        layout
    }
})