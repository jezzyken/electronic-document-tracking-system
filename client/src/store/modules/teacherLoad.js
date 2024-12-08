import teacherLoadService from "@/services/teacherLoadService";

export default {
  namespaced: true,

  state: {
    teacherLoads: [],
    currentTeacherLoad: null,
    studentSchedule: null,
    loading: false,
    error: null,
  },

  mutations: {
    SET_TEACHER_LOADS(state, loads) {
      state.teacherLoads = loads;
    },
    SET_STUDENT_SCHEDULE(state, schedule) {
      state.studentSchedule = schedule;
    },
    SET_CURRENT_TEACHER_LOAD(state, load) {
      state.currentTeacherLoad = load;
    },
    ADD_TEACHER_LOAD(state, load) {
      state.teacherLoads.push(load);
    },
    UPDATE_TEACHER_LOAD(state, updatedLoad) {
      const index = state.teacherLoads.findIndex(
        (l) => l._id === updatedLoad._id
      );
      if (index !== -1) {
        state.teacherLoads.splice(index, 1, updatedLoad);
      }
    },
    REMOVE_TEACHER_LOAD(state, loadId) {
      state.teacherLoads = state.teacherLoads.filter((l) => l._id !== loadId);
    },
    SET_LOADING(state, loading) {
      state.loading = loading;
    },
    SET_ERROR(state, error) {
      state.error = error;
    },
  },

  actions: {
    async fetchTeacherLoads({ commit }, query = {}) {
      commit("SET_LOADING", true);
      try {
        const response = await teacherLoadService.getAllTeacherLoads(query);
        commit("SET_TEACHER_LOADS", response.data.data.teacherLoads);
        return response.data.data.teacherLoads;
      } catch (error) {
        commit(
          "SET_ERROR",
          error.response?.data?.message || "Failed to fetch teacher loads"
        );
        throw error;
      } finally {
        commit("SET_LOADING", false);
      }
    },

    async fetchProfessorTeacherLoads({ commit }, professorId) {
      if (!professorId) return;
      commit("SET_LOADING", true);
      try {
        const response = await teacherLoadService.getTeacherLoadsForProfessor(
          professorId
        );
        commit("SET_TEACHER_LOADS", response.data.data.teacherLoads);
        return response.data.data.teacherLoads;
      } catch (error) {
        commit(
          "SET_ERROR",
          error.response?.data?.message ||
            "Failed to fetch professor teaching loads"
        );
        throw error;
      } finally {
        commit("SET_LOADING", false);
      }
    },

    async fetchTeacherLoad({ commit }, id) {
      if (!id) return;
      commit("SET_LOADING", true);
      try {
        const response = await teacherLoadService.getTeacherLoad(id);
        commit("SET_CURRENT_TEACHER_LOAD", response.data.data.teacherLoad);
        return response.data.data.teacherLoad;
      } catch (error) {
        commit(
          "SET_ERROR",
          error.response?.data?.message || "Failed to fetch teacher load"
        );
        throw error;
      } finally {
        commit("SET_LOADING", false);
      }
    },

    async fetchAvailableSubjects({ commit }, { academicYear, semester }) {
      commit("SET_LOADING", true);
      try {
        const response = await teacherLoadService.getAvailableSubjects(
          academicYear,
          semester
        );
        return response.data.data.subjects;
      } catch (error) {
        commit("SET_ERROR", error.response?.data?.message);
        throw error;
      } finally {
        commit("SET_LOADING", false);
      }
    },

    async fetchStudentSubjectGrade({ commit }, query) {
      commit("SET_LOADING", false);
      try {
        const response = await teacherLoadService.fetchStudentSubjectGrade(query);
        console.log({grade: response.data})
        return response.data
      } catch (error) {
        commit("SET_ERROR", error.response?.data?.message);
        throw error;
      } finally {
        commit("SET_LOADING", false);
      }
    },

    async fetchStudentSchedule({ commit }, data) {
      commit("SET_LOADING", true);
      try {
        const response = await teacherLoadService.getStudentSchedule(data);
        commit("SET_STUDENT_SCHEDULE", response.data.data);
        return response;
      } catch (error) {
        commit(
          "SET_ERROR",
          error.response?.data?.message || "Failed to fetch student schedule"
        );
        throw error;
      } finally {
        commit("SET_LOADING", false);
      }
    },

    async createTeacherLoad({ commit }, loadData) {
      commit("SET_LOADING", true);
      try {
        const response = await teacherLoadService.createTeacherLoad(loadData);
        commit("ADD_TEACHER_LOAD", response.data.data.teacherLoad);
        return response.data.data.teacherLoad;
      } catch (error) {
        commit(
          "SET_ERROR",
          error.response?.data?.message || "Failed to create teacher load"
        );
        throw error;
      } finally {
        commit("SET_LOADING", false);
      }
    },

    async updateTeacherLoad({ commit }, { id, data }) {
      if (!id) return;
      commit("SET_LOADING", true);
      try {
        const response = await teacherLoadService.updateTeacherLoad(id, data);
        commit("UPDATE_TEACHER_LOAD", response.data.data.teacherLoad);
        return response.data.data.teacherLoad;
      } catch (error) {
        commit(
          "SET_ERROR",
          error.response?.data?.message || "Failed to update teacher load"
        );
        throw error;
      } finally {
        commit("SET_LOADING", false);
      }
    },

    async updateTeacherLoadStudents({ commit }, data) {
      try {
        const response = await teacherLoadService.updateTeacherLoadStudents(
          data
        );
        return response.data;
      } catch (error) {
        console.error("Error updating teacher load students:", error);
        throw error;
      }
    },

    async updateStudentGrade({ commit }, data) {
      try {
        const response = await teacherLoadService.updateStudentGrade(data);
        return response.data;
      } catch (error) {
        console.error("Error updating teacher load students:", error);
        throw error;
      }
    },

    async deleteTeacherLoad({ commit }, id) {
      if (!id) return;
      commit("SET_LOADING", true);
      try {
        await teacherLoadService.deleteTeacherLoad(id);
        commit("REMOVE_TEACHER_LOAD", id);
      } catch (error) {
        commit(
          "SET_ERROR",
          error.response?.data?.message || "Failed to delete teacher load"
        );
        throw error;
      } finally {
        commit("SET_LOADING", false);
      }
    },

    async checkScheduleConflicts(
      { commit },
      { schedule, skipSubjectId, professorId }
    ) {
      commit("SET_LOADING", true);
      try {
        const response = await teacherLoadService.checkConflictSchedule({
          schedule,
          skipSubjectId,
          professorId,
        });
        return response.data.data;
      } catch (error) {
        commit(
          "SET_ERROR",
          error.response?.data?.message || "Failed to check schedule conflicts"
        );
        throw error;
      } finally {
        commit("SET_LOADING", false);
      }
    },
  },

  getters: {
    getStudentSchedule: (state) => state.studentSchedule,

    getScheduleByDay: (state) => (day) => {
      if (!state.studentSchedule?.schedule) return [];
      return state.studentSchedule.schedule.filter(
        (item) => item.schedule.day === day
      );
    },

    getTeacherLoadById: (state) => (id) => {
      return state.teacherLoads.find((load) => load._id === id);
    },
    getLoadsBySemester: (state) => (academicYear, semester) => {
      return state.teacherLoads.filter(
        (load) =>
          load.academicYear === academicYear && load.semester === semester
      );
    },
    getTotalUnitsBySemester: (state) => (academicYear, semester) => {
      return state.teacherLoads
        .filter(
          (load) =>
            load.academicYear === academicYear && load.semester === semester
        )
        .reduce((total, load) => total + (load.totalUnits || 0), 0);
    },
  },
};
