export default {
  methods: {
    showProgress(message) {
      if (message) {
        this.$store.commit('SHOW_PROGRESS', message);
      } else {
        this.$store.commit('SHOW_PROGRESS', true);
      }
    },
    hideProgress() {
      this.$store.commit('SHOW_PROGRESS', false);
    },
    preview(file) {
      const re = /(?:\.([^.]+))?$/;
      const ext = re.exec(file)[1];
      return `/assets/previews/${ext}.svg`;
    },
    formatBytes(bytes, decimals) {
      if (bytes === 0) return '0 Bytes';
      const k = 1000;
      const dm = decimals || 2;
      const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
      const i = Math.floor(Math.log(bytes) / Math.log(k));
      return `${parseFloat((bytes / (k ** i)).toFixed(dm))} ${sizes[i]}`;
    },
    showToast(mess) {
      this.$store.commit('SHOW_SNACK', mess);
    },
  },
};
