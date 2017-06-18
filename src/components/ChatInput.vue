<template>
    <v-toolbar id="chat-input" ref="chat-input" class="dark--text" :class="chatInput.fileHover ? 'primary' : 'white' " @drop="drop" @dragover.prevent="dragOver" @dragleave.prevent="dragLeave">
    
        <input type="file" name="file" @change="onChange" style="visibility:hidden;">
    
        <!--<picker :title="picker.title" :skin="picker.skin" :color="picker.color" :sheetSize="picker.sheetSize" v-show="picker.shown" @click="emojiSelected" :emoji="picker.emoji" class="emoji"></picker>-->
    
        <v-btn class="emoji-picker" icon :class="{ 'primary--text': picker.shown }" @click.native="$store.commit('TOGGLE_PICKER')">
            <v-icon light>insert_emoticon</v-icon>
        </v-btn>
    
        <textarea rows="1" cols="100%" v-model="text" :placeholder="textAreaMess" @focus="$store.commit('TOGGLE_PICKER', false)" ref="input" @input="textUpdated($event, $refs.input.value)" @keydown="preventNewLine($event)">
        </textarea>
    
        <v-btn icon class="send-btn" @click.native="attachBtnClicked($event)">
            <v-icon light>{{content ? 'send' : 'attach_file'}}</v-icon>
        </v-btn>
    </v-toolbar>
</template>

<script>

export default {
    name: 'chat-input',
    data() {
        return {
            isMobile: true,
            messId: 1,
        }
    },
    created() {
        this.isMobile = window.innerWidth <= 800;
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
        },
        textAreaMess() {
            if (this.isMobile) {
                return 'Type your message here'
            } else {
                return this.chatInput.placeholder;
            }
        },
        rows() {
            if (this.isMobile) {
                return 1
            } else {
                return 3;
            }
        }
    },
    methods: {
        emojiSelected: function (emoji, event) {
            let data = `${this.content} ${emoji.colons} `;
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

            let userName = this.$store.state.user.userName;

            let data = {
                content: text,
                userName: userName,
                id: this.messId++,
            };

            this.$socket.emit('chat', data, (err, resId) => {
                console.log(err, resId);
                if (!err && resId) {
                    this.$store.commit('SET_TIME', resId);
                }
            });
            this.$store.dispatch('addChat', data);
            this.$store.commit('CLEAR_CHAT_INPUT');
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
    align-items: center;
    align-content: center;
    width: 100%;
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

.emoji {
    position: fixed;
    bottom: 0;
    margin-bottom: 5em;
    z-index: -5 !important;
    margin-left: -3px;
}


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


@media only screen and (max-device-width: 768px) {
    #chat-input {
        height: 4em !important;
    }

    textarea {
        font-size: 1.5rem;
        position: relative;
    }

    .emoji-picker {
        padding-left: 10px;
    }
}
</style>


