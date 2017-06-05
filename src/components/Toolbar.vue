<template>
    <v-toolbar fixed class="primary darken-4" id="toolbar">
        <v-toolbar-side-icon light @click.native.stop="$store.commit('TOGGLE_DRAWER')"></v-toolbar-side-icon>
        <v-toolbar-title class="white--text">{{title}}</v-toolbar-title>
        <v-spacer></v-spacer>
        <router-link to="/add" v-if="title != 'Add New Slide'">
            <v-btn icon light title="Create a slide">
                <v-icon>add</v-icon>
            </v-btn>
        </router-link>
        <v-btn icon light title="Notifications">
            <v-icon>notifications_none</v-icon>
            <sup>
                <strong>0</strong>
            </sup>
        </v-btn>
    </v-toolbar>
</template>

<script>

export default {
    name: 'toolbar',
    data() {
        return {
        }
    },
    computed: {
        title() {
            let name = this.$route.name;

            switch (name) {
                case 'index':
                case 'index2':
                    return 'Home';
                case 'profile':
                    return 'Profile';
                case 'settings':
                    return 'Settings';
                case 'terms':
                    return 'Terms and Conditions';
                case 'add':
                    return 'Add New Slide';
                case 'chat':
                    return "Chat Room";
                case 'login':
                    return "Login in Here";
                default:
                    return '';
            }
        }
    }
}
</script>

<style>

</style>


