import studentService from "@/services/studentService";

export default {
  namespaced: true,

  state: {
    students: [],
    currentStudent: null,
    loading: false,
    error: null,
  },

  getters: {
    students: (state) => state.students,
    currentStudent: (state) => state.currentStudent,
    loading: (state) => state.loading,
    error: (state) => state.error,
  },

  mutations: {
    SET_STUDENTS(state, students) {
      console.log(students)
      state.students = students;
    },
    SET_CURRENT_STUDENT(state, student) {
      state.currentStudent = student;
    },
    ADD_STUDENT(state, student) {
      state.students.push(student);
    },
    UPDATE_STUDENT(state, updatedStudent) {
      const index = state.students.findIndex((s) => s._id === updatedStudent._id);
      if (index !== -1) {
        state.students.splice(index, 1, updatedStudent);
      }
    },
    REMOVE_STUDENT(state, studentId) {
      state.students = state.students.filter((s) => s._id !== studentId);
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
    async fetchStudents({ commit }) {
      try {
        commit("SET_LOADING", true);
        commit("CLEAR_ERROR");
        const response = await studentService.getAllStudents();
        console.log(response)
        commit("SET_STUDENTS", response.data.data.students);
      } catch (error) {
        commit(
          "SET_ERROR",
          error.response?.data?.message || "Failed to fetch students"
        );
        throw error;
      } finally {
        commit("SET_LOADING", false);
      }
    },

    async fetchStudent({ commit }, id) {
      try {
        commit("SET_LOADING", true);
        commit("CLEAR_ERROR");
        const response = await studentService.getStudent(id);
        console.log(response)
        commit("SET_CURRENT_STUDENT", response.data.data.student);
      } catch (error) {
        commit(
          "SET_ERROR",
          error.response?.data?.message || "Failed to fetch student"
        );
        throw error;
      } finally {
        commit("SET_LOADING", false);
      }
    },

    async createStudent({ commit }, studentData) {
      try {
        commit("SET_LOADING", true);
        commit("CLEAR_ERROR");
        const response = await studentService.createStudent(studentData);
        commit("ADD_STUDENT", response.data.data.student);
        return response.data.data.student;
      } catch (error) {
        commit(
          "SET_ERROR",
          error.response?.data?.message || "Failed to create student"
        );
        throw error;
      } finally {
        commit("SET_LOADING", false);
      }
    },

    async updateStudent({ commit }, { id, studentData }) {
      try {
        commit("SET_LOADING", true);
        commit("CLEAR_ERROR");
        const response = await studentService.updateStudent(id, studentData);
        commit("UPDATE_STUDENT", response.data.data.student);
        return response.data.data.student;
      } catch (error) {
        commit(
          "SET_ERROR",
          error.response?.data?.message || "Failed to update student"
        );
        throw error;
      } finally {
        commit("SET_LOADING", false);
      }
    },

    async deleteStudent({ commit }, id) {
      try {
        commit("SET_LOADING", true);
        commit("CLEAR_ERROR");
        await studentService.deleteStudent(id);
        commit("REMOVE_STUDENT", id);
      } catch (error) {
        commit(
          "SET_ERROR",
          error.response?.data?.message || "Failed to delete student"
        );
        throw error;
      } finally {
        commit("SET_LOADING", false);
      }
    },
  },
};