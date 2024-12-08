import classScheduleService from "@/services/classScheduleService";

export default {
  namespaced: true,

  state: {
    schedules: [],
    totalSchedules: 0,
    loading: false,
    error: null,
    teacherSchedules: [],
    groupedSchedules: {},
  },

  mutations: {
    SET_SCHEDULES(state, schedules) {
      state.schedules = schedules;
    },
    SET_TOTAL_SCHEDULES(state, total) {
      state.totalSchedules = total;
    },
    SET_TEACHER_SCHEDULES(state, data) {
      state.teacherSchedules = data.rawSchedules || [];
      state.groupedSchedules = data.groupedSchedules || {};
    },
    ADD_SCHEDULE(state, schedule) {
      state.schedules.push(schedule);
    },
    UPDATE_SCHEDULE(state, updatedSchedule) {
      const index = state.schedules.findIndex(
        (s) => s._id === updatedSchedule._id
      );
      if (index !== -1) {
        state.schedules.splice(index, 1, updatedSchedule);
      }
    },
    REMOVE_SCHEDULE(state, scheduleId) {
      state.schedules = state.schedules.filter((s) => s._id !== scheduleId);
    },
    SET_LOADING(state, loading) {
      state.loading = loading;
    },
    SET_ERROR(state, error) {
      state.error = error;
    },
    RESET_STATE(state) {
      state.teacherSchedules = [];
      state.groupedSchedules = {};
      state.error = null;
    }
  },

  actions: {
    async fetchSchedules({ commit }) {
      commit("SET_LOADING", true);
      try {
        const response = await classScheduleService.getSchedules();
        commit("SET_SCHEDULES", response.data.data.schedules);
        commit("SET_TOTAL_SCHEDULES", response.data.results);
      } catch (error) {
        commit("SET_ERROR", error.response?.data?.message);
        throw error;
      } finally {
        commit("SET_LOADING", false);
      }
    },

    async fetchTeacherSchedules({ commit }, teacherId) {
      commit("SET_LOADING", true);
      commit("SET_ERROR", null);

      try {
        const response = await classScheduleService.getTeacherSchedule(teacherId);
        commit("SET_TEACHER_SCHEDULES", response.data.data.schedule);
      } catch (error) {
        commit(
          "SET_ERROR",
          error.response?.data?.message || "Failed to fetch schedules"
        );
        throw error;
      } finally {
        commit("SET_LOADING", false);
      }
    },

    async createSchedule({ commit }, scheduleData) {
      commit("SET_LOADING", true);
      try {
        const response = await classScheduleService.createSchedule(
          scheduleData
        );
        commit("ADD_SCHEDULE", response.data.data.schedule);
        return response.data.data.schedule;
      } catch (error) {
        commit("SET_ERROR", error.response?.data?.message);
        throw error;
      } finally {
        commit("SET_LOADING", false);
      }
    },

    async updateSchedule({ commit }, { id, scheduleData }) {
      commit("SET_LOADING", true);
      try {
        const response = await classScheduleService.updateSchedule(
          id,
          scheduleData
        );
        commit("UPDATE_SCHEDULE", response.data.data.schedule);
        return response.data.data.schedule;
      } catch (error) {
        commit("SET_ERROR", error.response?.data?.message);
        throw error;
      } finally {
        commit("SET_LOADING", false);
      }
    },

    async deleteSchedule({ commit }, id) {
      commit("SET_LOADING", true);
      try {
        await classScheduleService.deleteSchedule(id);
        commit("REMOVE_SCHEDULE", id);
      } catch (error) {
        commit("SET_ERROR", error.response?.data?.message);
        throw error;
      } finally {
        commit("SET_LOADING", false);
      }
    },
  },

  getters: {
    getSchedulesByDay: (state) => (day) => {

      console.log(day)
      return state.groupedSchedules[day] || [];
    },
    hasSchedules: (state) => {
      return state.teacherSchedules.length > 0;
    },
    isLoading: (state) => state.loading,
    getError: (state) => state.error,
  },
};
