<template>
    <v-toolbar fixed class="primary darken-4" id="toolbar">
        <v-toolbar-side-icon light @click.native.stop="$store.commit('TOGGLE_DRAWER')"></v-toolbar-side-icon>
        <v-toolbar-title class="white--text">{{title}}</v-toolbar-title>
        <v-toolbar-items>
            <v-toolbar-item to="/create" v-if="title != 'Add New Slide'">
                <v-btn icon light v-tooltip:left="{ html: 'Create a slide' }">
                    <v-icon>add</v-icon>
                </v-btn>
            </v-toolbar-item>
            <v-menu bottom left offset-y origin="center center" transition="v-scale-transition">
                <v-btn icon @click.native="menuClicked" light v-tooltip:left="{html: 'View notifications'}" slot="activator">
                    <v-icon :class="{'red--text': notifies}">{{notifies ? 'notifications_active' : 'notifications_none'}}</v-icon>
                    <sub class="badge" v-if="notifies">
                        <strong>{{notifies}}</strong>
                    </sub>
                </v-btn>
                <v-list dense v-if="notifies">
                    <v-list-item v-for="item in notifications" v-bind:key="item.key" @click="menuItem(item.key)">
                        <v-list-tile>
                            <v-list-tile-action>
                                <v-icon>message</v-icon>
                            </v-list-tile-action>
                            <v-list-tile-content>
                                <v-list-tile-title v-html="item.header"></v-list-tile-title>
                            </v-list-tile-content>
                        </v-list-tile>
                    </v-list-item>
                </v-list>
            </v-menu>
        </v-toolbar-items>
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
                    return 'Create New Post';
                case 'chat':
                    return "Chat Room";
                case 'login':
                    return "Login in Here";
                default:
                    return '';
            }
        },
        notifies() {
            return this.notifications.chat ? this.notifications.chat.length : 0;
        },
        notifications() {
            return this.$store.state.layout.notifications;
        },
    },
    methods: {
        menuClicked() {
            this.$store.commit('NOTIFY_CLEAR');
        },
        menuItem(key) {
            switch (key) {
                case 'chat':
                    this.$router.push('/chat');
                    break;

                default:
                    break;
            }
        }
    }
}
</script>

<style>
/*.drop-menu {
    position: relative;
}

.dropdown {
    position: fixed;
    left: 50%;
}*/

.badge {
    font-size: 13px;
    background-color: transparent !important;
}
</style>


