drop(event) {
  if (this.loading) return;
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
  if (this.loading) return;
  let files = event.target.files;
  this.files.push(...files);
},
dragOver(event) {
  if (this.loading) return;
  this.$refs.doc.classList.add('drag-over');
},
dragLeave(event) {
  if (this.loading) return;
  this.$refs.doc.classList.remove('drag-over');
},
reset(event) {
  if (this.loading) return;
  this.files = [];
  this.content = '';
},
submit(event) {
  if (this.loading) return;
  this.preSubmit();

  let resultLen = 0;
  let filesLen = this.files.length;
  let documents = [];

  uploadFiles(this.files, (err, res, name) => {

    if (!err) {
      this.removeFile(res);
      documents[res] = name;
    }

    ++resultLen;

    if (resultLen >= filesLen) {
      if (this.files.length == 0) {

        // all files uploaded, now send slide to server
        let payload = {
          title: this.title,
          documents: documents,
          content: this.content,
          userName: this.$store.state.user.userName
        }

        this.$socket.emit('addSlide', payload);
        return this.clearLoading('', false);
        /*sendSlide(payload, (err, res) => {
            if (err) {
                console.log(err);
                return this.clearLoading('Error submitting slide');
            }

            // slide sent, now go home
            return this.navigateToHome();
        })*/

      } else {
        return this.clearLoading('Error uploading some files');
      }
    }
  })
},

preSubmit() {
  this.loading = true;
  this.progress = true;
  this.$refs.card.classList.add('faded-content');
},

clearLoading(message, snack = true) {
  this.loading = false;
  this.snackbar.text = message;
  this.snackbar.visibility = snack;
  this.progress = false;
  this.$refs.card.classList.remove('faded-content');
  this.submitBtn = 'Retry';
},

navigateToHome() {
  this.snackbar.text = 'Slide successfully sent';
  this.snackbar.visibility = true;
  return this.$router.replace('/');
},

formatBytes(a, b) { if (0 == a) return "0 Bytes"; var c = 1e3, d = b || 2, e = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"], f = Math.floor(Math.log(a) / Math.log(c)); return parseFloat((a / Math.pow(c, f)).toFixed(d)) + " " + e[f] }



.document {
  border: 2px dashed #DADADA;
  text - align: center;
  display: block;
  padding: 10px;
  position: relative;
}

#files {
  display: inline - block;
  cursor: pointer;
}

input[type = "file"] {
  position: absolute;
  top: 0;
  left: 0;
  height: 100 %;
  width: 100 %;
  cursor: pointer;
  opacity: 0;
}

.document: hover {
  box - shadow: 2px 2px 1px #000, 1px 1px 2px #DADADA;
}

.drag - over {
  box - shadow: 2px 2px 1px #000, 1px 1px 2px #DADADA;
}

.faded {
  color: #DADADA;
  /*font-size: 4px;*/
}

.add - btn {
  margin: 0 auto;
  display: inline - block;
  line - height: 2;
  text - align: center;
}

.add - btn:nth - child(1) {
  width: 40 %;
}

.add - btn:nth - child(2) {
  width: 50 %;
}

.line {
  margin - top: 10px;
  margin - bottom: 10px;
  height: 1px;
}

.faded - content {
  opacity: .3;
  pointer - events: none;
}

#create {
  position: relative;
}


<form>
  <v-card flat ref="card">
    <v-card-row>
      <v-text-field name="title" label="Title" counter max="25" autofocus id="title" v-model="title"></v-text-field>
    </v-card-row>

    <v-card-row ref="doc" class="document" @drop="drop" @dragover.prevent="dragOver" @dragleave.prevent="dragLeave">
                    <input type="file" name="file" @change="onChange">
                    <h4 class="display-1">
      Drop files here
                    </h4>
    <p>or</p>
    <h4 class="display-1">
      <i class="material-icons">file_upload</i>
      Click to upload files
                    </h4>
                </v-card-row>
    
  <v-card-row id="files" v-for="(file, index) in files" :key="file.name">
                    <span>
    <v-chip close @input="removeFile(index)">
                            <v-avatar class="teal">{{++index}}</v-avatar>
    {{ file.name }}
                        </v-chip>
  <span class="faded">{{ formatBytes(file.size)}}</span>
                    </span>
                </v - card - row >

  <v-card-row v-if="files.length > 0 && title">
    <v-text-field name="content" label="Short description(not required)" id="content" counter multi-line max="120" v-model="content">
    </v-text-field>
  </v-card-row>
  <v-card-row v-if="files.length > 0 && title" class="btn-container">
    <v-btn error light class="add-btn" @click.native="reset">Reset</v-btn>
  <v-btn primary light class="add-btn" @click.native="submit" > {{submitBtn }}</v - btn >
                </v - card - row >
            </v - card >
        </form >