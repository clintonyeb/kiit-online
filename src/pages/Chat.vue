<template>
    <div id="chat-container" ref="chat-container">
        <v-progress-circular v-if="loading" indeterminate class="primary--text prog"></v-progress-circular>
        <div class="ui minimal comments" id="chat">
            <message v-for="mess in chat" :key="mess.time" :mess="mess" class="mess"></message>
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

            // remove any notifications for chat
            this.$store.commit('NOTIFY_CLEAR', 'chat');
        });


    },
    beforeMount() {
        if (this.chat.length < 20 && !this.$store.state.chat.done) {
            this.fetchData(0);
        }
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

            let userName = this.$store.state.user.userName;
            if (!userName) {
                setTimeout(() => {
                    this.fetchData(offset);
                }, 50);
                return;
            }

            if (offset === 0) this.$store.commit('SHOW_PROGRESS', true);
            else this.$store.commit('START_LOADING', true);

            this.$socket.emit('getChats', {
                userName,
                offset,
            }, (err, res) => {
                // start load, so scroll to bottom
                if (offset === 0) {
                    this.$store.commit('SHOW_PROGRESS', false);
                    this.container.scrollTop = this.container.scrollHeight;
                } else {
                    setTimeout(() => {
                        this.$store.commit('START_LOADING', false);
                    }, 2000);
                }
            });
        },
        init() {

        },
    }
}
</script>


<style scoped>
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

#chat {
    display: flex;
    flex-direction: column-reverse;
}

@media only screen and (max-device-width: 768px) {
    #chat-container {
        height: calc(100vh - 12em) !important;
    }
}

@media only screen and (min-device-width: 768px) {
    #chat {
        padding-right: 30px;
    }
}
</style>

