<template>
  <div class="landing-page">
    <!-- Hero Section -->
    <section class="hero-section">
      <v-container>
        <v-row align="center" justify="center" class="text-center">
          <v-col cols="12" md="8">
            <h1 class="text-h3 font-weight-bold mb-4">
              Document Request Portal
            </h1>
            <p class="text-subtitle-1 mb-8">
              Request and track your documents easily
            </p>
            <v-row justify="center" class="mb-8">
              <v-col cols="12" sm="6">
                <v-btn 
                  block 
                  x-large 
                  color="primary" 
                  to="/request"
                  height="56"
                >
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

    <!-- Features Section -->
    <section class="features-section py-12 grey lighten-4">
      <v-container>
        <v-row>
          <v-col cols="12" md="4">
            <v-card flat class="transparent" height="100%">
              <v-card-text class="text-center">
                <v-icon x-large color="primary" class="mb-4">mdi-file-document-outline</v-icon>
                <h3 class="text-h6 mb-2">Easy Request Process</h3>
                <p>Simple and straightforward document request process</p>
              </v-card-text>
            </v-card>
          </v-col>
          <v-col cols="12" md="4">
            <v-card flat class="transparent" height="100%">
              <v-card-text class="text-center">
                <v-icon x-large color="primary" class="mb-4">mdi-clock-fast</v-icon>
                <h3 class="text-h6 mb-2">Fast Processing</h3>
                <p>Quick turnaround time for document processing</p>
              </v-card-text>
            </v-card>
          </v-col>
          <v-col cols="12" md="4">
            <v-card flat class="transparent" height="100%">
              <v-card-text class="text-center">
                <v-icon x-large color="primary" class="mb-4">mdi-magnify</v-icon>
                <h3 class="text-h6 mb-2">Real-time Tracking</h3>
                <p>Track your document status in real-time</p>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </section>

    <!-- How It Works Section -->
    <section class="how-it-works-section py-12">
      <v-container>
        <h2 class="text-h4 text-center mb-8">How It Works</h2>
        <v-timeline dense>
          <v-timeline-item
            v-for="(step, index) in steps"
            :key="index"
            :color="step.color"
            small
          >
            <div class="font-weight-normal">
              <strong class="text-h6">{{ step.title }}</strong>
              <div class="text-body-1 mt-2">{{ step.description }}</div>
            </div>
          </v-timeline-item>
        </v-timeline>
      </v-container>
    </section>
  </div>
</template>

<script>
export default {
  name: 'LandingPage',
  
  data: () => ({
    steps: [
      {
        title: 'Submit Request',
        description: 'Fill out the document request form with your details',
        color: 'primary'
      },
      {
        title: 'Processing',
        description: 'We process your request and prepare the documents',
        color: 'orange'
      },
      {
        title: 'Track Progress',
        description: 'Track your request status using the tracking number',
        color: 'blue'
      },
      {
        title: 'Receive Documents',
        description: 'Get your documents through your chosen delivery method',
        color: 'success'
      }
    ]
  })
}
</script>

<style scoped>
.hero-section {
  min-height: 80vh;
  display: flex;
  align-items: center;
  background: linear-gradient(135deg, #f5f5f5 0%, #ffffff 100%);
}

.features-section {
  background-color: #f5f5f5;
}

.how-it-works-section {
  background-color: white;
}
</style>