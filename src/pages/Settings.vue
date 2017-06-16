<template>
    <div id="settings">
        <v-list three-line subheader>
            <v-list-item>
                <profile :display="display"></profile>
            </v-list-item>
        </v-list>
    
        <v-list three-line subheader>
            <v-subheader>Users and Accounts</v-subheader>
            <v-list-item @click="itemClicked('email')">
                <v-list-tile avatar>
                    <v-list-tile-action>
                        <v-icon>mail</v-icon>
                    </v-list-tile-action>
                    <v-list-tile-content>
                        <v-list-tile-title>Recovery email - {{user.email}}</v-list-tile-title>
                        <v-list-tile-sub-title>Click to account your
                            <i>recovery email address</i>
                        </v-list-tile-sub-title>
                    </v-list-tile-content>
                </v-list-tile>
            </v-list-item>
            <v-list-item @click="itemClicked('password')">
                <v-list-tile avatar>
                    <v-list-tile-action>
                        <v-icon>lock</v-icon>
                    </v-list-tile-action>
                    <v-list-tile-content>
                        <v-list-tile-title>Password</v-list-tile-title>
                        <v-list-tile-sub-title>Click to change your
                            <i>account password</i>
                        </v-list-tile-sub-title>
                    </v-list-tile-content>
                </v-list-tile>
            </v-list-item>
            <v-list-item @click="switchClicked('logged', loggedIn)">
                <v-list-tile avatar>
                    <v-list-tile-action>
                        <v-switch v-model="loggedIn" dark></v-switch>
                    </v-list-tile-action>
                    <v-list-tile-content>
                        <v-list-tile-title>Keep me logged in</v-list-tile-title>
                        <v-list-tile-sub-title>Keep me logged in, until I logout myself</v-list-tile-sub-title>
                    </v-list-tile-content>
                </v-list-tile>
            </v-list-item>
        </v-list>
        <v-divider></v-divider>
        <v-list three-line subheader>
            <v-subheader>General</v-subheader>
            <v-list-item @click="switchClicked('notifications', notifications)">
                <v-list-tile avatar>
                    <v-list-tile-action>
                        <v-switch v-model="notifications" dark></v-switch>
                    </v-list-tile-action>
                    <v-list-tile-content>
                        <v-list-tile-title>Notifications</v-list-tile-title>
                        <v-list-tile-sub-title>Send me notifications about chats and post updates</v-list-tile-sub-title>
                    </v-list-tile-content>
                </v-list-tile>
            </v-list-item>
            <v-list-item @click="switchClicked('sound', sound)">
                <v-list-tile avatar>
                    <v-list-tile-action>
                        <v-switch v-model="sound" dark></v-switch>
                    </v-list-tile-action>
                    <v-list-tile-content>
                        <v-list-tile-title>Sound</v-list-tile-title>
                        <v-list-tile-sub-title>Play a notification tone for notifications</v-list-tile-sub-title>
                    </v-list-tile-content>
                </v-list-tile>
            </v-list-item>
            <v-list-item @click="switchClicked('emailNoti', emailNoti)">
                <v-list-tile avatar>
                    <v-list-tile-action>
                        <v-switch v-model="emailNoti" dark></v-switch>
                    </v-list-tile-action>
                    <v-list-tile-content>
                        <v-list-tile-title>Email</v-list-tile-title>
                        <v-list-tile-sub-title>Send me emails about important posts and announcements</v-list-tile-sub-title>
                    </v-list-tile-content>
                </v-list-tile>
            </v-list-item>
        </v-list>
        <v-layout row justify-centers>
            <v-dialog v-model="dialog" persistent>
                <template v-if="type === 'email'">
                    <v-card class="pa-3">
                        <v-card-row>
                            <v-text-field :value="user.email" label="Old email"></v-text-field>
                        </v-card-row>
                        <v-card-row>
                            <v-text-field label="New email" v-model="email"></v-text-field>
                        </v-card-row>
                        <v-card-row actions>
                            <v-btn class="red" light @click.native="dialog = false" style="margin: 0 10px 0 0">Cancel</v-btn>
                            <v-btn class="primary" light @click.native="hideEditor('email')" style="margin:0 10px 0 10px">Save Changes</v-btn>
                        </v-card-row>
                    </v-card>
                </template>
                <template v-if="type === 'password'">
                    <v-card class="pa-3">
                        <v-card-row>
                            <v-text-field label="Current password" v-model="oldPassword"></v-text-field>
                        </v-card-row>
                        <v-card-row>
                            <v-text-field v-model="password" label="New password"></v-text-field>
                        </v-card-row>
                        <v-card-row>
                            <v-text-field label="Confirm new password"></v-text-field>
                        </v-card-row>
                        <v-card-row actions>
                            <v-btn class="red" light @click.native="dialog = false" style="margin: 0 10px 0 0">Cancel</v-btn>
                            <v-btn class="primary" light @click.native="hideEditor('password')" style="margin:0 10px 0 10px">Save Changes</v-btn>
                        </v-card-row>
                    </v-card>
                </template>
            </v-dialog>
        </v-layout>
    </div>
</template>

<script>

import Profile from './Profile.vue';

export default {
    name: 'settings',
    data() {
        return {
            notifications: false,
            sound: false,
            oldEmail: '',
            email: '',
            dialog: false,
            type: '',
            password: '',
            oldPassword: '',
            loggedIn: false,
            emailNoti: false,
            display: '',
        }
    },
    components: {
        Profile
    },
    methods: {
        itemClicked(item) {
            this.type = item;
            this.dialog = true;
        },
        hideEditor(type) {
            let data = type === 'email' ? this.email : this.password;
            let old = type === 'email' ? this.oldEmail : this.oldPassword;
            let userName = this.user.userName;

            this.$socket.emit('settings', {
                type,
                data,
                old,
                userName,
            }, (err, res) => {
                this.dialog = false;
                if (!err) {
                    this.$store.commit('SOCKET_USERGET', res);
                }
            });
        },
        saveSetting(type, value) {
            let userName = this.user.userName;

            this.$socket.emit('settings', {
                type,
                value,
                userName,
            }, (err, res) => {
            });
        },
        switchClicked(item, val) {
            this.saveSetting(item, val);
        },
        waitForUserName() {
            let userName = this.$store.state.user.userName;
            if (!userName) {
                setTimeout(() => {
                    this.waitForUserName();
                }, 50);
            } else {
                this.$socket.emit('getSettings', {
                    userName: this.$store.state.user.userName,
                }, (err, docs) => {
                    this.notifications = docs.notifications === 'true';
                    this.sound = docs.sound === 'true';
                    this.loggedIn = docs.logged === 'true';
                    this.emailNoti = docs.emailNoti === 'true';
                    this.display = docs.display;
                    this.email = docs.user.email;
                });
            }
        }
    },
    computed: {
        user() {
            return this.$store.state.user;
        }
    },
    mounted() {
        this.waitForUserName();
    }
}
</script>

<style>

</style>


