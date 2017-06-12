<template>
  <div id="comment-input" ref="comment-input" class="dark--text elevation-3">
  
    <v-btn class="emoji-picker" icon>
      <v-icon light>insert_emoticon</v-icon>
    </v-btn>
  
    <textarea rows="1" cols="100%" v-model="content" placeholder="Type your comment here" @focus="$store.commit('TOGGLE_PICKER', false)" ref="input" @keydown="preventNewLine($event)">
    </textarea>
  
    <v-btn icon class="send-btn" @click.native="attachBtnClicked($event)">
      <v-icon light>{{content ? 'send' : 'attach_file'}}</v-icon>
    </v-btn>
  
  </div>
</template>

<script>
import { Picker } from 'emoji-mart-vue'
import { Emoji } from 'emoji-mart-vue'

export default {
  props: ['postId'],
  name: 'comment-input',
  data() {
    return {
      isMobile: true,
      content: '',
    }
  },
  created() {
    this.isMobile = window.innerWidth <= 800;
  },
  computed: {
  },
  components: {
    Picker, Emoji
  },
  methods: {
    preventNewLine(event) {
      if (event.keyCode == 13 && !event.shiftKey) {
        event.preventDefault();
        this.submit(event);
        return false;
      }
    },
    submit: function (event) {
      let text = this.content.trim();
      if (text == "" || text == null) {
        return false;
      };

      let userName = this.$store.state.user.userName;

      let data = {
        postId: this.postId,
        content: text,
        userName: userName,
        time: new Date().getTime(),
      };

      this.$socket.emit('comment', data, (err, res) => {
      });
      this.$store.dispatch('addComment', data);
      this.content = '';
    },

    sendFile: function (files) {

    },
    drop(event) {
      this.$store.commit('FILE_HOVERED', false);
      event.preventDefault();
      let files = event.dataTransfer.files;
      this.chatInput.files.push(...files);
    },
    removeFile(index) {
      this.files.splice(index, 1);
    },
    onChange(event) {
      if (this.loading) return;
      let files = event.target.files;
      this.files.push(...files);
    },
    dragOver(event) {
      this.$store.commit('FILE_HOVERED', true);
    },
    dragLeave(event) {
      this.$store.commit('FILE_HOVERED', false);
    },
    attachBtnClicked(event) {
      if (this.content) {
        this.submit(event);
      } else {
        let input = this.$el ? this.$el.querySelector("input[type='file']") : null;
        if (input === null) return;
        input.click();
      }
    }
  }
}
</script>

<style scoped>
#comment-input {
  width: 100%;
  height: 4em !important;
  display: flex;
  flex-wrap: nowrap;
  align-items: center;
  align-content: center;
  border-radius: 8px;
}

textarea {
  outline: none !important;
  resize: none;
  overflow-y: hidden;
  font-size: 1.2rem;
  flex: 90;
  align-self: center !important;
  z-index: 5;
}

.send-btn {
  align-self: center;
  flex: 5;
}

.emoji-picker {
  align-self: center;
  flex: 5;
}

@media only screen and (max-device-width: 768px) {
  textarea {
    padding: 20px;
    font-size: 1.5rem;
    position: relative;
    top: 10px;
  }
}
</style>


