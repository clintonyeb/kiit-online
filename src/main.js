import Vue from 'vue'
import App from './App.vue'
import Vuetify from 'vuetify';
import store from './store';
import router from './routes';
import VueSocketIO from 'vue-socket.io';

Vue.use(VueSocketIO, '0.0.0.0:8000', store);
Vue.use(Vuetify);

const vm = new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})