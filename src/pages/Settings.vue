<template>
    <div id="settings">
        <v-list three-line subheader>
            <v-subheader>Users and Accounts</v-subheader>
            <v-list-item>
                <v-list-tile avatar>
                    <v-list-tile-action>
                        <v-icon>mail</v-icon>
                    </v-list-tile-action>
                    <v-list-tile-content>
                        <v-list-tile-title>Recovery email</v-list-tile-title>
                        <v-list-tile-sub-title>Change your account recovery email address</v-list-tile-sub-title>
                    </v-list-tile-content>
                </v-list-tile>
            </v-list-item>
            <v-list-item>
                <v-list-tile avatar>
                    <v-list-tile-action>
                        <v-icon>lock</v-icon>
                    </v-list-tile-action>
                    <v-list-tile-content>
                        <v-list-tile-title>Password</v-list-tile-title>
                        <v-list-tile-sub-title>Change your account password</v-list-tile-sub-title>
                    </v-list-tile-content>
                </v-list-tile>
            </v-list-item>
            <v-list-item>
                <v-list-tile avatar>
                    <v-list-tile-action>
                        <v-checkbox v-model="notifications"></v-checkbox>
                    </v-list-tile-action>
                    <v-list-tile-content>
                        <v-list-tile-title>Keep me logged in</v-list-tile-title>
                        <v-list-tile-sub-title>Keep me logged in, until I logout myself</v-list-tile-sub-title>
                    </v-list-tile-content>
                </v-list-tile>
            </v-list-item>
        </v-list>
        <v-divider></v-divider>
        <v-list three-line subheader>
            <v-subheader>General</v-subheader>
            <v-list-item>
                <v-list-tile avatar>
                    <v-list-tile-action>
                        <v-checkbox v-model="notifications"></v-checkbox>
                    </v-list-tile-action>
                    <v-list-tile-content>
                        <v-list-tile-title>Notifications</v-list-tile-title>
                        <v-list-tile-sub-title>Send me notifications about chats and post updates</v-list-tile-sub-title>
                    </v-list-tile-content>
                </v-list-tile>
            </v-list-item>
            <v-list-item>
                <v-list-tile avatar>
                    <v-list-tile-action>
                        <v-checkbox v-model="sound"></v-checkbox>
                    </v-list-tile-action>
                    <v-list-tile-content>
                        <v-list-tile-title>Sound</v-list-tile-title>
                        <v-list-tile-sub-title>Play a notification tone for notifications</v-list-tile-sub-title>
                    </v-list-tile-content>
                </v-list-tile>
            </v-list-item>
            <v-list-item>
                <v-list-tile avatar>
                    <v-list-tile-action>
                        <v-checkbox v-model="email"></v-checkbox>
                    </v-list-tile-action>
                    <v-list-tile-content>
                        <v-list-tile-title>Email</v-list-tile-title>
                        <v-list-tile-sub-title>Send me emails about important posts and announcements</v-list-tile-sub-title>
                    </v-list-tile-content>
                </v-list-tile>
            </v-list-item>
        </v-list>
    </div>
</template>

<script>

export default {
    name: 'settings',
    data() {
        return {
            notifications: false,
            sound: true,
            widgets: false,
        }
    }
}
</script>

<style>

</style>


