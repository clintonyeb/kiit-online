<template>
    <div class="comment">
        <a class="avatar">
            <img :src="mess.user.avatar || '/assets/images/avatar-default.png'" />
        </a>
        <div class="content">
            <a class="author" :title="mess.user.userName">{{mess.user.fullName}}</a>
            <div class="metadata">
                <span class="date"> &middot; {{date}}</span>
            </div>
            <div class="text">
                {{mess.content}}
            </div>
            <div class="actions">
                <a class="reply">Reply</a>
            </div>
        </div>
    </div>
</template>

<script>

import * as moment from 'moment';


export default {
    props: ['mess'],
    name: 'message',
    data() {
        return {
        }
    },
    computed: {
        date: function () {
            let tick = this.$store.state.chat.tick;
            return tick && moment(this.mess.dateCreated).fromNow()
        }
    }
}
</script>

<style scoped>
.mess-title {
    padding: 0;
    padding-left: 10px;
    position: relative;
    bottom: 10px;
}
</style>

