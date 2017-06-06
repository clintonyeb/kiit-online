import Vue from 'vue';
import App from './App.vue';
import Vuetify from 'vuetify';
import store from './store';
import router from './routes';
import VueSocketIO from 'vue-socket.io';

let token = getCookie('token');
if (!token) {
  token = localStorage.getItem('token');
}

Vue.use(VueSocketIO, `0.0.0.0:8000?token=${token}`, store);
Vue.use(Vuetify);

const vm = new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App),
});

function getCookie(cname) {
  let name = `${cname}=`;
  let decodedCookie = decodeURIComponent(document.cookie);
  let ca = decodedCookie.split(';');
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
