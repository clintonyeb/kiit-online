<template>
  <v-footer class="pa-3 footer hidden-sm-and-down">
    <v-spacer></v-spacer>
    <div>© KIIT University</div>
  </v-footer>
</template>

<script>

export default {
  name: 'footer',
  data() {
    return {
      message: 'Hey Home!!!'
    }
  }
}
</script>

<style scoped>
.footer {
  position: fixed;
  bottom: 0;
  right: 0;
}
</style>


