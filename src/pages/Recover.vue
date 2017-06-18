<template>
  <div id="recover">
    <v-card hover raised>
      <v-card-row height="200px" class="pa-5 grey lighten-1 cover">
        <div class="display-2 white--text text-xs-center">LOGIN HERE</div>
      </v-card-row>
    </v-card>
  
    <v-card hover raised class="page-content">
      <v-card-text>
        <v-text-field name="userName" v-model.trim="userName" ref="userName" :errors="userErrors" label="Roll number" prepend-icon="user" required hint="Enter your roll number and we will send you new password 😘" :type="text"></v-text-field>
        <div>
          <v-btn block primary light large @click.native="submit">Recover password</v-btn>
        </div>
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
import Validator from '../directives/validator.js'
import { recoverPass } from '../store/api.js';

export default {
  name: 'recover',
  data() {
    return {
      userName: '',
      userErrors: [],
    }
  },
  methods: {
    submit() {
      let userName = this.userName;

      let res = this.validate(userName,
        {
          required: true,
        }
      );

      if (!res.valid) {
        this.emailErrors = [`Username ${res.message}`];
        this.$refs['userName'].focus();
        return;
      }

      recoverPass({
        userName,
      }, (err, res) => {
        console.log('password recovered');
      });
    }
  },
  mixins: [Validator],
}
</script>

<style scoped>
.cover {
  background-image: url('/assets/images/mypic.jpeg');
  background-repeat: no-repeat;
  background-size: cover;
}

.page-content {
  width: 100%;
  max-width: 700px;
  margin: 0 auto;
}
</style>


