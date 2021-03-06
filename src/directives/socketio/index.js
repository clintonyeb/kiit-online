import Observer from './observer';
import Emitter from './emitter';

export default {

  install(Vue, connection, store) {
    if (!connection) throw new Error('[Vue-Socket.io] cannot locate connection');

    const observer = new Observer(connection, store);

    Vue.prototype.$socket = observer.Socket;

    Vue.mixin({
      created() {
        const sockets = this.$options.sockets;

        this.$options.sockets = new Proxy({}, {
          set: (target, key, value) => {
            Emitter.addListener(key, value, this);
            target[key] = value;
            return true;
          },
          deleteProperty: (target, key) => {
            Emitter.removeListener(key, this.$options.sockets[key], this);
            delete target.key;
            return true;
          },
        });

        if (sockets) {
          Object.keys(sockets).forEach((key) => {
            this.$options.sockets[key] = sockets[key];
          });
        }
      },
      beforeDestroy() {
        const sockets = this.$options.sockets;

        if (sockets) {
          Object.keys(sockets).forEach((key) => {
            delete this.$options.sockets[key];
          });
        }
      },
    });
  },

};

