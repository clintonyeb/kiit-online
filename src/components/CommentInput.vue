<template>
  <v-toolbar id="comment-input" ref="comment-input" class="dark--text">
  
    <v-btn id="emoji-picker" icon>
      <v-icon light>insert_emoticon</v-icon>
    </v-btn>
  
    <textarea rows="1" cols="100%" v-model="content" placeholder="Type your comment here" @blur="inputBlurred" @focus="inputFocused" ref="input" id="elInput" @keydown="preventNewLine($event)">
    </textarea>
  
    <v-btn icon id="send-btn" @click.native="attachBtnClicked($event)">
      <v-icon light>{{content ? 'send' : 'attach_file'}}</v-icon>
    </v-btn>
  
  </v-toolbar>
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

      let user = this.$store.state.user;
      let userName = user.userName;
      let _class = user.class;

      let data = {
        postId: this.postId,
        content: text,
        userName: userName,
        time: new Date().getTime(),
        class: _class,
      };

      this.$socket.emit('comment', data, (err, res) => {
      });
      this.$store.dispatch('addComment', data);
      this.content = '';
      this.$emit('submitted', this.$refs['comment-input'].clientHeight);
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
    },
    inputFocused(event) {
    },
    inputBlurred(event) {
    },
    findPos(obj) {
      var curtop = 0;
      if (obj.offsetParent) {
        do {
          curtop += obj.offsetTop;
        } while (obj = obj.offsetParent);
        return [curtop];
      }
    }
  }
}
</script>

<style scoped>
#comment-input {
  height: 4em !important;
  display: flex;
  flex-wrap: nowrap;
  align-items: center;
  align-content: center;
  position: fixed;
  background-color: white;
  width: inherit !important;
  top: calc(100% - 4em);
  left: 0;
  right: 0;
}

textarea {
  outline: none !important;
  resize: none;
  overflow-y: hidden;
  font-size: 1.2rem;
  flex: 90;
  z-index: 5;
  align-self: center;
  max-width: 100% !important;
}

#send-btn {
  align-self: center;
  flex: 5;
  margin: 0 10px 0 10px !important;
}

#emoji-picker {
  align-self: center;
  flex: 5;
  margin: 0 10px 0 10px !important;
}

@media only screen and (max-device-width: 768px) {
  textarea {
    font-size: 1.5rem;
    position: relative;
  }
}
</style>


