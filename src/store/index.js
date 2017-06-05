import Vue from 'vue';
import Vuex from 'vuex';
import user from './modules/user';
import slide from './modules/slide'
import chat from './modules/chat'
import comment from './modules/comment'
import layout from './modules/layout'

Vue.use(Vuex);

export default new Vuex.Store({
    modules: {
        user,
        slide,
        chat,
        comment,
        layout
    }
})