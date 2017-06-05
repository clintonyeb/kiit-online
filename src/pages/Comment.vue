<template>
    <div id="chat">
        <div class="ui minimal comments" id="container">
            <message v-for="mess in comments" :key="mess._id" :mess="mess"></message>
        </div>
    </div>
</template>


<script>

import Message from '../components/Message.vue';

export default {
    props: ['commentId'],
    name: 'comment',
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
    created: function () {
        this.$socket.emit('requestComments', this.commentId);
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