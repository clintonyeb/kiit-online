<template>
    <v-card id="slide" hover raised @click="$emit('clicked', slide._id)">
        <v-card-row class="primary darken-1 header">
            <span class="white--text title">{{slide.title}}</span>
            <v-spacer></v-spacer>
            <span class="white--text date">{{date}}</span>
        </v-card-row>
        <v-card-row img="/assets/images/flower.jpg" height="200px"></v-card-row>
        <v-card-row actions class="grey lighten-1 mt-0 dark--text">
            <v-icon class="accent--text">bubble_chart</v-icon>
            <span class="comments">
                {{comments}}
            </span>
            <v-spacer></v-spacer>
            <v-icon class="accent--text">person</v-icon>
            <span class="" id="user">{{slide.userName}}</span>
        </v-card-row>
    </v-card>
</template>

<script>

import * as moment from 'moment';

export default {
    props: ['slide'],
    name: 'slide',
    data() {
        return {}
    },
    computed: {
        date: function () {
            return moment(new Date(Number(this.slide.time))).fromNow()
        },
        comments: function () {
            switch (this.slide.comments) {
                case 0:
                    return 'No comments'
                case 1:
                    return '1 comment'
                default:
                    return 'No comments'
            }
        }
    }
}
</script>

<style scoped>
.card {
    width: 100%;
    max-width: 700px;
}

.card {
    margin-bottom: 5px;
}

.header {
    padding: 10px;
}

.title {
    font-weight: bolder;
    text-shadow: 1px 1px 3px #000;
}

.date {
    font-size: .9rem;
    font-style: italic;
}

#user:hover {
    color: #000;
}

.comments {
    margin-left: 5px;
    border-bottom: 1px solid #03A9F4;
}

#user {
    border-bottom: 1px solid #03A9F4;
}
</style>


