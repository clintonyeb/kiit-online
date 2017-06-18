<template>
    <div id="settings">
        <v-list three-line subheader>
            <v-list-item>
                <profile :display="display" :perm="true"></profile>
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
                            <v-text-field :value="user.email" :disabled="true" label="Current email"></v-text-field>
                        </v-card-row>
                        <v-card-row>
                            <v-text-field label="New email" :errors="emailErrors" ref="email" v-model="newEmail"></v-text-field>
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
                            <v-text-field label="Current password" type="password" :errors="oldPassErrors" ref="oldPass" v-model="oldPass"></v-text-field>
                        </v-card-row>
                        <v-card-row>
                            <v-text-field v-model="password" label="New password" type="password" :errors="newPassErrors" ref="newPass"></v-text-field>
                        </v-card-row>
                        <v-card-row>
                            <v-text-field label="Confirm new password" type="password" :errors="conPassErrors" ref="conPass" v-model="conPass"></v-text-field>
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
import Validator from '../directives/validator.js'

export default {
    name: 'settings',
    data() {
        return {
            notifications: false,
            sound: false,
            newEmail: '',
            email: '',
            dialog: false,
            type: '',
            password: '',
            oldPass: '',
            conPass: '',
            loggedIn: false,
            emailNoti: false,
            display: '',
            emailErrors: [],
            oldPassErrors: [],
            newPassErrors: [],
            conPassErrors: [],

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
            if (type === 'email') {
                this.changeEmail(type);
            } else if (type === 'password') {
                this.changePass(type);
            }


        },
        changeEmail(type) {
            this.emailErrors = [];

            let oldEmail = this.email;
            let newEmail = this.newEmail;

            let res = this.validate(newEmail, {
                required: true,
                email: true,
                notSame: oldEmail,
            })
            if (!res.valid) {
                this.emailErrors = [`New email ${res.message}`];
                this.$refs['email'].focus();
                return;
            }

            this.submitChange(type, oldEmail, newEmail);
        },
        changePass(type) {
            this.conPassErrors = [];
            this.oldPassErrors = [];
            this.newPassErrors = [];

            let oldPass = this.oldPass;

            let res = this.validate(oldPass, {
                required: true,
            })
            if (!res.valid) {
                this.oldPassErrors = [`Password ${res.message}`];
                this.$refs['oldPass'].focus();
                return;
            }

            let newPass = this.password;
            let conPass = this.conPass;

            res = this.validate(newPass, {
                required: true,
                match: conPass,
                min: 6,

            })
            if (!res.valid) {
                this.newPassErrors = [`Password ${res.message}`];
                this.$refs['newPass'].focus();
                return;
            }

            this.submitChange(type, oldPass, newPass);
        },
        submitChange(type, old, data) {
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
    },
    mixins: [Validator],
}
</script>

<style>

</style>


