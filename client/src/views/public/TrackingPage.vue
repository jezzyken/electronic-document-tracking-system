<template>
  <v-container class="py-8">
    <v-row justify="center">
      <v-col cols="12" md="8" lg="6">
        <v-card class="tracking-card">
          <v-card-title class="text-h4 text-center d-block py-6">
            Track Your Request
          </v-card-title>

          <v-card-text>
            <v-form @submit.prevent="trackDocument" ref="form">
              <v-text-field
                v-model="trackingNumber"
                label="Enter Tracking Number"
                :rules="trackingRules"
                outlined
                placeholder="e.g., REQ-2024-ABCD1234"
                :error-messages="errorMessage"
                @input="errorMessage = ''"
              ></v-text-field>

              <v-btn
                color="primary"
                block
                x-large
                @click="trackDocument"
                :loading="loading"
                class="mt-4"
              >
                Track Document
                <v-icon right>mdi-magnify</v-icon>
              </v-btn>
            </v-form>

            <v-alert
              v-if="errorMessage"
              type="error"
              dense
              text
              class="mt-4"
            >
              {{ errorMessage }}
            </v-alert>

            <v-expand-transition>
              <div v-if="loading" class="mt-8">
                <v-skeleton-loader
                  type="heading"
                  class="mb-4"
                ></v-skeleton-loader>
                <v-skeleton-loader
                  type="card"
                  class="mb-4"
                >
                  <v-skeleton-loader
                    type="list-item-three-line"
                    class="mb-2"
                  ></v-skeleton-loader>
                  <v-skeleton-loader
                    type="list-item-three-line"
                  ></v-skeleton-loader>
                </v-skeleton-loader>
                <v-skeleton-loader
                  type="heading"
                  class="mb-4"
                ></v-skeleton-loader>
                <v-skeleton-loader
                  type="list-item-three-line"
                  class="mb-2"
                  v-for="i in 3"
                  :key="i"
                ></v-skeleton-loader>
              </div>
            </v-expand-transition>

            <v-expand-transition>
              <div v-if="!loading && trackingResult" class="mt-8">
                <v-divider class="my-4"></v-divider>
                
                <v-card outlined class="mb-4">
                  <v-card-text>
                    <div class="d-flex justify-space-between align-center mb-4">
                      <div class="text-h6">Request Status</div>
                      <v-chip
                        :color="getStatusColor(trackingResult.status)"
                        text-color="white"
                      >
                        {{ trackingResult.status }}
                      </v-chip>
                    </div>

                    <v-list-item v-for="(item, key) in trackingResult.details" 
                                :key="key" 
                                dense>
                      <v-list-item-content>
                        <v-list-item-subtitle class="text-capitalize">
                          {{ formatLabel(key) }}
                        </v-list-item-subtitle>
                        <v-list-item-title>{{ item }}</v-list-item-title>
                      </v-list-item-content>
                    </v-list-item>
                  </v-card-text>
                </v-card>

                <div class="text-h6 mb-4">Status Timeline</div>
                <v-timeline dense>
                  <v-timeline-item
                    v-for="(status, index) in trackingResult.timeline"
                    :key="index"
                    :color="getStatusColor(status.status)"
                    small
                  >
                    <div class="font-weight-normal">
                      <strong class="text-capitalize">{{ status.status }}</strong>
                      <div class="text-caption">
                        {{ status.date }} - {{ status.time }}
                      </div>
                      <div class="text-body-2">{{ status.description }}</div>
                    </div>
                  </v-timeline-item>
                </v-timeline>
              </div>
            </v-expand-transition>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';

export default {
  name: 'TrackingPage',
  
  data: () => ({
    trackingNumber: '',
    loading: false,
    errorMessage: '',
    trackingRules: [
      v => !!v || 'Tracking number is required',
      v => /^REQ-\d{4}-[A-Za-z0-9]{8}$/.test(v) || 'Invalid tracking number format'
    ]
  }),

  computed: {
    ...mapGetters('documentRequest', ['currentRequest']),

    trackingResult() {
      if (!this.currentRequest) return null;

      return {
        status: this.currentRequest.status,
        details: {
          request_id: this.currentRequest.trackingNumber,
          request_date: new Date(this.currentRequest.createdAt).toLocaleDateString(),
          // document_type: this.currentRequest.requestedDocuments.join(', '),
          // full_name: this.currentRequest.fullName,
          // student_id: this.currentRequest.studentId || 'N/A',
          // email: this.currentRequest.email,
          // phone: this.currentRequest.phone,
          // purpose: this.currentRequest.purpose,
          // notes: this.currentRequest.notes || 'N/A'
        },
        timeline: this.currentRequest.statusHistory.map(history => ({
          status: history.status,
          date: new Date(history.timestamp).toLocaleDateString(),
          time: new Date(history.timestamp).toLocaleTimeString(),
          description: history.notes
        })).reverse()
      };
    }
  },

  methods: {
    ...mapActions('documentRequest', ['fetchRequest']),

    getStatusColor(status) {
      const colors = {
        'pending': 'warning',
        'processing': 'info',
        'ready': 'success',
        'completed': 'success',
        'cancelled': 'error',
        'rejected': 'error'
      };
      return colors[status.toLowerCase()] || 'grey';
    },

    formatLabel(key) {
      return key.split('_')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
    },

    async trackDocument() {
      if (!this.$refs.form.validate()) return;

      this.loading = true;
      this.errorMessage = '';
      
      try {
        await this.fetchRequest(this.trackingNumber);
      } catch (error) {
        this.errorMessage = error.response?.data?.message || 'Request not found';
      } finally {
        this.loading = false;
      }
    },

    clearResults() {
      this.$store.commit('documentRequest/SET_CURRENT_REQUEST', null);
    }
  },

  mounted() {
    const trackingFromQuery = this.$route.query.tracking;
    if (trackingFromQuery) {
      this.trackingNumber = trackingFromQuery;
      this.trackDocument();
    }
  },

  beforeDestroy() {
    this.clearResults();
  }
};
</script>

<style scoped>
.tracking-card {
  border-radius: 8px;
}

.v-timeline-item {
  padding-bottom: 24px;
}

.v-timeline-item:last-child {
  padding-bottom: 0;
}

.text-capitalize {
  text-transform: capitalize;
}
</style>