import departmentService from "@/services/departmentService";

export default {
  namespaced: true,

  state: {
    departments: [],
    currentDepartment: null,
    loading: false,
    error: null,
  },

  getters: {
    departments: (state) => state.departments,
    currentDepartment: (state) => state.currentDepartment,
    loading: (state) => state.loading,
    error: (state) => state.error,
  },

  mutations: {
    SET_DEPARTMENTS(state, departments) {
      state.departments = departments;
    },
    SET_CURRENT_DEPARTMENT(state, department) {
      state.currentDepartment = department;
    },
    ADD_DEPARTMENT(state, department) {
      state.departments.push(department);
    },
    UPDATE_DEPARTMENT(state, updatedDepartment) {
      const index = state.departments.findIndex(
        (d) => d._id === updatedDepartment._id
      );
      if (index !== -1) {
        state.departments.splice(index, 1, updatedDepartment);
      }
    },
    REMOVE_DEPARTMENT(state, departmentId) {
      state.departments = state.departments.filter(
        (d) => d._id !== departmentId
      );
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
    async fetchDepartments({ commit }) {
      try {
        commit("SET_LOADING", true);
        commit("CLEAR_ERROR");
        const response = await departmentService.getDepartments();
        commit("SET_DEPARTMENTS", response.data);
      } catch (error) {
        commit(
          "SET_ERROR",
          error.response?.data?.message || "Failed to fetch departments"
        );
        throw error;
      } finally {
        commit("SET_LOADING", false);
      }
    },

    async fetchDepartment({ commit }, id) {
      try {
        commit("SET_LOADING", true);
        commit("CLEAR_ERROR");
        const response = await departmentService.getDepartment(id);
        commit("SET_CURRENT_DEPARTMENT", response.data);
      } catch (error) {
        commit(
          "SET_ERROR",
          error.response?.data?.message || "Failed to fetch department"
        );
        throw error;
      } finally {
        commit("SET_LOADING", false);
      }
    },

    async createDepartment({ commit }, departmentData) {
      try {
        commit("SET_LOADING", true);
        commit("CLEAR_ERROR");
        const response = await departmentService.createDepartment(
          departmentData
        );
        commit("ADD_DEPARTMENT", response.data);
        return response.data;
      } catch (error) {
        commit(
          "SET_ERROR",
          error.response?.data?.message || "Failed to create department"
        );
        throw error;
      } finally {
        commit("SET_LOADING", false);
      }
    },

    async updateDepartment({ commit }, { id, departmentData }) {
      try {
        commit("SET_LOADING", true);
        commit("CLEAR_ERROR");
        const response = await departmentService.updateDepartment(
          id,
          departmentData
        );
        commit("UPDATE_DEPARTMENT", response.data);
        return response.data;
      } catch (error) {
        commit(
          "SET_ERROR",
          error.response?.data?.message || "Failed to update department"
        );
        throw error;
      } finally {
        commit("SET_LOADING", false);
      }
    },

    async deleteDepartment({ commit }, id) {
      try {
        commit("SET_LOADING", true);
        commit("CLEAR_ERROR");
        await departmentService.deleteDepartment(id);
        commit("REMOVE_DEPARTMENT", id);
      } catch (error) {
        commit(
          "SET_ERROR",
          error.response?.data?.message || "Failed to delete department"
        );
        throw error;
      } finally {
        commit("SET_LOADING", false);
      }
    },
  },
};
