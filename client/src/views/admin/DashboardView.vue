<template>
  <v-container fluid>
    <v-card-title class="d-flex align-center py-4">
      <v-icon large color="#a52a2a" class="mr-3">mdi-view-dashboard</v-icon>
      <span class="text-h5">Coming Soon!</span>
    </v-card-title>

    <v-row>
      <!-- <v-col cols="12" sm="6" md="3">
        <v-card class="mx-auto" color="#b22222" dark>
          <v-card-text>
            <div class="text-h4 mb-2">{{ totalStudents }}</div>
            <div class="text-subtitle-1">Total Students</div>
            <v-icon large class="dashboard-icon">mdi-account-group</v-icon>
          </v-card-text>
        </v-card>
      </v-col> -->

      <!-- <v-col cols="12" sm="6" md="3">
        <v-card class="mx-auto" color="#d2691e" dark>
          <v-card-text>
            <div class="text-h4 mb-2">{{ totalTeachers }}</div>
            <div class="text-subtitle-1">Total Teachers</div>
            <v-icon large class="dashboard-icon">mdi-teach</v-icon>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" sm="6" md="3">
        <v-card class="mx-auto" color="#f4a460" dark>
          <v-card-text>
            <div class="text-h4 mb-2">{{ totalClasses }}</div>
            <div class="text-subtitle-1">Active Classes</div>
            <v-icon large class="dashboard-icon">mdi-calendar-clock</v-icon>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" sm="6" md="3">
        <v-card class="mx-auto" color="#d2b48c" dark>
          <v-card-text>
            <div class="text-h4 mb-2">{{ attendanceRate }}%</div>
            <div class="text-subtitle-1">Today's Attendance</div>
            <v-icon large class="dashboard-icon">mdi-account-check</v-icon>
          </v-card-text>
        </v-card>
      </v-col> -->
    </v-row>

    <!-- Charts Row -->
    <!-- <v-row class="mt-4">
      <v-col cols="12" md="6">
        <v-card>
          <v-card-title>
            Weekly Attendance Overview
            <v-spacer></v-spacer>
            <v-btn small text color="primary" @click="viewAttendanceDetails">
              View Details
            </v-btn>
          </v-card-title>
          <v-card-text>
            <AttendanceChart :data="weeklyAttendance" />
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" md="6">  
        <v-card>
          <v-card-title>
            Class Distribution
            <v-spacer></v-spacer>
            <v-btn small text color="primary" @click="viewClassDetails">
              View Details
            </v-btn>
          </v-card-title>
          <v-card-text>
            <ClassDistributionChart :data="classDistribution" />
          </v-card-text>
        </v-card>
      </v-col>
    </v-row> -->

    <!-- Loading Overlay -->
    <v-overlay :value="isLoading">
      <v-progress-circular indeterminate size="64"></v-progress-circular>
    </v-overlay>
  </v-container>
</template>

<script>
import { mapState, mapGetters, mapActions } from "vuex";
import moment from "moment";
import AttendanceChart from "@/components/dashboard/AttendanceChart.vue";
// import ClassDistributionChart from '@/components/dashboard/ClassDistributionChart.vue';

export default {
  name: "DashboardView",

  components: {
    AttendanceChart,
    // ClassDistributionChart
  },

  data: () => ({
    search: "",
    activityHeaders: [
      { text: "Activity", value: "description" },
      { text: "User", value: "user" },
      { text: "Timestamp", value: "timestamp" },
      { text: "Status", value: "status" },
    ],
    quickActions: [
      {
        title: "Take Attendance",
        icon: "mdi-checkbox-marked",
        color: "success",
        route: "/attendance",
      },
      {
        title: "Add New Student",
        icon: "mdi-account-plus",
        color: "primary",
        route: "/students/new",
      },
      {
        title: "Schedule Class",
        icon: "mdi-calendar-plus",
        color: "info",
        route: "/schedule/new",
      },
      {
        title: "Generate Reports",
        icon: "mdi-file-chart",
        color: "warning",
        route: "/reports",
      },
    ],
  }),

  computed: {
    ...mapGetters("dashboard", [
      "totalStudents",
      "totalTeachers",
      "totalClasses",
      "attendanceRate",
      "isLoading",
    ]),
    ...mapState("dashboard", [
      "recentActivities",
      "weeklyAttendance",
      "classDistribution",
    ]),
  },

  methods: {
    ...mapActions("dashboard", [
      "fetchDashboardData",
      "fetchRecentActivities",
      "fetchWeeklyAttendance",
      "fetchClassDistribution",
    ]),

    formatDate(date) {
      return moment(date).format("MMM DD, YYYY HH:mm");
    },

    getStatusColor(status) {
      const colors = {
        completed: "success",
        pending: "warning",
        failed: "error",
      };
      return colors[status.toLowerCase()] || "grey";
    },

    handleQuickAction(action) {
      this.$router.push(action.route);
    },

    viewAttendanceDetails() {
      this.$router.push("/attendance/overview");
    },

    viewClassDetails() {
      this.$router.push("/classes/overview");
    },

    async initialize() {
      try {
        await Promise.all([
          this.fetchDashboardData(),
          this.fetchRecentActivities(),
          this.fetchWeeklyAttendance(),
          this.fetchClassDistribution(),
        ]);
      } catch (error) {
        console.error("Failed to initialize dashboard:", error);
      }
    },
  },

  created() {
    this.initialize();
  },
};
</script>

<style scoped>
.dashboard-icon {
  position: absolute;
  right: 16px;
  bottom: 16px;
  opacity: 0.3;
  font-size: 48px;
}

.v-card {
  transition: transform 0.2s;
}

.v-card:hover {
  transform: translateY(-2px);
}
</style>
