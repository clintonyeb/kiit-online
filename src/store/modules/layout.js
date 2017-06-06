
const state = {
  sidebar: {
    drawer: true,
    items: [
      { title: 'Home', icon: 'dashboard', path: '/index', name: 'index' },
      { title: 'Chat', icon: 'chat', path: '/chat', name: 'chat' },
      { title: 'Profile', icon: 'account_circle', path: '/profile', name: 'profile' },
      { title: 'Settings', icon: 'settings', path: '/settings', name: 'settings' },
      { title: 'Help', icon: 'help', path: '/help', name: 'help' },
      { title: 'Logout', icon: 'settings_power', path: '/login', name: 'logout' },
    ],
    mini: false,
    resizeWatcher: true
  },
  toolbar: {

  },
  snackbar: {
    text: '',
    timeout: 4000,
    top: false,
    right: true,
    left: false,
    bottom: true,
    multiline: true,
    vertical: false,
    shown: false
  },
  chatInput: {
    content: '',
    placeholder: 'Type your message here, you can use also select an emoticon with the left icon, or add a file with the right icon',
    files: [],
    fileHover: false

  },
  emojiPicker: {
    shown: false,
    sheetSize: 32,
    title: 'pick an emoji',
    emoji: 'grinning',
    color: '#00BCD4',
    skin: 1
  }
}

const actions = {

}

const mutations = {
  TOGGLE_DRAWER(state) {
    state.sidebar.drawer = !state.sidebar.drawer;
  },
  CHAT_CONTENT(state, data) {
    state.chatInput.content = data;
  },
  TOGGLE_PICKER(state, b) {
    if (b === undefined) {
      state.emojiPicker.shown = !state.emojiPicker.shown;
    } else {
      state.emojiPicker.shown = b;
    }
  },
  FILE_HOVERED(state, b) {
    state.chatInput.fileHover = b;
  },
  SOCKET_USERSTATUS: function (state, data) {
    state.snackbar.text = data;
    state.snackbar.shown = true;
  },
  SOCKET_SLIDEADD(state, payload) {
    state.snackbar.text = 'Slide added';
    state.snackbar.shown = true;
  },
  CLEAR_CHAT_INPUT(state) {
    state.chatInput.content = '';
  }
}


export default {
  state,
  mutations,
  actions
}