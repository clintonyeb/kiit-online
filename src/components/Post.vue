<template>
    <div class="event" @click.stop="postClicked">
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
            <div class="extra text">
                <span class="title">{{post.title}}</span>
                <span v-if="post.content">{{content}}</span>
            </div>
            <div class="extra images" v-for="file in post.files" :key="file">
                <a>
                    <img :src="file">
                </a>
            </div>
            <div class="meta">
                <a class="like">
                    <img src="/assets/chat.svg" class="image icon"> {{comments}}
                </a>
                <a class="like detail">
                    Click to view full post
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
            return this.post.commentsCount ? `${this.post.commentsCount} comments` : 'No comments';
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
        content() {
            let parts = this.post.content.split('.');
            let text = parts.slice(0, 2).join('. ').trim() + '.';
            if (parts.length > 2) {
                text = `${text}..`;
            }
            return text;
        }
    },
    methods: {
        postClicked(event) {
            this.$emit('clicked', this.post.id);
        },
    },
}
</script>

<style scoped>
.title {
    display: block;
    font-size: 1.1rem;
}

.event {
    cursor: pointer;
}

.image.icon {
    height: 15px;
    width: 15px;
    color: #00BCD4;
    line-height: 2;
    margin-right: 10px;
}

.meta {
    display: inline-block;
    width: 100%;
}

.detail {
    padding-left: 5em;
    font-size: .8rem;
    visibility: hidden;
    opacity: 0 !important;
    -webkit-transition: opacity .2s ease-out .5s !important;
    -moz-transition: opacity .2s ease-out .5s !important;
    transition: opacity .2s ease-out .5s !important;
}

.event:hover .detail {
    visibility: visible;
    opacity: 1 !important;
}
</style>


