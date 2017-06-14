import Emitter from './emitter';
import Socket from 'socket.io-client';

export default class {

  constructor(connection, store) {
    if (typeof connection === 'string') {
      this.Socket = Socket(connection);
    } else {
      this.Socket = connection;
    }

    if (store) this.store = store;

    this.onEvent();
  }

  onEvent() {
    const onevent = this.Socket.onevent;
    this.Socket.onevent = (packet) => {
      Emitter.emit(packet.data[0], packet.data[1]);

      onevent.call(this.Socket, packet);

      if (this.store) this.passToStore(packet.data[0], packet.data[1]);
    };

    const _this = this;

    ['connect', 'error', 'disconnect', 'reconnect', 'reconnect_attempt', 'reconnecting', 'reconnect_error', 'reconnect_failed', 'connect_error', 'connect_timeout', 'connecting', 'ping', 'pong']
      .forEach((value) => {
        _this.Socket.on(value, (data) => {
          Emitter.emit(value, data);
          if (_this.store) _this.passToStore(value, data);
        });
      });
  }


  passToStore(event, payload) {
    this.passToMutation(event, payload);
    this.passToAction(event, payload);
  }

  passToMutation(event, payload) {
    for (const namespaced in this.store._mutations) {
      const mutation = namespaced.split('/').pop();

      if (mutation === `SOCKET_${event}`.toUpperCase()) {
        this.store.commit(namespaced, payload);
      }
    }
  }

  passToAction(event, payload) {
    for (const namespaced in this.store._actions) {
      const action = namespaced.split('/').pop();

      if (action === `socket_${event}`) {
        this.store.dispatch(namespaced, payload);
      }
    }
  }
}
