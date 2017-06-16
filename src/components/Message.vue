<template>
    <div class="comment">
        <a class="avatar">
            <router-link :to="`/profile/${mess.user.userName}`">
                <img :src="`/assets/avatars/${mess.user.avatar}`" />
            </router-link>
        </a>
        <div class="content">
            <router-link :to="`/profile/${mess.user.userName}`" class="author" v-tooltip:right="{html: mess.user.userName}">
                {{mess.user.fullName}}
            </router-link>
            <div class="metadata">
                <v-icon class="primary--text text--darken-2">bubble_chart</v-icon>
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

#comment {
    flex: 1;
}
</style>

