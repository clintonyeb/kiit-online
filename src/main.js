import Vue from 'vue';
import Vuetify from 'vuetify';
import { sync } from 'vuex-router-sync';
import VueTimeago from 'vue-timeago';
import socketio from 'socket.io-client';
import App from './App.vue';
import store from './store';
import router from './routes';
import VueSocketIO from './directives/socketio/';
import SocketIOFileUpload from '../node_modules/socketio-file-upload/client';
import globalMixins from './mixins/global';

let token = getCookie('token');
if (!token) {
  token = localStorage.getItem('token');
}


const origin = window.location.origin;
const socket = socketio(`${origin}?token=${token}`);

const uploader = new SocketIOFileUpload(socket);
uploader.resetFileInputs = true;
uploader.maxFileSize = 1e+7;
Vue.prototype.$uploader = uploader;

Vue.use(VueSocketIO, socket, store);
Vue.use(Vuetify);

sync(store, router);

Vue.config.devtools = true;

Vue.use(VueTimeago, {
  name: 'timeago',
  locale: 'en-US',
  locales: {
    'en-US': require('vue-timeago/locales/en-US.json'),
  },
});

Vue.directive('focus', {
  inserted(el) {
    el.focus();
  },
});

Vue.mixin(globalMixins);

const vm = new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App),
  beforeDestroy() {
    this.$uploader.destroy();
    this.$uploader = null;
  },
});

function getCookie(cname) {
  const name = `${cname}=`;
  const decodedCookie = decodeURIComponent(document.cookie);
  const ca = decodedCookie.split(';');
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return '';
}
