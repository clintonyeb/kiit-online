<template>
    <div id="login">
        <v-card hover raised>
            <v-card-row height="200px" class="pa-5 grey lighten-1 cover">
                <div class="display-2 white--text text-xs-center">LOGIN HERE</div>
            </v-card-row>
        </v-card>
    
        <v-card hover raised class="login-cont">
            <v-card-text>
                <v-text-field name="username" v-model="username" label="Username" prepend-icon="account_circle" required hint="Usually your username is your school roll number"></v-text-field>
    
                <v-text-field name="password" v-model="password" label="Password" prepend-icon="lock" type="password" hint="The password you choose when registering for the account" required></v-text-field>
    
                <div>
                    <v-btn block primary light large @click.native="submit">Login</v-btn>
                </div>
                <p class="text-xs-center">
                    Forgot password?
                    <router-link to="/recover">recover password</router-link>
                </p>
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
    
        <v-footer class="pa-3 footer">
            <v-spacer></v-spacer>
            <div>© KIIT University</div>
        </v-footer>
    </div>
</template>

<script>

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
            }
        }
    },
    methods: {
        submit() {
            let username = this.username.trim();
            let password = this.password.trim();

            if (username && password) {
                loginUser({
                    userName: username,
                    password: password
                }, (err, res) => {
                    if (err) {
                        this.alert.message = 'Incorrect username and password';
                        this.alert.shown = true;
                    }

                    this.$store.commit('STORE_TOKEN', res);
                    // this.$router.replace('/');
                    window.location.replace('/');
                })
            }
        }
    }
}
</script>

<style scoped>
.footer {
    position: absolute;
    bottom: 0;
    right: 0;
}

.login-cont,
.page-content {
    width: 90%;
    max-width: 700px;
    margin: 0 auto;
}

.cover {
    background-image: url('/assets/mypic.jpeg');
    background-repeat: no-repeat;
    background-size: cover;
}
</style>


