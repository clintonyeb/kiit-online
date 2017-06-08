<template>
    <div class="ui minimal comments" ref="chat" id="chat">
        <v-progress-circular v-if="loading" indeterminate class="primary--text prog"></v-progress-circular>
        <message v-for="mess in chat" :key="mess" :mess="mess" class="mess"></message>
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
            lastScrollHeight: null,
        }
    },
    components: {
        Message
    },
    mounted: function () {
        this.$nextTick(() => {
            document.body.style.overflow = 'hidden';
            this.container = this.$refs['chat'];
        });

        if (this.chat.length < 20) {
            this.$store.commit('PROGRESS_SHOW', true);
            this.$socket.emit('getChats', {
                userName: this.$store.state.user.userName,
                offset: 0,
            }, (err, res) => {
                this.$store.commit('PROGRESS_SHOW', false);
                this.container.scrollTop = this.container.scrollHeight;
            });
        }

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
    destroyed() {
        document.body.style.overflow = 'auto';
    },
}
</script>


<style scoped>
@import '../assets/comment.css';

.prog {
    position: relative;
    left: 50%;
}

#chat {
    overflow-y: auto;
    height: 78vh;
    margin-top: -1.5em;
    display: flex;
    flex-wrap: wrap-reverse;
    fle
}

#chat::-webkit-scrollbar-track {
    -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
    border-radius: 10px;
    background-color: #F5F5F5;
}

#chat::-webkit-scrollbar {
    width: 12px;
    background-color: #F5F5F5;
}

#chat::-webkit-scrollbar-thumb {
    border-radius: 10px;
    -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, .3);
    background-color: #D62929;
}
</style>

