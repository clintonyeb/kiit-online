<template>
    <v-toolbar light id="chat-input" ref="chat-input" class="dark--text" :class="chatInput.fileHover ? 'primary' : 'white' " @drop="drop" @dragover.prevent="dragOver" @dragleave.prevent="dragLeave">
    
        <input type="file" name="file" @change="onChange" style="visibility:hidden;">
    
        <picker :title="picker.title" :skin="picker.skin" :color="picker.color" :sheetSize="picker.sheetSize" v-show="picker.shown" @click="emojiSelected" :emoji="picker.emoji" class="emoji"></picker>
    
        <v-btn class="emoji-picker" icon :class="{ 'primary--text': picker.shown }" @click.native="$store.commit('TOGGLE_PICKER')" title="Insert emoticon">
            <v-icon light>insert_emoticon</v-icon>
        </v-btn>
    
        <textarea rows="3" cols="100%" v-model="text" autofocus :placeholder="chatInput.placeholder" @focus="$store.commit('TOGGLE_PICKER', false)" ref="input" @input="textUpdated($event, $refs.input.value)" @keydown="preventNewLine($event)">
        </textarea>
    
        <v-btn icon class="send-btn" :title="content ? 'Send message' : 'Attach file'" @click.native="attachBtnClicked($event)">
            <v-icon light>{{content ? 'send' : 'attach_file'}}</v-icon>
        </v-btn>
    </v-toolbar>
</template>

<script>
import { Picker } from 'emoji-mart-vue'

export default {
    name: 'chat-input',
    data() {
        return {
        }
    },
    computed: {
        text: function () {
            return this.content;
        },
        picker: function () {
            return this.$store.state.layout.emojiPicker;
        },
        content: function () {
            return this.chatInput.content;
        },
        chatInput: function () {
            return this.$store.state.layout.chatInput;
        }
    },
    watch: {
        focus: function (val) {
            return val ? this.$refs['input'].focus() : '';
        }
    },
    components: {
        Picker
    },
    methods: {
        emojiSelected: function (emoji, event) {
            let data = `${this.content} ${emoji.native || emoji.colons} `;
            this.$store.commit('CHAT_CONTENT', data);
        },
        textUpdated: function (event, text) {
            this.$store.commit('CHAT_CONTENT', text);
            return false;
        },
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

            let _user = this.$store.state.user;
            if (_user) return false;
            let user = {
                _id: _user._id,
                userName: _user.userName,
                fullName: _user.fullName
            };


            let data = {
                content: text,
                user: user,
                dateCreated: new Date(),
                _id: ++this.id
            };

            this.$socket.emit('message', data);
            this.$store.commit('CHATS_ADD', data);
            this.data = '';
            this.focused = true;
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
#chat-input {
    position: fixed;
    bottom: 0;
    height: 6em !important;
    display: flex;
    flex-wrap: nowrap;
    width: 100%;
}

textarea {
    outline: none !important;
    resize: none;
    overflow-y: hidden;
    font-size: 1rem;
    align-items: stretch;
    flex: 90;
    z-index: 5;
}

.send-btn {
    align-items: flex-end;
    flex: 5;
}

.emoji-picker {
    align-items: flex-start;
    flex: 5;
}

.emoji {
    position: fixed;
    bottom: 0;
    margin-bottom: 5em;
    z-index: -5 !important;
    margin-left: -3px;
}










/*drag and drop*/

input[type="file"] {
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: 100%;
    cursor: pointer;
    opacity: 0;
}

.drag-over {
    background-color: #DADADA;
}
</style>


