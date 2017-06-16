<template>
    <div class="profile" v-if="profile">
        <v-layout row wrap>
            <v-flex md4 xs12 class="img-cont" @click="perm ? showEditor() : 0">
                <a class="darken text-xs-center">
                    <div class="img-text" v-if="perm">
                        <v-icon large class="white--text">mode_edit</v-icon>
                    </div>
    
                    <img :src="avatar" width="180px">
                </a>
            </v-flex>
            <v-flex md8 xs12 class="desc">
                <p class="item">
                    <span class="body-2">
                        Display Name:
                    </span>
                    <span class="body-1">
                        {{profile.fullName}}
                    </span>
                </p>
                <p class="item">
                    <span class="body-2">
                        Username:
                    </span>
                    <span class="body-1">
                        {{profile.userName}}
                    </span>
                </p>
                <p class="item">
                    <span class="body-2">
                        Class:
                    </span>
                    <span class="body-1">
                        {{profile.class | capitalize}}
                    </span>
                </p>
                <p class="item" @click="perm ? dialog = true : 0">
                    <span class="body-2">
                        Status:
                    </span>
                    <span class="body-1">
                        {{bio}}
                    </span> &middot;
                    <timeago :since="statusDate" class="caption" :auto-update="60" v-if="profile.statusUpdate"></timeago>
                    <span v-tooltip:top="{ html: 'Change status' }" v-if="perm">
                        <v-btn icon class="primary--text">
                            <v-icon class="edit">mode_edit</v-icon>
                        </v-btn>
                    </span>
                </p>
            </v-flex>
        </v-layout>
        <v-divider class="divider"></v-divider>
        <v-layout row wrap v-if="perm">
            <v-flex xs12>
                <h6 class="title">Activity Feed</h6>
                <div>
                    Activity 1
                </div>
            </v-flex>
        </v-layout>
        <v-layout row justify-center>
            <v-dialog v-model="dialog" persistent :width="500">
                <v-card>
                    <v-card-row>
                        <v-card-title class="primary white--text">Change status</v-card-title>
                    </v-card-row>
                    <v-card-row>
                        <v-card-text>
                            <v-text-field max="125" counter name="status" label="Your status" v-model="status"></v-text-field>
                        </v-card-text>
                    </v-card-row>
                    <v-card-row actions>
                        <v-btn class="warning--text darken-1" flat="flat" @click.native="dialog = false">Cancel</v-btn>
                        <v-btn class="primary--text darken-1" flat="flat" @click.native="saveStatus">Save Status</v-btn>
                    </v-card-row>
                </v-card>
            </v-dialog>
        </v-layout>
        <v-layout row justify-center>
            <v-dialog v-model="imgDialog" persistent :width="500" :height="900">
                <v-card>
                    <v-card-row class="cont">
                        <div class="editorCont">
                            <img ref="editor" id="editor" :src="avatar">
                        </div>
    
                        <div>
                            <v-btn>
                                Upload Avatar
                                <input type="file" name="file" id="file" @change="onChange">
                            </v-btn>
                            <v-btn>
                                Remove Avatar
                            </v-btn>
                        </div>
    
                    </v-card-row>
                    <v-card-text>
                        <v-slider v-model="zoom" dark :max="100" :min="0" :step="5"></v-slider>
                    </v-card-text>
                    <v-card-row actions>
                        <v-btn class="darken-1" flat="flat" @click.native="hideEditor(false)">Cancel</v-btn>
                        <v-btn class="darken-1" flat="flat" @click.native="hideEditor(true)">Save Changes</v-btn>
                    </v-card-row>
                </v-card>
            </v-dialog>
        </v-layout>
    </div>
</template>

<script>

import Cropper from 'cropperjs';

