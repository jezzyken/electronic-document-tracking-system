<template>
  <v-app-bar app flat color="white" elevation="1">
    <v-container class="d-flex align-center">
      <router-link to="/" class="text-decoration-none">
        <v-img
          src="@/assets/logo.png"
          max-width="40"
          class="mr-4"
          contain
        ></v-img>
      </router-link>
      <v-spacer></v-spacer>
      <v-btn text to="/">Home</v-btn>
      <v-btn text to="/track">Track Document</v-btn>
      <v-btn text to="/request">Request Document</v-btn>
    </v-container>
  </v-app-bar>
</template>

<script>
export default {
  name: 'NavBar'
}
</script>