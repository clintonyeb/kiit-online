<template>
    <div id="chat">
        <div class="ui comments" id="container">
            <v-progress-circular v-if="loading" indeterminate class="primary--text progress"></v-progress-circular>
            <message v-for="mess in chat" :key="mess" :mess="mess"></message>
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
            focused: true,
            container: null,
            observer: null,
        }
    },
    components: {
        Message
    },
    methods: {
        scrollToBottom: function () {
            window.scrollTo(0, document.body.scrollHeight);
        },
        checkScrollPos(e) {
            if (document.body.scrollTop <= 100 && !this.loading) {
                this.observer.disconnect();
                this.$socket.emit('getChats', {
                    userName: this.$store.state.user.userName,
                    offset: this.$store.state.chat.messages.length,
                });
                this.$store.commit('START_LOADING');
            }
            if ((window.innerHeight + window.scrollY) >= document.body.scrollHeight - 10) {
                this.setScrollObserver();
            }
        },
        setScrollObserver() {
            if (!this.observer) {
                this.observer = new MutationObserver(this.scrollToBottom);
            }
            let config = { childList: true };
            this.observer.observe(this.container, config);
        },
    },
    created: function () {
        if (this.chat.length < 20) {
            this.$socket.emit('getChats', {
                userName: this.$store.state.user.userName,
                offset: 0,
            }, (err, res) => {
                // console.log('server got it', err, res);
            });
        }

        this.$nextTick(() => {
            this.container = this.$el ? this.$el.querySelector('#container') : null;
            if (this.container) {
                this.setScrollObserver();
                this.scrollToBottom(); // keep bar at bottom between navigation
            }
        })

        this.$store.commit('NOTIFY_REMOVE', 'chat');
    },
    computed: {
        chat: function () {
            return this.$store.state.chat.messages;
        },
        comment: function () {
            return this.data;
        },
        loading() {
            return this.$store.state.chat.loading;
        },
    },
    mounted() {
        window.addEventListener('scroll', this.checkScrollPos);
    },
    destroyed() {
        window.removeEventListener('scroll', this.checkScrollPos);
    }
}
</script>

<style scoped>
@import '../assets/comment.min.css';

#chat {
    position: relative !important;
    padding-bottom: 7em;
}

.progress {
    position: relative;
    left: 50%;
}
</style>