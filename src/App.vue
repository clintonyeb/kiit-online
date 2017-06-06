<template>
  <div id="app">
    <router-view name="sideBar"></router-view>
    <router-view name="toolBar"></router-view>
    <main>
      <v-container fluid>
        <router-view></router-view>
      </v-container>
    </main>
    <router-view name="chatInput"></router-view>
    <v-snackbar :timeout="snackbar.timeout" success :top="snackbar.top" :bottom="snackbar.bottom" :right="snackbar.right" :left="snackbar.left" :multi-line="snackbar.multiline" :vertical="snackbar.vertical" v-model="snackbar.shown">
      {{ snackbar.text }}
      <v-btn flat class="pink--text" @click.native="snackbar.shown = false">Close</v-btn>
    </v-snackbar>
  </div>
</template>

<script>

export default {
  name: 'app',
  data() {
    return {
    }
  },
  mounted: function () {

  },
  created: function () {
    let token = localStorage.getItem('token');
    if (!token) {
      return this.$router.replace('/login');
    }
    setInterval(this.setTick, 10000);
  },
  computed: {
    user() {
      return this.$store.state.user;
    },
    userName() {
      return this.user.userName;
    },
    fullName() {
      return this.user.fullName;
    },
    avatar() {
      return this.user.avatar || '/assets/avatar-default.png'
    },
    title() {
      let name = this.$route.name;

      switch (name) {
        case 'index':
        case 'index2':
          return 'Home';
        case 'profile':
          return 'Profile';
        case 'settings':
          return 'Settings';
        case 'terms':
          return 'Terms and Conditions';
        case 'add':
          return 'Add New Slide';
        case 'chat':
          return "Chat Room";
        case 'login':
          return "Login in Here";
        default:
          return '';
      }
    },
    snackbar() {
      return this.$store.state.layout.snackbar;
    }
  },
  sockets: {
    message: function (data) {
      this.$store.commit('CHATS_ADD', data);
    },
    requestedMessages: function (docs) {
      return docs.length > 0 ? this.$store.commit('CHATS_GET', JSON.parse(docs)) : [];
    },
    requestedComments: function (data) {
      console.log('comments received');
    },
    comments: function (data) {
      this.$store.commit('COMMENTS_ADD', data);
    }
  },
  methods: {
    setTick() {
      this.$store.commit('TICK');
    }
  }
}

</script>

<style lang="stylus">

// Theme

$theme := {
  primary: #00BCD4
  accent: #03A9F4
  secondary: #757575
  info: #B2EBF2
  warning: #ff0000
  error: #990000
  success: #0097A7
  dark-primary: #0097A7
  light-primary: #B2EBF2
  text-primary: #FFFFFF
}

@import '../node_modules/vuetify/src/stylus/main';

a {
  text-decoration: none;
}
</style>



