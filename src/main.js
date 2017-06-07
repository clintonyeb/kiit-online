import Vue from 'vue';
import Vuetify from 'vuetify';
import { sync } from 'vuex-router-sync';
import VueTimeago from 'vue-timeago';
import VueSocketIO from 'vue-socket.io';
import App from './App.vue';
import store from './store';
import router from './routes';

let token = getCookie('token');
if (!token) {
  token = localStorage.getItem('token');
}

Vue.use(VueSocketIO, `0.0.0.0:8000?token=${token}`, store);
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


const vm = new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App),
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
