<template>
    <v-layout row wrap id="index-container">
        <v-flex xs12 md8 class="ui large feed">
            <post v-for="post in posts" :key="post.id" :post="post" @clicked="postClicked"></post>
        </v-flex>
        <v-flex xs12 md4 class="comment-box">
            <comment :shown="commentShown" @hidden="comment=false" class="comment" :postId="commentId"></comment>
        </v-flex>
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
                    this.$socket.emit('getPosts', { userName, offset: 0 }, (err, res) => { });
                }
            }
        },
        postClicked(item) {
            this.commentItem = item;
            this.comment = !this.comment;

        }
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
    }
}
</script>

<style scoped>
.comment-box {
    position: relative;
}

.comment {
    position: absolute !important;
}
</style>



