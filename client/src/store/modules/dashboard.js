import dashboardService from "@/services/dashboardService";

export default {
  namespaced: true,

  state: {
    dashboardData: null,
    recentActivities: [],
    weeklyAttendance: [],
    classDistribution: [],
    loading: false,
    error: null,
  },

  getters: {
    totalStudents: (state) => state.dashboardData?.studentCount || 0,
    totalTeachers: (state) => state.dashboardData?.teacherCount || 0,
    totalClasses: (state) => state.dashboardData?.classCount || 0,
    attendanceRate: (state) => state.dashboardData?.attendanceRate || 0,
    isLoading: (state) => state.loading,
  },

  mutations: {
    SET_DASHBOARD_DATA(state, data) {
      state.dashboardData = data;
    },
    SET_RECENT_ACTIVITIES(state, activities) {
      state.recentActivities = activities;
    },
    SET_WEEKLY_ATTENDANCE(state, data) {
      state.weeklyAttendance = data;
    },
    SET_CLASS_DISTRIBUTION(state, data) {
      state.classDistribution = data;
    },
    SET_LOADING(state, status) {
      state.loading = status;
    },
    SET_ERROR(state, error) {
      state.error = error;
    },
  },

  actions: {
    async fetchDashboardData({ commit }) {
      commit("SET_LOADING", true);
      try {
        const { data } = await dashboardService.getDashboardData();
        console.log(data)
        commit("SET_DASHBOARD_DATA", data.data);
        return data;
      } catch (error) {
        commit("SET_ERROR", error.message);
        throw error;
      } finally {
        commit("SET_LOADING", false);
      }
    },

    async fetchRecentActivities({ commit }) {
      try {
        const { data } = await dashboardService.getRecentActivities();
        commit("SET_RECENT_ACTIVITIES", data);
        return data;
      } catch (error) {
        commit("SET_ERROR", error.message);
        throw error;
      }
    },

    async fetchWeeklyAttendance({ commit }) {
      try {
        const { data } = await dashboardService.getWeeklyAttendance();
        commit("SET_WEEKLY_ATTENDANCE", data);
        return data;
      } catch (error) {
        commit("SET_ERROR", error.message);
        throw error;
      }
    },

    async fetchClassDistribution({ commit }) {
      try {
        const { data } = await dashboardService.getClassDistribution();
        commit("SET_CLASS_DISTRIBUTION", data);
        return data;
      } catch (error) {
        commit("SET_ERROR", error.message);
        throw error;
      }
    },
  },
};
