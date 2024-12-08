import courseService from "@/services/courseService";

export default {
  namespaced: true,

  state: {
    courses: [],
    currentCourse: null,
    loading: false,
    error: null,
  },

  getters: {
    courses: (state) => state.courses,
    currentCourse: (state) => state.currentCourse,
    loading: (state) => state.loading,
    error: (state) => state.error,
  },

  mutations: {
    SET_COURSES(state, courses) {
      state.courses = courses;
    },
    SET_CURRENT_COURSE(state, course) {
      state.currentCourse = course;
    },
    ADD_COURSE(state, course) {
      state.courses.push(course);
    },
    UPDATE_COURSE(state, updatedCourse) {
      const index = state.courses.findIndex((c) => c._id === updatedCourse._id);
      if (index !== -1) {
        state.courses.splice(index, 1, updatedCourse);
      }
    },
    REMOVE_COURSE(state, courseId) {
      state.courses = state.courses.filter((c) => c._id !== courseId);
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
    async fetchCourses({ commit }) {
      try {
        commit("SET_LOADING", true);
        commit("CLEAR_ERROR");
        const response = await courseService.getCourses();
        console.log(response)
        commit("SET_COURSES", response.data.data.courses);
      } catch (error) {
        commit(
          "SET_ERROR",
          error.response?.data?.message || "Failed to fetch courses"
        );
        throw error;
      } finally {
        commit("SET_LOADING", false);
      }
    },

    async fetchCourse({ commit }, id) {
      try {
        commit("SET_LOADING", true);
        commit("CLEAR_ERROR");
        const response = await courseService.getCourse(id);
        commit("SET_CURRENT_COURSE", response.data.data.course);
      } catch (error) {
        commit(
          "SET_ERROR",
          error.response?.data?.message || "Failed to fetch course"
        );
        throw error;
      } finally {
        commit("SET_LOADING", false);
      }
    },

    async fetchCourseByName({ commit }, courseName) {
      try {
        commit("SET_LOADING", true);
        commit("CLEAR_ERROR");
        const response = await courseService.getCourseByName(courseName);
        commit("SET_CURRENT_COURSE", response.data.data.course);
      } catch (error) {
        commit(
          "SET_ERROR",
          error.response?.data?.message || "Failed to fetch course"
        );
        throw error;
      } finally {
        commit("SET_LOADING", false);
      }
    },

    async createCourse({ commit }, courseData) {
      try {
        commit("SET_LOADING", true);
        commit("CLEAR_ERROR");
        const response = await courseService.createCourse(courseData);
        commit("ADD_COURSE", response.data.data.course);
        return response.data.data.course;
      } catch (error) {
        commit(
          "SET_ERROR",
          error.response?.data?.message || "Failed to create course"
        );
        throw error;
      } finally {
        commit("SET_LOADING", false);
      }
    },

    async updateCourse({ commit }, { id, courseData }) {
      try {
        commit("SET_LOADING", true);
        commit("CLEAR_ERROR");
        const response = await courseService.updateCourse(id, courseData);
        commit("UPDATE_COURSE", response.data.data.course);
        return response.data.data.course;
      } catch (error) {
        commit(
          "SET_ERROR",
          error.response?.data?.message || "Failed to update course"
        );
        throw error;
      } finally {
        commit("SET_LOADING", false);
      }
    },

    async deleteCourse({ commit }, id) {
      try {
        commit("SET_LOADING", true);
        commit("CLEAR_ERROR");
        await courseService.deleteCourse(id);
        commit("REMOVE_COURSE", id);
      } catch (error) {
        commit(
          "SET_ERROR",
          error.response?.data?.message || "Failed to delete course"
        );
        throw error;
      } finally {
        commit("SET_LOADING", false);
      }
    },
  },
};
