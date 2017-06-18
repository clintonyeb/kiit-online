<template>
    <v-layout row wrap id="index-container">
        <v-flex xs12 md8 class="ui large feed">
            <post v-for="post in posts" :key="post.id" :post="post" @clicked="postClicked"></post>
        </v-flex>
        <v-flex xs12 md4 class="comment-box">
            <comment :shown="commentShown" @hidden="comment=false" class="comment" :postId="commentId"></comment>
        </v-flex>
        <v-progress-circular v-if="loading" indeterminate class="primary--text prog"></v-progress-circular>
    </v-layout>
</template>

<script>

import Post from '../components/Post.vue';
import Comment from '../components/Comment.vue';

export default {
    name: 'index',
    data() {
        return {
            comment: false,
            commentItem: null,
            loading: true,
        }
    },
    computed: {
        posts() {
            return this.$store.state.post.items;
        },
        commentShown() {
            return this.comment;
        },
        commentId() {
            return this.commentItem;
        },
    },
    beforeMount() {
        this.init();
    },
    methods: {
        init() {
            if (this.$store.state.post.items.length < 20 && !this.$store.state.post.done) {
                let userName = this.$store.state.user.userName;
                if (!userName) {
                    setTimeout(() => {
                        this.init();
                    }, 50);
                    return;
                } else {
                    this.$socket.emit('getPosts', { userName, offset: 0 }, (err, res) => {
                        this.loading = false;
                    });
                }
            } else this.loading = false;
        },
        postClicked(item) {
            this.commentItem = item;
            this.comment = !this.comment;

        },
        windowScrolled(event) {
            if (this.loading) return false;
            let scrollTop = (document.documentElement && document.documentElement.scrollTop) || document.body.scrollTop;
            let scrollHeight = (document.documentElement && document.documentElement.scrollHeight) || document.body.scrollHeight;
            let scrolledToBottom = (scrollTop + window.innerHeight + 40) >= scrollHeight;
            let offset = this.$store.state.post.items.length;
            let userName = this.$store.state.user.userName;
            this.$socket.emit('getPosts', { userName, offset }, (err, res) => {
                this.loading = false;
            });
        },
    },
    components: {
        Post, Comment
    },
    beforeRouteLeave(to, from, next) {
        if (this.comment) {
            this.comment = false;
            return next(false);
        }
        return next(true);
    },
    mounted() {
        this.$nextTick(() => {
            window.addEventListener('scroll', this.windowScrolled);
        });
    },
}
</script>

<style scoped>
.comment-box {
    position: relative;
}

.comment {
    position: absolute !important;
}

.prog {
    position: absolute;
    left: 50%;
    bottom: 5;
}
</style>



