<template>
    <div id="register">
        <v-card hover raised>
            <v-card-row height="200px" class="pa-5 grey lighten-1 cover">
                <div class="display-1 white--text text-xs-center">ACCOUNT REGISTRATION</div>
            </v-card-row>
        </v-card>
    
        <v-stepper v-model="currStep" class="page-content">
            <v-stepper-header>
                <v-stepper-step step="0" :complete="currStep > 0">Confirm roll number</v-stepper-step>
                <v-divider></v-divider>
                <v-stepper-step step="1" :complete="currStep > 1">Confirm Registration</v-stepper-step>
                <v-divider></v-divider>
                <v-stepper-step step="2">Terms and conditions</v-stepper-step>
            </v-stepper-header>
            <v-stepper-content step="0">
                <v-card flat>
                    <v-card-text>
                        <v-text-field name="userName" label="University roll number" type="number" required v-model="userName" hint="Please provide your university roll number for verification"></v-text-field>
                    </v-card-text>
                    <v-btn primary @click.native="btnClicked" light>{{btnText}}</v-btn>
                </v-card>
            </v-stepper-content>
            <v-stepper-content step="1">
                <v-card flat>
                    <v-card-text>
                        <v-text-field name="name" label="Display name" ref="name" type="text" v-model="name" hint="This is the name you will be referred to, this is not your username" required></v-text-field>
    
                        <v-text-field name="password" label="Choose a password" ref="password" type="password" required v-model="password" hint="Password should be at least 6 characters"></v-text-field>
    
                        <v-text-field name="email" label="Recovery email" ref="email" type="email" required v-model="email" hint="This email will be used in case you forget your password"></v-text-field>
                    </v-card-text>
                    <v-btn primary @click.native="btnClicked" light>{{btnText}}</v-btn>
                </v-card>
            </v-stepper-content>
            <v-stepper-content step="2">
                <v-card flat>
                    <v-card-text>
                        <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Cum quam, ut error laborum in debitis omnis nobis, dolorem qui rem veniam ullam odit, dolore, doloremque! Recusandae harum alias impedit atque! Lorem ipsum dolor sit amet, consectetur adipisicing elit. Reprehenderit cum suscipit consequatur nam vitae aliquid, aliquam, esse debitis pariatur, itaque explicabo omnis. Veniam maxime quis rem totam aperiam, ex doloribus!
                        </p>
                    </v-card-text>
                    <v-btn primary @click.native="btnClicked" light>{{btnText}}</v-btn>
                </v-card>
            </v-stepper-content>
        </v-stepper>
        <div class="page-content">
            <v-alert error dismissible v-model="alert.shown">
                {{alert.message}}
            </v-alert>
        </div>
    </div>
</template>

<script>

import { validateRollNumber, postAccountDetails } from '../store/api.js';

export default {
    name: 'register',
    data() {
        return {
            userName: '',
            alert: {
                shown: false,
                message: ''
            },
            password: '',
            email: ''
        }
    },
    computed: {
        currStep() {
            return this.user.step;
        },
        user() {
            return this.$store.state.user;
        },
        name() {
            let name = this.user.fullName;
            return name || '';
        },
        btnText() {
            let step = this.currStep;
            switch (step) {
                case 0:
                    return 'Next';
                case 1:
                    return 'Next';
                case 2:
                    return 'Agree and register account';
                default:
                    break;
            }
        }
    },
    methods: {
        btnClicked() {
            this.alert.shown = false;
            let step = this.currStep;
            switch (step) {
                case 0:
                    let userName = this.userName;
                    if (userName == "" || userName === null) return;
                    validateRollNumber(userName, (err, res) => {
                        if (err) {
                            if (err.response.status === 409) {
                                this.alert.message = 'It appears you already have an account, please login instead';
                            } else if (err.response.status === 404) {
                                this.alert.message = 'Could not find your roll number';
                            } else {
                                this.alert.message = 'An error occurred, try again';
                            }
                            this.alert.shown = true;
                        } else {
                            this.alert.shown = false;
                            this.$store.commit('SET_USER_NAME', userName);
                            this.$store.commit('SET_REG', res);
                        }
                    })
                    break;

                case 1:
                    let name = this.name ? this.name.trim() : null;
                    let password = this.password ? this.password.trim() : null;
                    let email = this.email ? this.email.trim() : null;

                    if (name && password && email) {
                        let data = {
                            fullName: name,
                            password: password,
                            email: email
                        }
                        this.$store.commit('SET_PAYLOAD', data);

                    } else {
                        return;
                    }
                    break;
                case 2:
                    let reg = this.$store.getters['GET_PAYLOAD'];

                    let data = {
                        userName: reg.userName,
                        fullName: reg.fullName,
                        password: reg.password,
                        email: reg.email,
                        class: reg.class,
                        year: reg.year,
                    }
                    postAccountDetails(data, (err, res) => {
                        if (err) {
                            this.alert.message = 'Could not register account';
                            this.alert.shown = true;
                        } else {
                            this.alert.shown = false;
                            this.$router.replace('/login');
                        }
                    })
                default:
                    break;
            }
        },
        bread(index) {
            let step = this.user.step;
            return step !== index;
        }
    }
}
</script>

<style scoped>
.page-content {
    width: 100%;
    max-width: 700px;
    margin: 0 auto;
}

.btn {
    clear: right;
    float: right;
}

.cover {
    background-image: url('/assets/mypic.jpeg');
    background-repeat: no-repeat;
    background-size: cover;
}
</style>


