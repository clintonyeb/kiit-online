<template>
    <div class="comment">
        <a class="avatar">
            <img :src="mess.user.avatar || '/assets/avatar-default.png'" />
        </a>
        <div class="content" @click="messageClicked">
            <a class="author" v-tooltip:right="{html: mess.user.userName}">{{mess.user.fullName}}</a>
            <div class="metadata">
                <v-icon dark>bubble_chart</v-icon>
                <timeago :since="date" class="date" :auto-update="60"></timeago>
            </div>
            <div class="text">
                {{mess.content}}
            </div>
        </div>
    </div>
</template>

<script>

export default {
    props: ['mess'],
    name: 'message',
    data() {
        return {}
    },
    computed: {
        date() {
            let time = this.mess.time;
            return new Date(Number(time));
        },
    },
    methods: {
        parseEmoji(text) {

        },
        messageClicked: function () {
            this.$store.commit('REPLY_USER', this.mess.user.userName);
        },
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

.content {
    cursor: pointer;
}
</style>

