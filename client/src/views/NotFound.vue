<template>
  <div class="not-found-container">
    <v-container class="text-center">
      <v-row justify="center" align="center" class="fill-height">
        <v-col cols="12" md="8">
          <div class="not-found-content">
            <h1 class="text-h2 font-weight-bold mb-4">404</h1>
            <div class="text-h4 mb-6">Page Not Found</div>

            <v-img
              src="@/assets/404.svg"
              max-width="400"
              class="mx-auto mb-8"
              contain
            ></v-img>

            <template>
              <v-icon size="150" color="grey lighten-1"
                >mdi-alert-circle-outline</v-icon
              >
            </template>

            <p class="text-subtitle-1 mb-8">
              The page you're looking for doesn't exist or has been moved.
            </p>

            <div class="d-flex justify-center">
              <v-btn
                color="primary"
                large
                :to="isAuthenticated ? '/admin/dashboard' : '/'"
                class="mx-2"
              >
                <v-icon left>mdi-home</v-icon>
                Go to Home
              </v-btn>
              <v-btn large outlined @click="$router.go(-1)" class="mx-2">
                <v-icon left>mdi-arrow-left</v-icon>
                Go Back
              </v-btn>
            </div>
          </div>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  name: "NotFound",

  computed: {
    ...mapGetters({
      isAuthenticated: "auth/isAuthenticated",
    }),
  },
};
</script>

<style scoped>
.not-found-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  background-color: #f5f5f5;
}

.not-found-content {
  padding: 2rem;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}
</style>
