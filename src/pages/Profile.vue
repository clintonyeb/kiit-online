<template>
    <div class="profile">
        <v-layout row wrap>
            <v-flex md4 xs12 class="img-cont">
                <a class="darken text-xs-center">
                    <div class="img-text">
                        <v-icon large class="white--text">mode_edit</v-icon>
                    </div>
                    <img src="/assets/images/boy.svg" width="180px">
                </a>
            </v-flex>
            <v-flex md8 xs12 class="desc">
                <p class="item">
                    <span class="body-2">
                        Display Name:
                    </span>
                    <span class="body-1">
                        {{user.fullName}}
                    </span>
                </p>
                <p class="item">
                    <span class="body-2">
                        Username:
                    </span>
                    <span class="body-1">
                        {{user.userName}}
                    </span>
                </p>
                <p class="item">
                    <span class="body-2">
                        Class:
                    </span>
                    <span class="body-1">
                        {{user.class | capitalize}}
                    </span>
                </p>
                <p class="item" @click="dialog = true">
                    <span class="body-2">
                        Status:
                    </span>
                    <span class="body-1">
                        {{bio}}
                    </span> &middot;
                    <timeago :since="statusDate" class="caption" :auto-update="60" v-if="user.statusUpdate"></timeago>
                    <span v-tooltip:top="{ html: 'Change status' }">
                        <v-btn icon class="primary--text">
                            <v-icon class="edit">mode_edit</v-icon>
                        </v-btn>
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
        <v-layout row justify-center>
            <v-dialog v-model="dialog" persistent :width="500">
                <v-card>
                    <v-card-row>
                        <v-card-title class="primary white--text">Change status</v-card-title>
                    </v-card-row>
                    <v-card-row>
                        <v-card-text>
                            <v-text-field max="125" counter name="status" label="Your status" v-model="status"></v-text-field>
                        </v-card-text>
                    </v-card-row>
                    <v-card-row actions>
                        <v-btn class="warning--text darken-1" flat="flat" @click.native="dialog = false">Cancel</v-btn>
                        <v-btn class="primary--text darken-1" flat="flat" @click.native="saveStatus">Save Status</v-btn>
                    </v-card-row>
                </v-card>
            </v-dialog>
        </v-layout>
    </div>
</template>

<script>

export default {
    name: 'profile',
    data() {
        return {
            dialog: false,
            status: '',
        }
    },
    computed: {
        user() {
            return this.$store.state.user;
        },
        bio() {
            return this.user.status || '[No status update so far]';
        },
        statusDate() {
            let time = this.user.statusUpdate;
            return new Date(Number(time));
        }
    },
    methods: {
        saveStatus() {
            let status = this.status;
            let userName = this.$store.state.user.userName;
            let data = {
                status,
                userName,
            }
            this.$socket.emit('status', data, (err, res) => {
                this.dialog = false;
            })
        },
    },
    filters: {
        capitalize(str) {
            return str.toUpperCase();
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

.layout {
    display: flex;
}

.flex {
    justify-content: center;
    align-self: center;
}

.username {
    width: 200px;
}

.divider {
    margin-top: 30px;
    margin-bottom: 30px;
    height: 1.5px;
}

.list {
    display: inline-block;
}

.img-cont {
    cursor: pointer;
}

.img-text {
    position: absolute;
    top: 100px;
    left: 100px;
}

a.darken {
    display: inline-block;
    background-color: rgba(0, 0, 0, 0.4);
    padding: 0;
}

a.darken img {
    display: block;
    position: relative;
    -webkit-transition: all 0.8s linear;
    -moz-transition: all 0.8s linear;
    -ms-transition: all 0.8s linear;
    -o-transition: all 0.8s linear;
    transition: all 0.8s linear;
}

a.darken:hover img {
    opacity: 0.8;
}

.flex {
    width: 100%;
}

.edit {
    font-size: 15px;
}
</style>


