<template>
    <div id="register">
        <v-card hover raised>
            <v-card-row height="200px" class="pa-5 grey lighten-1 cover">
                <div class="display-1 white--text text-xs-center">ACCOUNT REGISTRATION</div>
                <v-btn primary light class="reg-btn" to="/login" :router="true">Login</v-btn>
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
                        <v-container fluid>
                            <v-layout row wrap>
                                <v-flex xs12>
                                    <v-text-field name="userName" :tabindex="1" ref="userName" @keyup.native.enter="btnClicked" :errors="userErrors" label="University roll number" required v-model.trim="userName" hint="Please provide your university roll number for verification"></v-text-field>
                                </v-flex>
                                <v-flex xs12>
                                    <v-btn primary @click.native="btnClicked" :tabindex="2" light>{{btnText}}</v-btn>
                                </v-flex>
                            </v-layout>
                        </v-container>
                    </v-card-text>
                </v-card>
            </v-stepper-content>
            <v-stepper-content step="1">
                <v-card flat>
                    <v-card-text>
                        <v-container fluid>
                            <v-layout row wrap>
                                <v-flex xs12>
                                    <v-text-field name="name" label="Display name" :tabindex="3" @keyup.native.enter="btnClicked" :errors="nameErrors" ref="name" type="text" v-model.trim="name" hint="This is the name you will be referred to, this is not your username" required></v-text-field>
                                </v-flex>
                                <v-flex xs12>
                                    <v-text-field name="password" label="Choose a password" :tabindex="4" @keyup.native.enter="btnClicked" :errors="passErrors" ref="password" type="password" required v-model.trim="password" hint="Should be at least 6 characters"></v-text-field>
                                </v-flex>
                                <v-flex xs12>
                                    <v-text-field name="email" label="Recovery email" :tabindex="5" @keyup.native.enter="btnClicked" :errors="emailErrors" ref="email" required v-model.trim="email" hint="Your recovery email address"></v-text-field>
                                </v-flex>
                                <v-flex xs12>
                                    <v-btn primary @click.native="btnClicked" :tabindex="6" @keyup.native.enter="btnClicked" light>{{btnText}}</v-btn>
                                </v-flex>
                            </v-layout>
                        </v-container>
                    </v-card-text>
                </v-card>
            </v-stepper-content>
            <v-stepper-content step="2">
                <p>
                    <ul>
                        <li v-for="item in agrees">{{item}}</li>
                    </ul>
                    <v-btn primary @click.native="btnClicked" light>{{btnText}}</v-btn>
                </p>
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

import Validator from '../mixins/validator.js'
import { validateRollNumber, postAccountDetails } from '../store/api.js';

export default {
    name: 'register',
    data() {
        return {
            userName: '',
            name: '',
            alert: {
                shown: false,
                message: ''
            },
            password: '',
            email: '',
            userErrors: [],
            nameErrors: [],
            passErrors: [],
            emailErrors: [],
            agrees: [
                'Agree that your account may be deleted should you go against any of these rules',
                'Agree to discuss only matters related to school and studies',
                'To resist from any form insults to staff and students',
                'To show respect to staff who come around to help, keeping in mind that they are not obligated in any way.',
                'To obey common sense',
            ]
        }
    },
    computed: {
        currStep() {
            let step = this.user.step;
            if (step === 1) {
                this.name = this.user.fullName;
            }
            return step;
        },
        user() {
            return this.$store.state.user;
        },
        fullName() {
            let name = this.name;
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
            let data = {};
            let res = false;

            switch (step) {
                case 0:
                    // clear previous errors
                    this.userErrors = [];

                    // validate roll number from server
                    let userName = this.userName;
                    res = this.validate(userName,
                        {
                            required: true
                        }
                    );
                    if (!res.valid) {
                        this.userErrors = [`Rollnumber ${res.message}`];
                        this.$refs['userName'].focus();
                        return;
                    }

                    this.showProgress();
                    validateRollNumber(userName, (err, res) => {
                        this.hideProgress();
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
                    this.userErrors = [];
                    this.passErrors = [];
                    this.emailErrors = [];

                    let name = this.name;

                    res = this.validate(name,
                        {
                            required: true
                        }
                    );
                    if (!res.valid) {
                        this.nameErrors = [`Display name ${res.message}`];
                        this.$refs['name'].focus();
                        return;
                    }

                    let password = this.password;

                    res = this.validate(password,
                        {
                            required: true,
                            min: 6,
                        }
                    );

                    if (!res.valid) {
                        this.passErrors = [`Password ${res.message}`];
                        this.$refs['password'].focus();
                        return;
                    }

                    let email = this.email;

                    res = this.validate(email,
                        {
                            required: true,
                            email: true,
                        }
                    );

                    if (!res.valid) {
                        this.emailErrors = [`Email ${res.message}`];
                        this.$refs['email'].focus();
                        return;
                    }

                    data = {
                        fullName: name,
                        password: password,
                        email: email
                    }
                    this.$store.commit('SET_PAYLOAD', data);

                    break;
                case 2:
                    let reg = this.$store.getters['GET_PAYLOAD'];

                    data = {
                        userName: reg.userName,
                        fullName: reg.fullName,
                        password: reg.password,
                        email: reg.email,
                        class: reg.class,
                        year: reg.year,
                    }
                    this.showProgress();
                    postAccountDetails(data, (err, res) => {
                        this.hideProgress();
                        if (err) {
                            this.alert.message = 'Could not register account';
                            this.alert.shown = true;
                        } else {
                            this.alert.shown = false;
                            this.$store.commit('SET_LOGIN_MESSAGE', 'Registration successful, now you login');
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

.btn {
    clear: right;
    float: right;
}

.cover {
    background-image: url('/assets/images/mypic.jpeg');
    background-repeat: no-repeat;
    background-size: cover;
}

.reg-btn {
    position: absolute;
    right: 10px;
    top: 10px;
}

@media screen and (max-device-width: 768px) {
    .page-content {
        width: 100%;
        min-width: 100% !important;
    }
}
</style>


