<template>
  <v-card hover raised>
    <v-card-row height="200px" class="pa-5 grey lighten-1 cover">
      <div class="display-2 white--text text-xs-center">LOGIN HERE</div>
    </v-card-row>
  </v-card>
</template>

<script>

export default {
  name: 'header',
  data() {
    return {
      message: 'Hey Home!!!'
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

.main-container {
  margin-bottom: 0 !important;
}
</style>


