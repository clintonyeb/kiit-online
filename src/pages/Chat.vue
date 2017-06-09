<template>
    <div class="ui minimal comments" ref="chat" id="chat">
        <message v-for="mess in chat" :key="mess" :mess="mess" class="mess"></message>
        <v-progress-circular v-if="loading" indeterminate class="primary--text prog"></v-progress-circular>
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
            this.container = this.$refs['chat'];
            this.container.addEventListener('scroll', this.containerScrollled);
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
        containerScrollled(e) {
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
    },
}
</script>


<style scoped>
@import '../assets/comment.css';

.prog {
    position: absolute;
    left: 50%;
    top: 0;
}

#chat {
    overflow: auto;
    height: calc(100vh - 11em);
    margin-top: -1em;
    display: flex;
    flex-direction: column-reverse;
    padding: 1em;
    padding-top: 3.5em;
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
    background-color: #0097A7;
}
</style>

