<template>
  <v-layout row wrap>
    <v-flex xs12 class="section">
      <h5 class="medium">Users and Accounts</h5>
      <v-expansion-panel>
        <v-expansion-panel-content>
          <div slot="header">I have forgotten my password, what should I do?</div>
          <v-card>
            <v-card-text class="grey lighten-3">
              <span class="body-1">If you have forgotten your password, that's not the end of the
                <i>world</i>, we can help you recover your account.</span>
              <br>
              <br>
              <ol>
                <li>Visit the
                  <router-link to="/login">login page</router-link>
                </li>
                <li>Click on the
                  <strong>forgot password link</strong>
                </li>
                <li>Provide the
                  <strong>email address</strong> you provided during your registration</li>
                <li>Submit your request</li>
                <li>We will email you recovery instructions</li>
                <li>Follow the recovery instructions to recover your password</li>
              </ol>
            </v-card-text>
          </v-card>
        </v-expansion-panel-content>
        <v-expansion-panel-content>
          <div slot="header">I do not know or have my roll number, how do I register for an account?</div>
          <v-card>
            <v-card-text class="grey lighten-3">
              <span class="body-1">
                If you do not know or have your roll number, there's little we can do to help you. Please contact your academic department.
              </span>
            </v-card-text>
          </v-card>
        </v-expansion-panel-content>
        <v-expansion-panel-content>
          <div slot="header">I have forgotten my password and recovery email address, what should I do?</div>
          <v-card>
            <v-card-text class="grey lighten-3">
              <span class="body-1">
                If you have forgotten both your password and your recovery email address, it's Ok. Find our email address below this help section and write to us with the following details
              </span>
              <br>
              <br>
              <ol>
                <li>Full name</li>
                <li>Course</li>
                <li>Registered roll number</li>
              </ol>
              <br>
              <span class="body-1">
                One of our team members will contact you and help you through recovering your account as soon as possible.
              </span>
            </v-card-text>
          </v-card>
        </v-expansion-panel-content>
        <v-expansion-panel-content>
          <div slot="header">I want to disable my account</div>
          <v-card>
            <v-card-text class="grey lighten-3">
              <span class="body-1">
                If for any reason you want to disable your account, go to the settings section and find a link to disable your account.
              </span>
              <br>
              <br>
              <span class="body-1">
                You will be authenticated again
              </span>
            </v-card-text>
          </v-card>
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-flex>
  
    <v-flex xs12 class="section">
      <h5 class="medium">Notifications</h5>
      <v-expansion-panel>
        <v-expansion-panel-content>
          <div slot="header">I receive too many notifications, what should I do?</div>
          <v-card>
            <v-card-text class="grey lighten-3">
              <span class="body-1">
                We understand that different people have different preferences. We have carefully chosen default settings that can be applied to a general set of people. You're welcome to change them to better suit your needs.
              </span>
              <br>
              <br>
              <span class="body-1">
                In the settings section, you can change all the default settings. Once you've saved your changes, these changes will take effect.
              </span>
            </v-card-text>
          </v-card>
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-flex>
  
    <v-flex xs12 class="section">
      <h5 class="medium">General</h5>
    </v-flex>
  </v-layout>
</template>

<script>


export default {
  name: 'help',
  data() {
    return {}
  }
}
</script>

<style scoped>
.section {
  margin-top: 10px;
  margin-bottom: 10px;
}
</style>


