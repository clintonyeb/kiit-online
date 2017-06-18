<template>
    <v-card hover raised>
        <v-card-text class="pa-5 grey lighten-4 text--darken-4">
            <v-layout row wrap>
                <v-flex md4 xs12>
                    <div class="imageCont" v-if="profile">
                        <div style="width:180px; margin: 0 auto;">
                            <img :src="avatar" width="180px">
                        </div>
                        <div style="width:180px; margin: 0 auto;">
                            <v-btn v-if="perm" class="primary avatarBtn" light @click.native="showEditor">
                                Change Avatar
                            </v-btn>
                        </div>
                    </div>
                </v-flex>
    
                <v-flex md7 xs12>
                    <div class="textCont text-xs-center" v-if="profile">
                        <p class="item">
                            <span class="display-1">
                                {{profile.fullName}}
                            </span>
                        </p>
                        <p class="item">
                            <span class="title">
                                {{profile.userName}}
                            </span>
                        </p>
                        <p class="item">
                            <span class="title">
                                {{profile.class | capitalize}}
                            </span>
                        </p>
                    </div>
                </v-flex>
            </v-layout>
        </v-card-text>
        <v-layout row justify-center>
            <v-dialog v-model="imgDialog" persistent :width="600" :height="200">
                <v-card>
                    <v-card-row>
                        <v-card-title class="primary white--text">Upload avatar</v-card-title>
                    </v-card-row>
                    <v-card-row class="cont pa-5">
                        <div class="editorCont">
                            <img ref="editor" id="editor" :src="avatar">
                        </div>
                        <div>
                            <v-btn class="primary" light>
                                Upload Avatar
                                <input type="file" name="file" id="file" @change="onChange">
                            </v-btn>
                            <v-btn class="red" light>
                                Remove Avatar
                            </v-btn>
                        </div>
    
                    </v-card-row>
                    <v-card-text>
                        <v-slider v-model="zoom" dark :max="10" :min="0" :step="1"></v-slider>
                    </v-card-text>
                    <v-card-row actions>
                        <v-btn class="red" light @click.native="hideEditor(false)" style="margin: 0 10px 0 0">Cancel</v-btn>
                        <v-btn class="primary" light @click.native="hideEditor(true)" style="margin:0 10px 0 10px">Save Changes</v-btn>
                    </v-card-row>
                </v-card>
            </v-dialog>
        </v-layout>
    </v-card>
</template>

<script>
import Cropper from 'cropperjs';

export default {
    name: 'profile',
    props: {
        userName: {
            type: String,
            required: false,
        },
        display: {
            type: String,
            required: false,
        },
        perm: {
            type: Boolean,
            required: false,
            default: false,
        },
    },
    data() {
        return {
            dialog: false,
            status: '',
            file: null,
            imgDialog: false,
            uploadImg: '',
            cropper: null,
            zoom: 5,
            avatarProps: null,
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
            return this.profile.avatar ? `/assets/dp/${this.profile.avatar}` : `/assets/avatars/${this.profile.avatar}`;
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
            this.zoom = 5;
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
                this.profile.avatar = this.file.name;
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
            this.zoom = 5;
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

        if (this.perm) {
            this.profile = this.$store.state.user;
        } else {
            let userName = this.userName;
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
                this.cropper.zoomTo(v / 5);
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

.imageCont {
    display: block;
}

.imageCont img {
    border-radius: 10px;
}

.avatarBtn {
    margin: 0 auto;
    width: 180px;
}

.flex {
    justify-content: center;
    align-self: center;
}

@media only screen and (max-device-width: 768px) {
    .textCont {
        margin-top: 20px !important;
    }
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

.editorCont {
    width: 200px;
    height: 200px;
    margin: 30px 30px;
}

#editor {
    max-width: 100%;
}
</style>


