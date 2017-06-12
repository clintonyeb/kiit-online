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
                    <v-card-row ref="doc" class="document" @drop="drop" @dragover.prevent="dragOver" @dragleave.prevent="dragLeave">
                        <input type="file" name="file" @change="onChange">
                        <h6 class="body-2">
                            Drop files here
                        </h6>
                        <p>or</p>
                        <h6 class="body-2">
                            <i class="material-icons">file_upload</i>
                            Click to upload files
                        </h6>
                    </v-card-row>
    
                    <v-card-row id="files" v-for="(file, index) in files" :key="file.name">
                        <span>
                            <v-chip close @input="removeFile(index)">
                                <v-avatar class="teal">{{++index}}</v-avatar>
                                {{file.name}}
                            </v-chip>
                            <span class="faded">{{formatBytes(file.size)}}</span>
                        </span>
                    </v-card-row>
    
                    <v-btn primary @click.native="btnClicked" light>{{btnText}}</v-btn>
    
                </v-card>
            </v-stepper-content>
        </v-stepper>
    
    </div>
</template>

<script>

import { Uploader } from '../store/api.js';

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
            files: [],
            uploader: null,
            step: 0,
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
                    this.step = 1;
                    break;
                case 1:
                    if (this.validate(this.title, this.date, this.group)) {
                        this.step = 2;
                    }
                    break;
                case 2:
                    // send files here
                    /*this.uploader.sendFiles(this.files, (err, res) => {

                    });*/

                    // add file paths to data before sending
                    // send data
                    let data = {
                        title: this.title,
                        date: this.date,
                        group: this.group,
                        content: this.content || '',
                        files: [],
                        userName: this.$store.state.user.userName,
                        type: this.type,
                    }
                    this.$socket.emit('post', data, (err, res) => {
                        if (res === 'done') {
                            this.$router.push('/');
                        }
                    });
                    this.step = 3;
                    break;
                default:
                    break;
            }
        },
        validate(...params) {
            let verified = true;
            params.forEach((val) => {
                verified = verified && val && val !== '' && val !== null && val !== undefined
            });

            return verified;
        },
        drop(event) {
            this.$refs.doc.classList.remove('drag-over');
            event.preventDefault();
            event.stopPropagation();
            let files = event.dataTransfer.files;
            this.files.push(...files);
        },
        removeFile(index) {
            this.files.splice(index, 1);
        },
        onChange(event) {
            let files = event.target.files;
            this.files.push(...files);
        },
        dragOver(event) {
            this.$refs.doc.classList.add('drag-over');
        },
        dragLeave(event) {
            this.$refs.doc.classList.remove('drag-over');
        },
        formatBytes(a, b) { if (0 == a) return "0 Bytes"; var c = 1e3, d = b || 2, e = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"], f = Math.floor(Math.log(a) / Math.log(c)); return parseFloat((a / Math.pow(c, f)).toFixed(d)) + " " + e[f] },

    },
    computed: {
        btnText() {
            switch (this.currStep) {
                case 0:
                case 1:
                    return 'Next';
                case 2:
                    return 'Create post'
            }
        },
        currStep() {
            return this.step;
        }
    },
    mounted() {
        this.uploader = Uploader(this.$socket);
    },
    beforeDestroy() {
        this.uploader.destroy();
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

.content {
    outline: none !important;
    resize: none;
}

.document {
    border: 2px dashed #DADADA;
    text-align: center;
    display: block;
    padding: 5px;
    position: relative;
    margin: 10px;
}

#files {
    cursor: pointer;
    margin: 10px;
    margin-bottom: 20px;
}

input[type="file"] {
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: 100%;
    cursor: pointer;
    opacity: 0;
}

.document:hover {
    box-shadow: 2px 2px 1px #000, 1px 1px 2px #DADADA;
}

.drag-over {
    box-shadow: 2px 2px 1px #000, 1px 1px 2px #DADADA;
}
</style>


