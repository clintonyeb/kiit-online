<template>
    <div id="create">
    
        <v-stepper v-model="currStep" class="page-content">
            <v-stepper-header>
                <v-stepper-step step="0" :complete="currStep > 0">Choose type</v-stepper-step>
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
                            <v-text-field label="Title for post" :errors="titleErrors" ref="title" counter max="25" autofocus v-model="title"></v-text-field>
                        </v-card-row>
                        <v-card-row>
                            <v-menu lazy :close-on-content-click="true" v-model="menu" transition="v-scale-transition" offset-y :nudge-left="40">
                                <v-text-field slot="activator" label="Date of lecture" ref="date" :errors="dateErrors" v-model="date" prepend-icon="event" readonly></v-text-field>
                                <v-date-picker v-model="date" no-title scrollable>
                                </v-date-picker>
                            </v-menu>
                            <v-select :items="classes" v-model="group" ref="group" label="Class of lecture" :errors="classErrors" dark single-line auto></v-select>
                        </v-card-row>
                        <v-card-row>
                            <v-text-field name="content" ref="content" :errors="contentErrors" class="content" label="Additional message (not required)" id="content" counter multi-line max="120" v-model="content">
                            </v-text-field>
                        </v-card-row>
                        <v-btn primary @click.native="btnClicked" light>{{btnText}}</v-btn>
                    </v-card>
                </template>
            </v-stepper-content>
            <v-stepper-content step="2">
                <v-card flat>
                    <v-card-row ref="doc" class="document" @drop="drop" @dragover.prevent="dragOver" @dragleave.prevent="dragLeave">
                        <input type="file" name="file" @change="onChange" accept="application/*,text/*,image/*">
                        <h6 class="body-2">
                            Drop files here
                        </h6>
                        <p>or</p>
                        <h6 class="body-2">
                            <i class="material-icons">file_upload</i>
                            Click to upload files
                        </h6>
                    </v-card-row>
    
                    <v-card-row id="files" v-for="item in files" :key="item.id">
                        <span>
                            <v-chip close @input="removeFile(item.id)" :class="item.checked ? 'primary' : 'red'">
                                <v-avatar class="teal">
                                    <v-icon>{{item.checked ? 'done' : 'clear'}}</v-icon>
                                </v-avatar>
                                {{item.file.name}}
                            </v-chip>
                            <span class="faded">{{formatBytes(item.file.size)}}</span>
                            <span v-if="!item.checked"> &gt; 10MB</span>
                        </span>
                    </v-card-row>
    
                    <v-btn primary @click.native="btnClicked" light>{{btnText}}</v-btn>
    
                </v-card>
            </v-stepper-content>
        </v-stepper>
    
    </div>
</template>

<script>
import Validator from '../mixins/validator.js'


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
            date: new Date().toISOString().substr(0, 10),
            menu: false,
            group: '',
            content: '',
            files: [],
            step: 0,
            sentFiles: [],
            errorFiles: [],
            titleErrors: [],
            dateErrors: [],
            classErrors: [],
            contentErrors: [],
            fileId: 1,
        }
    },
    methods: {
        btnClicked() {
            let res = false;

            switch (this.currStep) {
                case 0:
                    let type = this.type;
                    res = this.validate(type, {
                        required: true,
                    });

                    if (res.valid) {
                        this.step = 1;
                    }
                    break;
                case 1:

                    // remove errors
                    this.titleErrors = [];
                    this.dateErrors = [];
                    this.classErrors = [];
                    this.contentErrors = [];

                    let title = this.title;
                    res = this.validate(title, {
                        required: true,
                        max: 25,
                    });

                    if (!res.valid) {
                        this.titleErrors = [`Title ${res.message}`];
                        this.$refs['title'].focus();
                        return;
                    }

                    let date = this.date;
                    res = this.validate(date, {
                        required: true,
                        date: true,
                        dateMax: new Date(),
                    })

                    if (!res.valid) {
                        this.dateErrors = [`Date ${res.message}`];
                        this.$refs['date'].focus();
                        return;
                    }

                    let group = this.group;
                    res = this.validate(group, {
                        required: true,
                    });
                    if (!res.valid) {
                        this.classErrors = [`Class ${res.message}`];
                        this.$refs['group'].focus();
                        return;
                    }

                    let content = this.content;
                    res = this.validate(content, {
                        max: 120,
                    });

                    if (!res.valid) {
                        this.contentErrors = [`${res.message}`];
                        this.$refs['content'].focus();
                        return;
                    }

                    this.step = 2;

                    break;
                case 2:
                    this.showProgress('Uploading files');
                    // send files here
                    let files = this.files.map((f) => {
                        return f.file;
                    })
                    this.$uploader.submitFiles(files);
                    break;
                default:
                    break;
            }
        },
        drop(event) {
            this.$refs.doc.classList.remove('drag-over');
            event.preventDefault();
            event.stopPropagation();
            let files = event.dataTransfer.files;
            this.addFiles(files);
        },
        removeFile(id) {
            this.files = this.files.filter((file) => {
                return file.id !== id;
            })
        },
        addFiles(files) {
            files = Array.from(files).map((file) => {
                let ch = this.validate(file, {
                    fileSize: true,
                });
                let res = {
                    file: file,
                    id: this.fileId++,
                    checked: ch.valid,
                }
                return res;
            })
            console.log(files);
            this.files.push(...files);
        },
        onChange(event) {
            let files = event.target.files;
            this.addFiles(files);
        },
        dragOver(event) {
            this.$refs.doc.classList.add('drag-over');
        },
        dragLeave(event) {
            this.$refs.doc.classList.remove('drag-over');
        },
        registerUploadEvents() {
            this.$uploader.addEventListener('start', this.uploadStart);
            this.$uploader.addEventListener('progress', this.uploadProgress);
            this.$uploader.addEventListener('complete', this.uploadComplete);
            this.$uploader.addEventListener('error', this.uploadError);
        },
        uploadStart(event) {
            console.log('start');
        },
        uploadProgress(event) {
            console.log('progress');
        },
        uploadComplete(event) {
            if (event.success) {
                this.sentFiles.push(event.file);
                return this.checkCompleted();
            }
        },
        uploadError(event) {
            console.log(event);
            this.errorFiles.push(event.file);
            return this.checkCompleted();
        },
        checkCompleted() {
            if (this.sentFiles.length + this.errorFiles.length === this.files.length) {
                // completed
                this.hideProgress();
                if (this.errorFiles.length == 0) {
                    return this.sendPost();
                }
                return this.showError();
            }
            return;
        },
        sendPost() {
            let files = this.files.map((f) => {
                return f.file.name;
            })
            let data = {
                title: this.title,
                date: this.date,
                group: this.group,
                content: this.content || '',
                files: files,
                userName: this.$store.state.user.userName,
                type: this.type,
            }
            this.showProgress('Submitting post');
            this.$socket.emit('post', data, (err, res) => {
                this.hideProgress();
                if (res !== 'error') {
                    this.$store.commit('SOCKET_POSTMORE', res);
                    this.$router.push('/');
                }
            });
        },
        showError() {
            console.log('showing error');
        },
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
    created() {
        this.registerUploadEvents();
    },
    beforeDestroy() {
        this.$uploader.removeEventListener('start', this.uploadStart);
        this.$uploader.removeEventListener('progress', this.uploadProgress);
        this.$uploader.removeEventListener('complete', this.uploadComplete);
        this.$uploader.removeEventListener('error', this.uploadError);
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


