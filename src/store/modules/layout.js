
const state = {
  sidebar: {
    drawer: true,
    items: [
      { title: 'Home', icon: 'home', path: '/index', name: 'index' },
      { title: 'Chat', icon: 'chat', path: '/chat', name: 'chat' },
      { title: 'New Post', icon: 'add_circle', path: '/create', name: 'create' },
      { title: 'Profile', icon: 'account_circle', path: '/settings', name: 'settings' },
      { title: 'Help', icon: 'help', path: '/help', name: 'help' },
      { title: 'Logout', icon: 'lock', path: '/login', name: 'logout' },
    ],
    mini: false,
    resizeWatcher: true,
  },
  toolbar: {},
  notifications: {
    /* chat: {
       avatar: null,
       content: null,
       time: null,
       header: null,
       length: 0,
       key: 'chat',
     },*/
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
    shown: false,
  },
  chatInput: {
    content: '',
    placeholder: 'Type your message here, you can also select an emoticon with the left icon, or add a file with the right icon',
    files: [],
    fileHover: false,

  },
  emojiPicker: {
    shown: false,
    sheetSize: 32,
    title: 'pick an emoji',
    emoji: 'grinning',
    color: '#00BCD4',
    skin: 1,
  },
  progress: {
    shown: false,
    message: '',
  },
  comment: {
    dialog: false,
    items: [],
  },
};

const actions = {
  CHAT_NOTIFY({ commit, state, rootState }, payload) {
    if (rootState.route.name != 'chat') {
      commit('NOTIFY_ADD', payload);
    }
  },
};

const mutations = {
  TOGGLE_DRAWER(state, b) {
    state.sidebar.drawer = typeof b === 'undefined' ? !state.sidebar.drawer : b;
  },
  CHAT_CONTENT(state, data) {
    state.chatInput.content = data;
  },
  REPLY_USER({ commit }, userName) {
    let content = state.chatInput.content;
    let reg = new RegExp(`@${userName}`);
    if (!reg.test(content)) {
      content = `@${userName} ${content}`;
    }
    state.chatInput.content = content;
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
  CLEAR_CHAT_INPUT(state) {
    state.chatInput.content = '';
  },
  NOTIFY_ADD(state, payload) {
    let len = state.notifications.chat.length || 0;
    len = len + 1;
    let chat = {
      avatar: payload.user.avatar || 'assets/avatar-default.png',
      header: `${len} new chat messages`,
      time: new Date().getTime(),
      content: payload.content,
      length: len,
      key: 'chat'
    };
    state.notifications.chat = chat;
    let snd = new Audio('/assets/all-eyes-on-me.mp3');
    snd.play();
  },
  NOTIFY_CLEAR(state, type = 'all') {
    switch (type) {
      case 'chat':
        (state.notifications.chat) && (state.notifications.chat.length = 0);
        break;
      case 'all':
        break;
      default:
        break;
    }
  },
  SHOW_PROGRESS(state, type) {
    if (typeof type === 'string') {
      state.progress.message = type;
      state.progress.shown = true;
    } else {
      state.progress.message = '';
      state.progress.shown = type;
    }
  },
  SHOW_DIALOG(state, b = true) {
    state.comment.dialog = b;
  },
  SHOW_SNACK(state, text) {
    state.snackbar.text = text;
    state.snackbar.shown = true;
  },
};


export default {
  state,
  mutations,
  actions,
};
