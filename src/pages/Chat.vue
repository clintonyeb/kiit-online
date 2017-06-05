<template>
    <div id="chat">
        <div class="ui minimal comments" id="container">
            <message v-for="mess in chat" :key="mess._id" :mess="mess"></message>
        </div>
    </div>
</template>

<script>

import Message from '../components/Message.vue';

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
        Message
    },
    methods: {
        scrollToBottom: function () {
            window.scrollTo(0, document.documentElement.scrollHeight);
        }
    },
    created: function () {
        if (this.chat.length < 1) {
            this.$socket.emit('getChats', { userName: this.$store.state.user.userName });
        }

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
        chat: function () {
            return this.$store.state.chat.messages;
        },
        comment: function () {
            return this.data;
        },
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