export default {
    name: 'profile',
    props: ['userName'],
    data() {
        return {
            dialog: false,
            status: '',
            file: null,
            imgDialog: false,
            uploadImg: '',
            cropper: null,
            zoom: 50,
            avatarProps: null,
            perm: false,
            profile: null,
        }
    },
    computed: {
        bio() {
            return this.profile.status || '[No status update so far]';
        },
        statusDate() {
            let time = this.profile.statusUpdate;
            return new Date(Number(time));
        },
        avatar() {
            return `/assets/avatars/${this.profile.avatar}`;
        },
    },
    methods: {
        saveStatus() {
            let status = this.status;
            let userName = this.user.userName;
            let data = {
                status,
                userName,
            }
            this.$socket.emit('status', data, (err, res) => {
                this.dialog = false;
            })
        },
        onChange(event) {
            let file = event.target.files[0];
            this.file = file;
            this.readURL(file);
        },
        readURL(file) {
            if (file) {
                var reader = new FileReader();
                reader.onload = (e) => {
                    this.uploadImg = e.target.result;
                }
                reader.readAsDataURL(file);
            }
        },
        uploadStart(event) {
            console.log('start');
        },
        uploadProgress(event) {
            // this.files = this.files.fil
        },
        uploadComplete(event) {
            if (event.success) {
                return this.uploadAvatar();
            }
        },
        uploadError(event) {
            // return this.checkCompleted();
            console.log('error', event.error);
        },
        uploadAvatar() {
            let data = {
                userName: this.$store.state.user.userName,
                avatar: this.file.name,
                props: this.avatarProps,
            }

            this.$socket.emit('avatar', data, (err, res) => {
                this.$store.commit('CHANGE_AVATAR', this.file.name);
            });
        },
        showEditor() {
            this.file = null;
            const editor = this.$refs.editor;
            this.cropper = new Cropper(editor, {
                aspectRatio: 1 / 1,
                crop: function (e) {

                },
                dragMode: 'move',
            });
            this.imgDialog = true;

        },
        hideEditor(opt) {
            this.avatarProps = this.cropper.getData();
            this.cropper.reset();
            this.cropper.clear();
            this.cropper.destroy();
            if (opt && this.file) {
                this.$uploader.submitFiles([this.file]);
            }
            this.imgDialog = false;
        },
        registerUploadEvents() {
            this.$uploader.addEventListener('start', this.uploadStart);
            this.$uploader.addEventListener('progress', this.uploadProgress);
            this.$uploader.addEventListener('complete', this.uploadComplete);
            this.$uploader.addEventListener('error', this.uploadError);
        }
    },
    created() {
        let selfUserName = this.$store.state.user.userName;
        let userName = this.userName || selfUserName;

        if (userName === selfUserName) {
            this.perm = true;
            this.profile = this.$store.state.user;
        } else {
            this.perm = false;
            this.$socket.emit('getProfile', { userName }, (err, res) => {
                this.profile = res;
            });
        }
        this.registerUploadEvents();
    },
    beforeDestroy() {
        this.$uploader.removeEventListener('start', this.uploadStart);
        this.$uploader.removeEventListener('progress', this.uploadProgress);
        this.$uploader.removeEventListener('complete', this.uploadComplete);
        this.$uploader.removeEventListener('error', this.uploadError);
    },
    filters: {
        capitalize(str) {
            return str.toUpperCase();
        }
    },
    watch: {
        zoom(v) {
            if (this.cropper) {
                this.cropper.zoomTo(v / 50);
            }
        },
        uploadImg(url) {
            if (this.cropper) {
                this.cropper.replace(url);
            }
        }
    }
}
</script>

<style scoped>
@import '../assets/cropper.css';

.card {
    width: 100%;
    max-width: 700px;
    margin: 0 auto;
}

.layout {
    display: flex;
}

.flex {
    justify-content: center;
    align-self: center;
}

.username {
    width: 200px;
}

.divider {
    margin-top: 30px;
    margin-bottom: 30px;
    height: 1.5px;
}

.list {
    display: inline-block;
}

.img-cont {
    cursor: pointer;
}

.img-text {
    position: absolute;
    top: 100px;
    left: 100px;
}

a.darken {
    display: inline-block;
    background-color: rgba(0, 0, 0, 0.4);
    padding: 0;
}

a.darken img {
    display: block;
    position: relative;
    -webkit-transition: all 0.8s linear;
    -moz-transition: all 0.8s linear;
    -ms-transition: all 0.8s linear;
    -o-transition: all 0.8s linear;
    transition: all 0.8s linear;
}

a.darken:hover img {
    opacity: 0.8;
}

.flex {
    width: 100%;
}

.edit {
    font-size: 15px;
}

.img-cont {
    position: relative;
}


.editorCont {
    width: 200px;
    height: 200px;
    margin: 30px 30px;
}

#editor {
    max-width: 100%;
}

.cont {
    margin: 20px auto;
}

.btn {
    position: relative;
}

input[type="file"] {
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: 100%;
    cursor: pointer !important;
    opacity: 0;
    z-index: 1;
}
</style>


