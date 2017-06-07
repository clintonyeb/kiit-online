<template>
    <div>
        <slide v-for="slide in slides" :key="slide.id" :slide="slide" @clicked="slideClicked(slide.id)"></slide>
    </div>
</template>

<script>

import Slide from '../components/Slide.vue';

export default {
    name: 'index',
    data() {
        return {}
    },
    created: function () {
        let slides = this.$store.state.slide.items;
        if (slides.length < 1) {
            this.$socket.emit('getSlides', { userName: this.$store.state.user.userName });
        }

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
        slideClicked: function (id) {
            this.$router.push({
                path: `/comments/${id}`
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


