<template>
    <div id="index">
        <!--<router-link to="/add" id="float">
            <v-btn floating class="indigo">
                <v-icon light>mode_edit</v-icon>
            </v-btn>
        </router-link>-->
        <slide v-for="slide in slides" :key="slide._id" :slide="slide" @clicked="slideClicked"></slide>
    </div>
</template>

<script>

import Slide from '../components/Slide.vue';

export default {
    name: 'index',
    data() {
        return {
            message: 'Home'
        }
    },
    created: function () {
        /*let slides = this.$store.state.slide.items;
        if (slides.length < 1) {
            this.$store.dispatch('GET_SLIDES');
        }*/
        this.$socket.emit('slides', this.$store.state.user.userName);
    },
    computed: {
        slides() {
            return this.$store.state.slide.items
        }
    },
    components: {
        Slide
    },
    methods: {
        slideClicked: function (_id) {
            this.$router.push({
                path: `/comments/${_id}`
            })
        }
    }
}
</script>

<style scoped>
#float {
    position: fixed;
    bottom: 10px;
    right: 10px;
    z-index: 10;
}
</style>


