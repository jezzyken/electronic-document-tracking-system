// store/modules/reports.js
import ReportService from "@/services/reportService";

export default {
  namespaced: true,

  state: {
    scheduleReports: {
      data: [],
      total: 0,
    },
    loading: false,
    error: null,
    filters: {
      course: null,
      subject: null,
      teacher: null,
      weekDay: null,
      startTime: null,
      endTime: null,
    },
  },

  mutations: {
    SET_SCHEDULE_REPORTS(state, { schedules, total }) {
      state.scheduleReports.data = schedules;
      state.scheduleReports.total = total;
    },
    SET_LOADING(state, status) {
      state.loading = status;
    },
    SET_ERROR(state, error) {
      state.error = error;
    },
    SET_FILTERS(state, filters) {
      state.filters = { ...state.filters, ...filters };
    },
    RESET_FILTERS(state) {
      state.filters = {
        course: null,
        subject: null,
        teacher: null,
        weekDay: null,
        startTime: null,
        endTime: null,
      };
    },
  },

  actions: {
    async fetchScheduleReports({ commit, state }) {
      commit("SET_LOADING", true);
      commit("SET_ERROR", null);

      try {
        const params = {};

        if (state.filters.course) params.course = state.filters.course;
        if (state.filters.subject) params.subject = state.filters.subject;
        if (state.filters.teacher)
          params.teacher = state.filters.teacher._id || state.filters.teacher;
        if (state.filters.weekDay) params.weekDay = state.filters.weekDay;
        if (state.filters.startTime) params.startTime = state.filters.startTime;
        if (state.filters.endTime) params.endTime = state.filters.endTime;

        const response = await ReportService.getScheduleReports(params);

        commit("SET_SCHEDULE_REPORTS", {
          schedules: response.data.data.schedules,
          total: response.data.data.total,
        });
      } catch (error) {
        console.error("Report fetch error:", error);
        commit(
          "SET_ERROR",
          error.response?.data?.message || "Failed to fetch schedule reports"
        );
        throw error;
      } finally {
        commit("SET_LOADING", false);
      }
    },

    updateFilters({ commit, dispatch }, filters) {
      const cleanFilters = {
        course: filters.course,
        subject: filters.subject,
        teacher: filters.teacher?._id || filters.teacher,
        weekDay: filters.weekDay,
        startTime: filters.startTime,
        endTime: filters.endTime,
      };

      commit("SET_FILTERS", cleanFilters);
      return dispatch("fetchScheduleReports");
    },

    resetFilters({ commit, dispatch }) {
      commit("RESET_FILTERS");
      return dispatch("fetchScheduleReports");
    },
  },

  getters: {
    getScheduleReports: (state) => state.scheduleReports.data,
    getTotalReports: (state) => state.scheduleReports.total,
    getLoading: (state) => state.loading,
    getError: (state) => state.error,
    getFilters: (state) => state.filters,
  },
};
