<template>
    <div id="chat">
        <div class="ui minimal comments" id="container">
            <message v-for="mess in chat" :key="mess._id" :mess="mess"></message>
        </div>
    </div>
</template>

<script>

import Message from '../components/Message.vue';
import { Emoji } from 'emoji-mart-vue'

export default {
    name: 'chat',
    data() {
        return {
            data: '',
            id: 1,
            submitted: false,
            focused: true
        }
    },
    components: {
        Message, Emoji
    },
    methods: {
    },
    created: function () {
        /*if (this.$store.state.chat.messages.length < 1) {
            this.$store.dispatch('GET_CHATS');
        }*/

        this.$socket.emit('requestMessages');
    },
    computed: {
        chat: function () {
            return this.$store.state.chat.messages;
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

#chat {
    position: relative !important;
    padding-bottom: 7em;
}
</style>