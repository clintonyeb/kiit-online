<template>
  <v-app id="app">
    <!--<div class="dimmer" v-seen="progress.shown"></div>-->
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
      <div>
        <v-progress-circular indeterminate v-bind:size="50" class="primary--text prog"></v-progress-circular>
        <p v-if="progress.message">{{}progress.message}</p>
      </div>
    </div>
    <router-view name="footer"></router-view>
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
    let path = location.pathname;
    if (path == '/login' || path == '/register') return;
    let token = localStorage.getItem('token');
    if (!token) {
      return this.$router.replace('/login');
    }
  },
  computed: {
    snackbar() {
      return this.$store.state.layout.snackbar;
    },
    progress() {
      return this.$store.state.layout.progress;
    },
    notPadded() {
      return this.$route.name === 'chat';
    },
  },
}

</script>

<style lang="stylus">

// Theme

$theme := {
  primary: #4CAF50
  accent: #8BC34A
  secondary: #757575
  info: #0d47a1
  warning: #f57f17
  error: #b71c1c
  success: #1b5e20
  dark-primary: #388E3C
  light-primary: #C8E6C9
  text-primary: #FFFFFF
}



@import '../node_modules/vuetify/src/stylus/main';
@import './assets/feed.css';
@import './assets/comment.css';

a {
  text-decoration: none;
}

.progress {
    position: fixed;
    top: 0;
    left: 0;
    height: 100%;
    width: 100%;
    z-index: 99999;
    pointer-events: all;
    cursor: wait;
    margin: 0;
    padding: 0;
   
}

.divider {
  color: #BDBDBD;
}

.prog {
   position: absolute;
   top: 45%;
   left: 45%;
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



