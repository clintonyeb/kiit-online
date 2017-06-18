<template>
    <v-navigation-drawer id="side-bar" persistent light :enable-resize-watcher="sidebar.resizeWatcher" :mini-variant.sync="sidebar.mini" v-model="sidebar.drawer">
        <v-list class="pa-0">
            <v-list-item>
                <router-link to="/settings">
                    <v-list-tile avatar tag="div">
                        <v-list-tile-avatar>
                            <img :src="avatar" />
                        </v-list-tile-avatar>
                        <v-list-tile-content>
                            <v-list-tile-title>{{fullName}}</v-list-tile-title>
                            <v-list-tile-sub-title>{{userName}}</v-list-tile-sub-title>
                        </v-list-tile-content>
                    </v-list-tile>
                </router-link>
            </v-list-item>
    
        </v-list>
        <v-list class="pt-0">
    
            <v-divider></v-divider>
    
            <v-list-item v-for="item in sidebar.items" :key="item">
                <router-link :to="item.path">
                    <v-list-tile :class="{'primary lighten-2 white--text': $route.name.search(item.name) !== -1 }">
                        <v-list-tile-action>
                            <v-icon :class="{'white--text': $route.name == item.name}">{{ item.icon }}</v-icon>
                        </v-list-tile-action>
                        <v-list-tile-content>
                            <v-list-tile-title>{{ item.title }}</v-list-tile-title>
                        </v-list-tile-content>
                    </v-list-tile>
                </router-link>
            </v-list-item>
        </v-list>
    </v-navigation-drawer>
</template>

<script>

export default {
    name: 'side-bar',
    data() {
        return {}
    },
    computed: {
        userName() {
            return this.user.userName || 'Roll number';
        },
        fullName() {
            return this.user.fullName || 'Full name';
        },
        avatar() {
            return `/assets/avatars/${this.user.avatar}`;
        },
        user() {
            return this.$store.state.user;
        },
        sidebar() {
            return this.$store.state.layout.sidebar;
        }
    },
    destroyed() {
        let overlay = document.querySelector('.overlay.overlay--active');
        if (overlay) {
            let parent = overlay.parentNode;
            parent.removeChild(overlay);
        }
    }
}
</script>

<style>

</style>


