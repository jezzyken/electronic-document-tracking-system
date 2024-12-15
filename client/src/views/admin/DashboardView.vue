<template>
  <div class="dashboard">
    <v-row class="stats-container">
      <v-col cols="12" md="4">
        <v-card elevation="2" class="stats-card">
          <v-card-title class="primary--text">
            <v-icon left color="primary">mdi-file-document-multiple</v-icon>
            Document Statistics
          </v-card-title>
          <v-divider></v-divider>
          <v-card-text class="pt-4">
            <v-row dense>
              <v-col cols="12" class="stat-item">
                <div class="stat-label">Total Documents</div>
                <div class="stat-value">{{ stats.documentStats.total }}</div>
              </v-col>
              <v-col cols="6" class="stat-item">
                <div class="stat-label">Under Review</div>
                <div class="stat-value warning--text">
                  {{ stats.documentStats.underReview }}
                </div>
              </v-col>
              <v-col cols="6" class="stat-item">
                <div class="stat-label">Completed</div>
                <div class="stat-value success--text">
                  {{ stats.documentStats.completed }}
                </div>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" md="4">
        <v-card elevation="2" class="stats-card">
          <v-card-title class="primary--text">
            <v-icon left color="primary">mdi-flag</v-icon>
            Priority Distribution
          </v-card-title>
          <v-divider></v-divider>
          <v-card-text class="pt-4">
            <v-row dense>
              <v-col cols="4" class="stat-item">
                <div class="stat-label">High</div>
                <div class="stat-value error--text">
                  {{ stats.priorityStats.high }}
                </div>
              </v-col>
              <v-col cols="4" class="stat-item">
                <div class="stat-label">Medium</div>
                <div class="stat-value warning--text">
                  {{ stats.priorityStats.medium }}
                </div>
              </v-col>
              <v-col cols="4" class="stat-item">
                <div class="stat-label">Low</div>
                <div class="stat-value success--text">
                  {{ stats.priorityStats.low }}
                </div>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" md="4">
        <v-card elevation="2" class="stats-card">
          <v-card-title class="primary--text">
            <v-icon left color="primary">mdi-clipboard-text</v-icon>
            Request Overview
          </v-card-title>
          <v-divider></v-divider>
          <v-card-text class="pt-4">
            <v-row dense>
              <v-col cols="6" class="stat-item">
                <div class="stat-label">Total Requests</div>
                <div class="stat-value">{{ stats.requestStats.total }}</div>
              </v-col>
              <v-col cols="6" class="stat-item">
                <div class="stat-label">Pending</div>
                <div class="stat-value warning--text">
                  {{ stats.requestStats.pending }}
                </div>
              </v-col>
              <v-col cols="6" class="stat-item">
                <div class="stat-label">Processing</div>
                <div class="stat-value info--text">
                  {{ stats.requestStats.processing }}
                </div>
              </v-col>
              <v-col cols="6" class="stat-item">
                <div class="stat-label">Completed</div>
                <div class="stat-value success--text">
                  {{ stats.requestStats.completed }}
                </div>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <v-card elevation="2" class="mt-6">
      <v-card-title class="primary--text">
        <v-icon left color="primary">mdi-clock-outline</v-icon>
        Recent Activities
      </v-card-title>
      <v-divider></v-divider>
      <v-card-text class="pt-4">
        <v-timeline dense>
          <v-timeline-item
            v-for="activity in stats.recentActivities"
            :key="activity._id"
            :color="getStatusColor(activity.status)"
            small
          >
            <template v-slot:opposite>
              <span class="caption">{{ formatDate(activity.createdAt) }}</span>
            </template>
            <v-card class="elevation-1">
              <v-card-text>
                <strong class="primary--text">{{
                  activity.documentId.title
                }}</strong>
                <div class="subtitle-2 mt-2">
                  <v-icon small class="mr-1">mdi-arrow-right</v-icon>
                  {{ activity.fromDepartment.name }} →
                  {{ activity.toDepartment.name }}
                </div>
                <v-chip
                  x-small
                  :color="getStatusColor(activity.status)"
                  class="mt-2"
                  text-color="white"
                >
                  {{ activity.status }}
                </v-chip>
              </v-card-text>
            </v-card>
          </v-timeline-item>
        </v-timeline>
      </v-card-text>
    </v-card>

    <v-card elevation="2" class="mt-6">
      <v-card-title class="primary--text">
        <v-icon left color="primary">mdi-table</v-icon>
        Document Requests
        <v-spacer></v-spacer>
        <v-text-field
          v-model="search"
          prepend-inner-icon="mdi-magnify"
          label="Search requests..."
          hide-details
          outlined
          dense
          class="search-field"
        ></v-text-field>
      </v-card-title>
      <v-divider></v-divider>
      <v-data-table
        :headers="headers"
        :items="documentRequests.requests"
        :loading="loading"
        :search="search"
        :items-per-page="10"
        class="elevation-0"
      >
        <template v-slot:loading>
          <v-skeleton-loader type="table-row" class="ma-2"></v-skeleton-loader>
        </template>
        <template v-slot:item.status="{ item }">
          <v-chip small :color="getStatusColor(item.status)" text-color="white">
            {{ item.status }}
          </v-chip>
        </template>
        <template v-slot:item.actions="{ item }">
          <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                icon
                small
                color="primary"
                v-bind="attrs"
                v-on="on"
                @click="viewTimeline(item._id)"
              >
                <v-icon>mdi-timeline</v-icon>
              </v-btn>
            </template>
            <span>View Timeline</span>
          </v-tooltip>
        </template>
      </v-data-table>
    </v-card>
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";
import moment from "moment";

export default {
  name: "Dashboard",

  data() {
    return {
      search: "",
      headers: [
        { text: "Tracking Number", value: "trackingNumber" },
        { text: "Title", value: "title" },
        { text: "Status", value: "status" },
        { text: "Created At", value: "createdAt" },
        // { text: "Actions", value: "actions", sortable: false },
      ],
    };
  },

  computed: {
    ...mapState("dashboard", ["stats", "documentRequests", "loading"]),
  },

  methods: {
    ...mapActions("dashboard", [
      "fetchDashboardStats",
      "fetchDocumentRequests",
      "fetchDocumentTimeline",
    ]),

    formatDate(date) {
      return moment(date).format("YYYY-MM-DD HH:mm");
    },

    getStatusColor(status) {
      const colors = {
        "Under Review": "warning",
        Completed: "success",
        pending: "info",
        processing: "primary",
        completed: "success",
      };
      return colors[status] || "grey";
    },

    async viewTimeline(documentId) {
      await this.fetchDocumentTimeline(documentId);
    },
  },

  async created() {
    await Promise.all([
      this.fetchDashboardStats(),
      this.fetchDocumentRequests({
        page: 1,
        limit: 10,
      }),
    ]);
  },
};
</script>

<style scoped>
.dashboard {
  padding: 24px;
  background-color: #f5f5f5;
}

.stats-card {
  height: 100%;
  transition: transform 0.2s;
}

.stats-card:hover {
  transform: translateY(-2px);
}

.stat-item {
  text-align: center;
  padding: 8px;
}

.stat-label {
  color: #666;
  font-size: 0.875rem;
  margin-bottom: 4px;
}

.stat-value {
  font-size: 1.5rem;
  font-weight: 600;
}

.search-field {
  max-width: 300px;
}

.v-data-table {
  background-color: transparent !important;
}
</style>
