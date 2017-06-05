<template>
    <div id="comment">
        <div class="ui minimal comments" id="container">
            <message v-for="mess in comments" :key="mess._id" :mess="mess"></message>
        </div>
        <picker :title="picker.title" :skin="picker.skin" :color="picker.color" :sheetSize="picker.sheetSize" v-show="emoji" @click="emojiSelected" :emoji="picker.emoji" class="emoji"></picker>
        <chat-input @input="textUpdated" @focused="emoji = false" :focus="focusedInput" @submit="submit" @emoji="emoji = !emoji" :emoji="emoji" :comment="comment">
    
        </chat-input>
    </div>
</template>

<script>

import Message from '../components/Message.vue';
import ChatInput from '../components/ChatInput.vue';
import { Picker } from 'emoji-mart-vue'
import { Emoji } from 'emoji-mart-vue'

export default {
    props: ['commentId'],
    name: 'comment',
    data() {
        return {
            emoji: false,
            data: '',
            picker: {
                sheetSize: 32,
                title: 'pick an emoji',
                emoji: 'grinning',
                color: '#00BCD4',
                skin: 1
            },
            id: 1,
            submitted: false,
            focused: true
        }
    },
    components: {
        Message, Picker, Emoji, ChatInput
    },
    methods: {
        submit: function (event) {
            let _user = this.$store.state.user;
            let user = {
                _id: _user._id,
                userName: _user.userName,
                fullName: _user.fullName
            };
            let text = this.data.trim();
            if (text == "" || text == null) {
                this.data = '';
                return;
            };

            let data = {
                content: text,
                user: user,
                dateCreated: new Date(),
                _id: ++this.id
            };

            this.$socket.emit('comment', data);
            this.$store.commit('COMMENTS_ADD', data);
            this.data = '';
            this.focused = true;
        },

        emojiSelected: function (emoji, event) {
            this.data = `${this.comment} ${emoji.native || emoji.colons} `;
            this.focused = true;
        },
        textUpdated: function (text) {
            this.data = `${text}`;
        },
        scrollToBottom: function () {
            window.scrollTo(0, document.documentElement.scrollHeight);
        }
    },
    created: function () {
        /*if (this.$store.state.chat.messages.length < 1) {
            this.$store.dispatch('GET_CHATS');
        }*/
        
        this.$socket.emit('requestComments');

        this.$nextTick(() => {
            let cont = this.$el ? this.$el.querySelector('#container') : null;
            if (cont) {
                let observer = new MutationObserver(this.scrollToBottom);
                let config = { childList: true };
                observer.observe(cont, config);
                this.scrollToBottom();
            }

        })
    },
    computed: {
        comments: function () {
            return this.$store.state.comment.messages;
        },
        comment: function () {
            return this.data;
        },
        focusedInput: function () {
            return !this.emoji || this.focused
        }
    }
}
</script>

<style scoped>
@import '../assets/comment.min.css';

#comment {
    position: relative !important;
    padding-bottom: 6em;
}

.emoji {
    position: fixed;
    bottom: 0;
    margin-bottom: 4em;
}
</style>