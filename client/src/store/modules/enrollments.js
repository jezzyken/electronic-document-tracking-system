import enrollmentService from "@/services/enrollmentService";

export default {
  namespaced: true,

  state: {
    enrollments: [],
    currentEnrollment: null,
    loading: false,
    error: null,
  },

  getters: {
    enrollments: (state) => state.enrollments,
    currentEnrollment: (state) => state.currentEnrollment,
    loading: (state) => state.loading,
    error: (state) => state.error,
  },

  mutations: {
    SET_ENROLLMENTS(state, enrollments) {
      state.enrollments = enrollments;
    },
    SET_CURRENT_ENROLLMENT(state, enrollment) {
      state.currentEnrollment = enrollment;
    },
    ADD_ENROLLMENT(state, enrollment) {
      state.enrollments.push(enrollment);
    },
    UPDATE_ENROLLMENT(state, updatedEnrollment) {
      const index = state.enrollments.findIndex(
        (e) => e._id === updatedEnrollment._id
      );
      if (index !== -1) {
        state.enrollments.splice(index, 1, updatedEnrollment);
      }
    },
    SET_LOADING(state, loading) {
      state.loading = loading;
    },
    SET_ERROR(state, error) {
      state.error = error;
    },
    CLEAR_ERROR(state) {
      state.error = null;
    },
  },

  actions: {
    async enrollNewStudent({ dispatch }, { studentData, enrollmentData }) {
      try {
        const response = await enrollmentService.enrollNewStudent({
          studentData,
          enrollmentData,
        });
        return response.data;
      } catch (error) {
        console.error("Error enrolling new student:", error);
        throw error;
      }
    },

    async enrollContinuingStudent({ dispatch }, { studentId, enrollmentData }) {
      console.log(studentId, enrollmentData);
      try {
        const response = await enrollmentService.enrollContinuingStudent({
          studentId,
          enrollmentData,
        });
        return response.data;
      } catch (error) {
        console.error("Error enrolling continuing student:", error);
        throw error;
      }
    },

    async fetchStudentEnrollments({ commit }, data) {
      try {
        commit("SET_LOADING", true);
        commit("CLEAR_ERROR");
        const response = await enrollmentService.getStudentEnrollments(data);
        commit("SET_CURRENT_ENROLLMENT", response.data.data.enrollments);
      } catch (error) {
        commit(
          "SET_ERROR",
          error.response?.data?.message || "Failed to fetch enrollments"
        );
        throw error;
      } finally {
        commit("SET_LOADING", false);
      }
    },

    async fetchEnrollmentDetails({ commit }, enrollmentId) {
      try {
        commit("SET_LOADING", true);
        commit("CLEAR_ERROR");
        const response = await enrollmentService.getEnrollmentDetails(
          enrollmentId
        );
        commit("SET_CURRENT_ENROLLMENT", response.data.data.enrollment);
      } catch (error) {
        commit(
          "SET_ERROR",
          error.response?.data?.message || "Failed to fetch enrollment details"
        );
        throw error;
      } finally {
        commit("SET_LOADING", false);
      }
    },

    async updateEnrollmentStatus({ commit }, enrollmentId) {
      try {
        commit("SET_LOADING", true);
        commit("CLEAR_ERROR");
        const response = await enrollmentService.updateEnrollmentStatus(
          enrollmentId
        );
        commit("SET_CURRENT_ENROLLMENT", response.data.data);
        return response.data;
      } catch (error) {
        commit(
          "SET_ERROR",
          error.response?.data?.message || "Failed to update enrollment status"
        );
        throw error;
      } finally {
        commit("SET_LOADING", false);
      }
    },
  },
};
