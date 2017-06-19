<template>
    <div id="login">
        <v-card hover raised>
            <v-card-row height="200px" class="pa-5 grey lighten-1 cover">
                <div class="display-2 white--text text-xs-center">LOGIN HERE</div>
                <v-btn to="/register" primary light class="reg-btn" :router="true" :tabindex="5">
                    Register
                </v-btn>
            </v-card-row>
        </v-card>
    
        <v-card hover raised class="page-content">
            <v-card-text>
                <v-container fluid>
                    <v-layout row wrap>
                        <v-flex xs12>
                            <v-text-field name="username" ref="username" :tabindex="1" @keyup.native.enter="submit" v-focus :errors="userErrors" v-model.trim="username" label="Username" prepend-icon="account_circle" required hint="Your roll number"></v-text-field>
                        </v-flex>
                        <v-flex xs12>
                            <v-text-field name="password" ref="password" :tabindex="2" @keyup.native.enter="submit" :errors="passErrors" v-model.trim="password" label="Password" prepend-icon="lock" type="password" hint="Your account password" required></v-text-field>
                        </v-flex>
                        <v-flex xs12>
                            <v-btn block primary light large :tabindex="3" @click.native="submit" @keyup.native.enter="submit">Login</v-btn>
                        </v-flex>
                        <v-flex xs12 class="text-xs-center text subheading ma5 pa5">
                            Don't have an account?
                            <router-link to="/register" :tabindex="4">register here</router-link>
                        </v-flex>
                    </v-layout>
                </v-container>
            </v-card-text>
        </v-card>
        <div class="page-content">
            <v-alert :warning="!alert.color" :primary="alert.color" dismissible v-model="alert.shown">
                {{alert.message}}
            </v-alert>
        </div>
    </div>
</template>

<script>
import Validator from '../mixins/validator.js';
import { loginUser } from '../store/api.js';

export default {
    name: 'login',
    data() {
        return {
            username: '',
            password: '',
            alert: {
                shown: false,
                message: '',
                color: false
            },
            userErrors: [],
            passErrors: [],
        }
    },
    created: function () {
        this.$store.commit('REMOVE_TOKEN');
        let message = this.$store.state.user.loginMessage;
        if (message) {
            this.alert.color = true;
            this.alert.message = message;
            this.alert.shown = true;
        }
    },
    methods: {
        submit() {
            // clear old errors
            this.userErrors = [];
            this.passErrors = [];
            this.alert.shown = false;

            // validate username
            let username = this.username;
            let res = this.validate(username,
                {
                    required: true
                }
            );
            if (!res.valid) {
                this.userErrors = [`Username ${res.message}`];
                this.$refs['username'].focus();
                return;
            }

            // validate password
            let password = this.password;
            res = this.validate(password,
                {
                    required: true
                }
            );
            if (!res.valid) {
                this.passErrors = [`Password ${res.message}`];
                this.$refs['password'].focus();
                return;
            }

            // start progress
            this.showProgress();

            // attempt login            
            loginUser({
                userName: username,
                password: password
            }, (err, res) => {
                if (err) {
                    this.hideProgress();
                    // clear password
                    this.password = '';
                    this.$refs['password'].focus();

                    // show alert message
                    this.alert.message = 'Incorrect username and password';
                    this.alert.color = false;
                    this.alert.shown = true;
                    return;
                }

                // store token
                // go to homepage if user authenticated
                this.$store.commit('STORE_TOKEN', res);
                window.location.replace('/');
            })
        }
    },
    mixins: [Validator],
}
</script>

<style scoped>
.page-content {
    width: 100%;
    max-width: 700px;
    margin: 0 auto;
}

.cover {
    background-image: url('/assets/images/mypic.jpeg');
    background-repeat: no-repeat;
    background-size: cover;
    position: relative;
}

.reg-btn {
    position: absolute;
    right: 10px;
    top: 10px;
}

.text {
    line-height: 2;
}

@media screen and (max-device-width: 768px) {
    .page-content {
        width: 100%;
        min-width: 100% !important;
    }
}
</style>


