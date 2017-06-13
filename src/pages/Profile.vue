<template>
    <div>
        <v-layout row wrap>
            <v-flex md4 xs12 class="img-cont">
                <img src="/assets/avatar-default.png" width="200px">
                <p class="text-xs-center username">Username</p>
            </v-flex>
            <v-flex md8 xs12>
                <strong>Fullname here</strong>
                <p>Status</p>
                <p>Class</p>
                <p>Following</p>
            </v-flex>
        </v-layout>
        <v-layout row wrap>
            <v-flex xs12>
                <h6>Activity Feed</h6>
                <div>
                    Activites 1
                </div>
            </v-flex>
        </v-layout>
    </div>
</template>

<script>

export default {
    name: 'profile',
    data() {
        return {}
    }
}
</script>

<style scoped>
.card {
    width: 100%;
    max-width: 700px;
    margin: 0 auto;
}

.username {
    width: 200px;
}
</style>


