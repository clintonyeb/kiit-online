<template>
    <div id="chat-container" ref="chat-container">
        <v-progress-circular v-if="loading" indeterminate class="primary--text prog"></v-progress-circular>
        <div class="ui minimal comments" id="chat">
            <message v-for="mess in chat" :key="mess" :mess="mess" class="mess"></message>
        </div>
    </div>
</template>

<script>

import Message from '../components/Message.vue';

export default {
    name: 'chat',
    data() {
        return {
            container: null,
        }
    },
    components: {
        Message
    },
    mounted: function () {
        // instantiate container after nextTick, 
        // otherwise might be null
        this.$nextTick(() => {
            this.container = this.$refs['chat-container'];
            this.container.addEventListener('scroll', this.containerScrolled);
        });

        // fetch new data if current is less than 20 when
        // component was created
        if (this.chat.length < 20) {
            this.fetchData(0);
        }

        // remove any notifications for chat
        this.$store.commit('NOTIFY_CLEAR', 'chat');
    },
    computed: {
        chat: function () {
            return this.$store.state.chat.messages;
        },
        loading() {
            return this.$store.state.chat.loading;
        },
    },
    methods: {
        containerScrolled(e) {
            if (this.loading) return false;
            let container = e.target;
            let pos = this.container.scrollTop;
            if (pos < 10) {
                this.fetchData(this.chat.length);
            }
        },
        fetchData(offset) {
            let done = this.$store.state.chat.done;
            if (done) return;

            if (offset === 0) this.$store.commit('PROGRESS_SHOW', true);
            else this.$store.commit('START_LOADING', true);

            this.$socket.emit('getChats', {
                userName: this.$store.state.user.userName,
                offset: offset,
            }, (err, res) => {
                // start load, so scroll to bottom
                if (offset === 0) {
                    this.$store.commit('PROGRESS_SHOW', false);
                    this.container.scrollTop = this.container.scrollHeight;
                } else {
                    setTimeout(() => {
                        this.$store.commit('START_LOADING', false);
                    }, 2000);
                }
            });
        },
    }
}
</script>


<style>
@import '../assets/comment.css';

.prog {
    position: absolute;
    left: 50%;
    top: 0;
}

#chat-container {
    overflow-y: scroll;
    height: calc(100vh - 10em);
    display: flex;
    flex-direction: column-reverse;
}

@media only screen and (max-device-width: 768px) {
    #chat-container {
        height: calc(100vh - 12em) !important;
    }
}

#chat {
    display: flex;
    flex-direction: column-reverse;
}

#main-container {
    padding-top: 0 !important;
}
</style>

