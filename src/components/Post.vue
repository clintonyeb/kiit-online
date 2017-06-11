<template>
    <div class="event">
        <div class="label">
            <img :src="avatar">
        </div>
        <div class="content">
            <div class="summary">
                <a class="user">
                    {{user.fullName}}
                </a> added a new lecture slide
                <timeago :since="date" class="date" :auto-update="60"></timeago>
            </div>
            <div class="extra text" v-if="post.content">
                <span class="title">{{post.title}}</span>
                {{post.content}}
            </div>
            <div class="extra images" v-for="file in post.files" v-if="post.files">
                <a>
                    <img :src="file">
                </a>
            </div>
            <div class="meta">
                <a class="like">
                    <i class="like icon"></i> {{comments}}
                </a>
            </div>
        </div>
    </div>
</template>

<script>

export default {
    props: ['post'],
    name: 'post',
    data() {
        return {}
    },
    computed: {
        comments: function () {
            switch (this.post.comments) {
                case 0:
                    return 'No comments'
                case 1:
                    return '1 comment'
                default:
                    return 'No comments'
            }
        },
        user() {
            return this.post.user
        },
        avatar() {
            return this.user.avatar || '/assets/avatar-default.png';
        },
        date() {
            let time = this.post.time;
            return new Date(Number(time));
        },
    }
}
</script>

<style scoped>
.title {
    display: block;
    font-size: 1.1rem;
}
</style>


