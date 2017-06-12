<template>
  <div id="recover">
    <v-card hover raised>
      <v-card-row height="200px" class="pa-5 grey lighten-1 cover">
        <div class="display-2 white--text text-xs-center">RECOVER PASSWORD</div>
      </v-card-row>
    </v-card>
  
    <v-card hover raised class="page-content">
      <v-card-text>
        <v-text-field name="email" v-model="email" label="Email" prepend-icon="email" required hint="Enter your email and we will send you new password 😘" type="email"></v-text-field>
      </v-card-text>
  
      <v-btn primary light @click.native="submit">Recover password</v-btn>
    </v-card>
  </div>
</template>

<script>

export default {
  name: 'recover',
  data() {
    return {
      email: ''
    }
  },
  methods: {
    submit() {

    }
  }
}
</script>

<style scoped>
.cover {
  background-image: url('/assets/mypic.jpeg');
  background-repeat: no-repeat;
  background-size: cover;
}

.page-content {
  width: 100%;
  max-width: 700px;
  margin: 0 auto;
}

.btn {
  clear: right;
  float: right;
}
</style>


