<template>
    <div id="create">
    
        <v-stepper v-model="currStep" class="page-content">
            <v-stepper-header>
                <v-stepper-step step="0" :complete="currStep > 0">Choose post type</v-stepper-step>
                <v-divider></v-divider>
                <v-stepper-step step="1" :complete="currStep > 1">Add details</v-stepper-step>
                <v-divider></v-divider>
                <v-stepper-step step="2">Upload files</v-stepper-step>
            </v-stepper-header>
            <v-stepper-content step="0">
                <v-card flat>
                    <v-card-text>
                        <v-select :items="postTypes" v-model="type" label="Please select one" dark single-line auto required></v-select>
                    </v-card-text>
                    <v-btn primary @click.native="btnClicked" light>{{btnText}}</v-btn>
                </v-card>
            </v-stepper-content>
            <v-stepper-content step="1">
                <template v-if="type === 'lecture'">
                    <v-card flat>
                        <v-card-row>
                            <p class="title">Lecture details:</p>
                        </v-card-row>
                        <v-card-row>
                            <v-text-field label="Title for post" counter max="25" autofocus v-model="title"></v-text-field>
                        </v-card-row>
                        <v-card-row>
                            <v-menu lazy :close-on-content-click="true" v-model="menu" transition="v-scale-transition" offset-y :nudge-left="40">
                                <v-text-field slot="activator" label="Date of lecture" v-model="date" prepend-icon="event" readonly></v-text-field>
                                <v-date-picker v-model="date" no-title scrollable>
                                </v-date-picker>
                            </v-menu>
                            <v-select :items="classes" v-model="group" label="Class of lecture" dark single-line auto></v-select>
                        </v-card-row>
                        <v-card-row>
                            <v-text-field name="content" class="content" label="Additional message (not required)" id="content" counter multi-line max="120" v-model="content">
                            </v-text-field>
                        </v-card-row>
                        <v-btn primary @click.native="btnClicked" light>{{btnText}}</v-btn>
                    </v-card>
                </template>
            </v-stepper-content>
            <v-stepper-content step="2">
                <v-card flat>
                    <v-card-text>
                    </v-card-text>
                    <v-btn primary block @click.native="btnClicked" light>{{btnText}}</v-btn>
                </v-card>
            </v-stepper-content>
        </v-stepper>
    
    </div>
</template>

<script>

import { uploadFiles, sendSlide } from '../store/api.js';

export default {
    name: 'create',
    data() {
        return {
            postTypes: [
                {
                    text: 'Lecture Slide',
                    value: 'lecture',
                },
                {
                    text: 'Announcement',
                    value: 'announcement'
                },
            ],
            classes: [
                {
                    text: 'BCA 1st year',
                    value: 'bca1',
                },
                {
                    text: 'BCA 2nd year',
                    value: 'bca2',
                },
                {
                    text: 'BCA 3rd year',
                    value: 'bca3',
                },
                {
                    text: 'MCA 1st year',
                    value: 'mca1',
                },
                {
                    text: 'MCA 2nd year',
                    value: 'mca2',
                },
                {
                    text: 'MCA 3rd year',
                    value: 'mca3',
                },
            ],
            type: '',
            title: '',
            date: '',
            menu: false,
            group: '',
            content: '',
        }
    },
    methods: {
        btnClicked() {
            switch (this.currStep) {
                case 0:
                    let type = this.type;
                    console.log(type);
                    if (type === '' || type === null) {
                        return;
                    }
                    this.$store.commit('SET_TYPE', type);
                    break;
                case 1:
                    let title = this.title;
                    let date = this.date;
                    let content = this.content;
                    let group = this.group;

                    if (this.validate(title, date, group)) {
                        let data = {
                            title,
                            date,
                            content,
                            group,
                        }
                        this.$store.commit('SET_CONTENT', data);
                    }
                default:
                    break;
            }
        },
        validate(...params) {
            let verified = true;
            params.forEach((val) => {
                verified = verified && val && val !== '' && val !== null
            });

            return verified;
        }
    },
    computed: {
        create() {
            return this.$store.state.post.create;
        },
        currStep() {
            return this.create.currStep;
        },
        btnText() {
            switch (this.currStep) {
                case 0:
                case 1:
                    return 'Next';
                case 2:
                    return 'Create new post'
            }
        }
    }
}
</script>

<style scoped>
.page-content {
    width: 90%;
    max-width: 700px;
    margin: 0 auto;
}

.btn {
    clear: right;
    float: right;
}

.content {
    outline: none !important;
    resize: none;
}
</style>


