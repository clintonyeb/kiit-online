<template>
    <div>
        <v-layout row wrap>
            <v-flex md4 xs12 class="img-cont">
                <a class="darken text-xs-center">
                    <div class="img-text">
                        <v-icon large class="white--text">mode_edit</v-icon>
                    </div>
                    <img src="/assets/avatar-default.png" width="200px">
                </a>
                <p class="text-xs-center username body-2">{{user.userName}}</p>
            </v-flex>
            <v-flex md8 xs12 class="desc">
                <p @click="itemClicked('name')" class="item">
                    <span class="title">
                        Display Name:
                    </span>
                    <span class="subheading" v-if="!nameEdit">
                        {{user.fullName}}
                    </span>
                    <span v-else>
                        <input :value="user.fullName" ref="nameInput" placeholder="Display name">
                    </span>
                    <span>
                        <v-icon dark class="edit" v-if="!nameEdit">mode_edit</v-icon>
                    </span>
                </p>
                <p class="item">
                    <span class="title">
                        Status:
                    </span>
                    <span class="subheading">
                        {{user.status}}
                    </span>
                    <span>
                        <v-icon dark class="edit">mode_edit</v-icon>
                    </span>
                </p>
                <p class="item">
                    <span class="title">
                        Following:
                    </span>
                    <span class="subheading">
                        {{user.followers}}
                    </span>
                    <span>
                        <v-icon dark class="edit">mode_edit</v-icon>
                    </span>
                </p>
                <p class="item">
                    <span class="title">
                        Class:
                    </span>
                    <span class="subheading">
                        {{user.class}}
                    </span>
                    <span>
                        <v-icon dark class="edit">mode_edit</v-icon>
                    </span>
                </p>
            </v-flex>
        </v-layout>
        <v-divider class="divider"></v-divider>
        <v-layout row wrap>
            <v-flex xs12>
                <h6 class="title">Activity Feed</h6>
                <div>
                    Activity 1
                </div>
            </v-flex>
        </v-layout>
    </div>
</template>

<script>

export default {
    name: 'profile',
    data() {
        return {
            nameEdit: false,
            statusEdit: false,
            followingEdit: false,
        }
    },
    computed: {
        user() {
            return this.$store.state.user;
        }
    },
    methods: {
        itemClicked(type) {
            switch (type) {
                case 'name':
                    this.nameEdit = true;
                    let input = this.$refs['nameInput'];
                    console.log(input);
                    break;

                default:
                    break;
            }
        }
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

.divider {
    margin-top: 30px;
    margin-bottom: 30px;
}

.list {
    display: inline-block;
}

.desc,
.img-cont {
    align-self: center;
}

.img-cont {
    height: 220px;
    cursor: pointer;
}

.img-text {
    position: absolute;
    top: 100px;
    left: 100px;
}

a.darken {
    display: inline-block;
    background: black;
    padding: 0;
}

a.darken img {
    display: block;
    position: relative;
    -webkit-transition: all 0.5s linear;
    -moz-transition: all 0.5s linear;
    -ms-transition: all 0.5s linear;
    -o-transition: all 0.5s linear;
    transition: all 0.5s linear;
}

a.darken:hover img {
    opacity: 0.8;
}

.edit {
    font-size: .8em;
    line-height: 2;
}

.item {
    cursor: pointer;
}
</style>


