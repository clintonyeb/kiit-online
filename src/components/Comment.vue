<template>
  <v-layout row justify-center>
    <v-dialog v-model="dialog" fullscreen transition="v-dialog-bottom-transition" ref="dialog" id="dialog">
      <v-card>
        <v-toolbar light>
          <v-btn icon="icon" @click.native="hide" light>
            <v-icon>close</v-icon>
          </v-btn>
          <v-toolbar-title>{{post.title}}</v-toolbar-title>
        </v-toolbar>
  
        <v-card-text id="comment-container" ref="comment-container">
          <v-layout row wrap class="layout">
            <v-flex xs12 md5 class="ui large feed">
              <div class="event">
                <div class="content">
                  <div class="extra text">
                    <span v-if="post.content">{{post.content}}</span>
                  </div>
                  <div class="extra images" v-for="file in post.files" :key="file">
                    <a>
                      <img :src="file">
                    </a>
                  </div>
                </div>
              </div>
            </v-flex>
            <v-flex xs12 md7 class="flex-comments">
              <h4 class="title">Comments</h4>
              <div class="ui minimal comments">
                <message v-for="mess in comments" :key="mess" :mess="mess" class="mess"></message>
              </div>
              <comment-input :postId="postId" @submitted="submitted"></comment-input>
            </v-flex>
          </v-layout>
        </v-card-text>
  
      </v-card>
  
    </v-dialog>
  </v-layout>
</template>

<script>

import Message from './Message.vue';
import CommentInput from './CommentInput.vue';

export default {
  props: ['shown', 'postId'],
  name: 'comment',
  data() {
    return {
      dialog: false,
      comments: [],
      commentContainer: null,
    }
  },
  computed: {
    post() {
      return this.$store.getters.getPostById(this.postId);
    },
    user() {
      return this.post.user;
    },
    /*comments() {
      let comms = this.$store.getters.getCommentsById(this.postId);
      return comms;
    }*/
  },
  watch: {
    shown() {
      if (!this.shown) {
        this.dialog = false;
        document.getElementsByTagName("html")[0].style = "";
      } else {
        this.dialog = true;
      }
    },
    postId() {
      let comms = this.$store.getters.getCommentsById(this.postId);
      if (!comms.items) {
        this.$socket.emit('getComments', {
          postId: this.postId,
          userName: this.$store.state.user.userName
        }, (err, res) => {
          this.comments = this.$store.getters.getCommentsById(this.postId);
        });
      }
    },
  },
  methods: {
    hide() {
      this.dialog = false;
      this.$emit('hidden');
    },
    submitted(height) {
      let cont = this.commentContainer
        = this.commentContainer
          ? this.commentContainer :
          this.$refs.dialog.$refs.content.firstChild;

      this.$nextTick(() => {
        cont.scrollTop = cont.scrollHeight + height;
      })
    },
  },
  components: {
    Message, CommentInput
  }
}
</script>

<style scoped>
.card {
  padding-bottom: 4.5em !important;
}

#comment-container {
  height: 100%!important;
  padding: 0 !important;
  overflow-x: hidden;
}










/*.comments {
  display: flex;
  flex-direction: column-reverse;
}*/

.feed,
.comments,
.title {
  padding-left: 20px !important;
  padding-right: 20px !important;
}

.flex-comments {
  position: relative !important;
  width: inherit !important;
}
</style>