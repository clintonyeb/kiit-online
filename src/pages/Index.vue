<template>
    <v-layout row wrap>
        <v-flex xs12 md8 class="ui large feed">
            <post v-for="post in posts" :key="post.time" :post="post"></post>
        </v-flex>
        <v-flex xs12 md4>
        </v-flex>
    </v-layout>
</template>

<script>

import Post from '../components/Post.vue';

export default {
    name: 'index',
    data() {
        return {}
    },
    computed: {
        posts() {
            return this.$store.state.post.items;
        }
    },
    created() {
        // call for posts
        let userName = this.$store.state.user.userName;
        this.$socket.emit('getPosts', { userName, offset: 0 }, (err, docs) => {
        });
    },
    components: {
        Post
    }
}
</script>

<style>
@import '../assets/feed.css';
</style>



