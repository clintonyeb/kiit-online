<template>
  <v-app id="app">
    <router-view name="sideBar"></router-view>
    <router-view name="toolBar"></router-view>
    <main>
      <v-container fluid id="main-container" :class="[notPadded ? 'notPadded' : 'padded']">
        <router-view></router-view>
      </v-container>
    </main>
    <router-view name="chatInput"></router-view>
    <v-snackbar :timeout="snackbar.timeout" success :top="snackbar.top" :bottom="snackbar.bottom" :right="snackbar.right" :left="snackbar.left" :multi-line="snackbar.multiline" :vertical="snackbar.vertical" v-model="snackbar.shown">
      {{ snackbar.text }}
      <v-btn flat class="pink--text" @click.native="snackbar.shown = false">Close</v-btn>
    </v-snackbar>
    <div class="progress" v-if="progress.shown">
      <v-progress-circular indeterminate v-bind:size="50" class="primary--text"></v-progress-circular>
    </div>
    <!--<router-view name="footer"></router-view>-->
  </v-app>
</template>

<script>

export default {
  name: 'app',
  data() {
    return {
    }
  },
  beforeCreate: function () {
    let token = localStorage.getItem('token');
    if (!token) {
      return this.$router.replace('/login');
    }
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
    snackbar() {
      return this.$store.state.layout.snackbar;
    },
    progress() {
      return this.$store.state.layout.progress;
    },
    notPadded() {
      return this.$route.name === 'chat';
    }
  },
  sockets: {
    chat(payload) {
      if (payload.userName == this.userName) {
        console.log('message sent');
      } else {
        this.$store.commit('CHATS_ADD', payload);
        this.$store.dispatch('CHAT_NOTIFY', payload);
      }
    },
    auth(payload) {
      if (payload == 401) {
        return this.$router.replace('/login');
      }
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
@import './assets/feed.css';
@import './assets/comment.css';

a {
  text-decoration: none;
}

.progress {
    position: absolute;
    top: 50%;
    left: 50%;
    z-index: 100;
}

#main-container {
  position: relative;
}

.notPadded {
      padding-top: 0;
} 

.padded {
      padding-top: 1rem;
} 
</style>



