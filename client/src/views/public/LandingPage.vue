<template>
  <div class="landing-page">
    <section class="hero-section">
      <v-container>
        <v-row align="center" justify="center" class="text-center">
          <v-col cols="12" md="8">
            <h1 class="text-h3 font-weight-bold mb-4">
              Document Request Portal
            </h1>
            <p class="text-subtitle-1 mb-8">
              Easy way to request and track your documents
            </p>
            <v-row justify="center" class="mb-8">
              <v-col cols="12" sm="6">
                <v-btn block x-large color="primary" to="/request" height="56">
                  Request Document
                  <v-icon right>mdi-file-document-outline</v-icon>
                </v-btn>
              </v-col>
              <v-col cols="12" sm="6">
                <v-btn
                  block
                  x-large
                  outlined
                  color="primary"
                  to="/track"
                  height="56"
                >
                  Track Request
                  <v-icon right>mdi-magnify</v-icon>
                </v-btn>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
      </v-container>
    </section>
  </div>
</template>

<script>
export default {
  name: "LandingPage",
  data: () => ({}),
};
</script>

<style scoped>
.hero-section {
  min-height: 90vh;
  display: flex;
  align-items: center;
  background: linear-gradient(135deg, #f5f5f5 0%, #ffffff 100%);
}
</style>
