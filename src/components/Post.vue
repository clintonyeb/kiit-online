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
            <div class="extra images" v-for="file in post.files.slice(0, 6)" :key="file">
                <img :src="`/assets/previews/${file}`">
                <div class="img-middle">
                    <v-btn class="dark--text" icon>
                        <v-icon dark>file_download</v-icon>
                    </v-btn>
                    <!--<span class="faded">{{formatBytes(file.size)}}</span>-->
                </div>
            </div>
            <v-divider></v-divider>
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
            return this.post.commentsCount ? `${this.post.commentsCount} comments` : 'No comments';
        },
        user() {
            return this.post.user
        },
        avatar() {
            return this.user.avatar || '/assets/images/avatar-default.png';
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
        formatBytes(a, b) { if (0 == a) return "0 Bytes"; var c = 1e3, d = b || 2, e = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"], f = Math.floor(Math.log(a) / Math.log(c)); return parseFloat((a / Math.pow(c, f)).toFixed(d)) + " " + e[f] },

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
    position: relative;
}

.extra.images img {
    width: 100%;
    padding: 5px;
    opacity: 1;
    height: auto;
    transition: .5s ease;
    backface-visibility: hidden;
}

.extra.images .img-middle {
    transition: .5s ease;
    opacity: 0;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    -ms-transform: translate(-50%, -50%)
}

.extra.images:hover img {
    opacity: 0.3;
}

.extra.images:hover .img-middle {
    opacity: 1;
}
</style>


