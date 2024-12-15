<template>
  <v-app>
    <v-app-bar app flat color="white" elevation="1">
      <v-container class="d-flex align-center px-0 px-sm-3">
        <router-link to="/" class="text-decoration-none d-flex align-center">
          <v-avatar
            color="primary"
            size="40"
            class="mr-2"
          >
            <span class="white--text text-h6">GIT</span>
          </v-avatar>
          <span class="text-body-2 primary--text font-weight-medium text-uppercase">Glan Institute of Technology</span>
        </router-link>
        <v-spacer></v-spacer>

        <div class="d-none d-md-flex">
          <v-btn text to="/">Home</v-btn>
          <v-btn text to="/track">Track Document</v-btn>
          <v-btn text to="/request">Request Document</v-btn>
          <v-btn text to="/login" color="primary">Admin Login</v-btn>
        </div>

        <v-app-bar-nav-icon 
          class="d-md-none"
          @click="drawer = !drawer"
        ></v-app-bar-nav-icon>
      </v-container>
    </v-app-bar>

    <v-navigation-drawer
      v-model="drawer"
      app
      temporary
      left
    >
      <v-list nav>
        <v-list-item to="/" link>
          <v-list-item-icon>
            <v-icon>mdi-home</v-icon>
          </v-list-item-icon>
          <v-list-item-title>Home</v-list-item-title>
        </v-list-item>

        <v-list-item to="/track" link>
          <v-list-item-icon>
            <v-icon>mdi-file-document-outline</v-icon>
          </v-list-item-icon>
          <v-list-item-title>Track Document</v-list-item-title>
        </v-list-item>

        <v-list-item to="/request" link>
          <v-list-item-icon>
            <v-icon>mdi-file-plus-outline</v-icon>
          </v-list-item-icon>
          <v-list-item-title>Request Document</v-list-item-title>
        </v-list-item>

        <v-list-item to="/login" link>
          <v-list-item-icon>
            <v-icon>mdi-login</v-icon>
          </v-list-item-icon>
          <v-list-item-title>Admin Login</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-main>
      <router-view></router-view>
    </v-main>
  </v-app>
</template>

<script>
export default {
  name: 'PublicLayout',
  data: () => ({
    drawer: false
  })
}
</script>

<style scoped>
@media (max-width: 600px) {
  .text-h6 {
    font-size: 1.1rem !important;
  }
  
  .v-avatar {
    width: 35px !important;
    height: 35px !important;
  }
}
</style>