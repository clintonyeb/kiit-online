<template>
    <div class="event" @click.stop="postClicked">
        <div class="label">
            <router-link :to="`/profile/${user.userName}`">
                <img :src="avatar">
            </router-link>
        </div>
        <div class="content">
            <div class="summary">
                <router-link class="user" :to="`/profile/${user.userName}`">
                    {{user.fullName}}
                </router-link> added a new lecture slide
                <timeago :since="date" class="date" :auto-update="60"></timeago>
            </div>
            <div class="extra text">
                <span class="title">{{post.title}}</span>
                <span v-if="post.content">{{content}}</span>
            </div>
            <div class="extra images" v-for="file in post.files.slice(0, 6)" :key="file">
                <img :src="preview(file)">
            </div>
            <div class="meta">
                <a class="like">
                    <img src="/assets/images/chat.svg" class="image icon"> {{comments}}
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
            let count = Number(this.post.commentsCount);

            if (!count || count === 0) {
                return 'No comments';
            }
            else if (count === 1) {
                return '1 comment';
            }
            else {
                return `${count} comments`;
            }
        },
        user() {
            return this.post.user
        },
        avatar() {
            return `/assets/avatars/${this.user.avatar}`;
        },
        date() {
            let time = this.post.time;
            return new Date(Number(time));
        },
        content() {
            /*let parts = this.post.content.split('.');
            let text = parts.slice(0, 2).join('. ').trim() + '.';
            if (parts.length > 2) {
                text = `${text}..`;
            }*/
            return this.post.content;
        },
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

.event:hover {
    box-shadow: 1px 1px 3px #DADADA;
}

.extra.images {
    display: inline-block;
    width: 95px;
}

.extra.images img {
    width: 100%;
    padding: 5px;
    height: auto;
}
</style>


