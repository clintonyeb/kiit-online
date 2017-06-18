<template>
    <div id="login">
        <v-card hover raised>
            <v-card-row height="200px" class="pa-5 grey lighten-1 cover">
                <div class="display-2 white--text text-xs-center">LOGIN HERE</div>
                <v-btn to="/register" primary light class="reg-btn" :router="true">
                    Register
                </v-btn>
            </v-card-row>
        </v-card>
    
        <v-card hover raised class="login-cont">
            <v-card-text>
                <v-text-field name="username" ref="username" :errors="userErrors" v-model.trim="username" label="Username" prepend-icon="account_circle" required hint="Your roll number"></v-text-field>
    
                <v-text-field name="password" ref="password" :errors="passErrors" v-model.trim="password" label="Password" prepend-icon="lock" type="password" hint="Your account password" required></v-text-field>
    
                <div>
                    <v-btn block primary light large @click.native="submit">Login</v-btn>
                </div>
                <p class="text-xs-center">
                    Don't have an account?
                    <router-link to="/register">register here</router-link>
                </p>
            </v-card-text>
        </v-card>
        <div class="page-content">
            <v-alert warning dismissible v-model="alert.shown">
                {{alert.message}}
            </v-alert>
        </div>
    </div>
</template>

<script>
import Validator from '../directives/validator.js';
import { loginUser } from '../store/api.js';

export default {
    name: 'login',
    data() {
        return {
            username: '',
            password: '',
            alert: {
                shown: false,
                message: ''
            },
            userErrors: [],
            passErrors: [],
        }
    },
    created: function () {
        this.$store.commit('REMOVE_TOKEN');
    },
    methods: {
        submit() {
            // clear old errors
            this.userErrors = [];
            this.passErrors = [];

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

            // attempt login
            loginUser({
                userName: username,
                password: password
            }, (err, res) => {
                if (err) {
                    // clear password
                    this.password = '';
                    this.$refs['password'].focus();

                    // show alert message
                    this.alert.message = 'Incorrect username and password';
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
.login-cont,
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
</style>


