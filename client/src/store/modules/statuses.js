import statusService from "@/services/statusService";

export default {
  namespaced: true,

  state: {
    statuses: [],
    currentStatus: null,
    loading: false,
    error: null,
  },

  getters: {
    statuses: (state) => state.statuses,
    currentStatus: (state) => state.currentStatus,
    loading: (state) => state.loading,
    error: (state) => state.error,
  },

  mutations: {
    SET_STATUSES(state, statuses) {
      state.statuses = statuses;
    },
    SET_CURRENT_STATUS(state, status) {
      state.currentStatus = status;
    },
    ADD_STATUS(state, status) {
      state.statuses.push(status);
    },
    UPDATE_STATUS(state, updatedStatus) {
      const index = state.statuses.findIndex(
        (s) => s._id === updatedStatus._id
      );
      if (index !== -1) {
        state.statuses.splice(index, 1, updatedStatus);
      }
    },
    REMOVE_STATUS(state, statusId) {
      state.statuses = state.statuses.filter((s) => s._id !== statusId);
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
    async fetchStatuses({ commit }) {
      try {
        commit("SET_LOADING", true);
        commit("CLEAR_ERROR");
        const response = await statusService.getStatuses();
        commit("SET_STATUSES", response.data);
      } catch (error) {
        commit(
          "SET_ERROR",
          error.response?.data?.message || "Failed to fetch statuses"
        );
        throw error;
      } finally {
        commit("SET_LOADING", false);
      }
    },

    async fetchStatus({ commit }, id) {
      try {
        commit("SET_LOADING", true);
        commit("CLEAR_ERROR");
        const response = await statusService.getStatus(id);
        commit("SET_CURRENT_STATUS", response.data);
      } catch (error) {
        commit(
          "SET_ERROR",
          error.response?.data?.message || "Failed to fetch status"
        );
        throw error;
      } finally {
        commit("SET_LOADING", false);
      }
    },

    async createStatus({ commit }, statusData) {
      try {
        commit("SET_LOADING", true);
        commit("CLEAR_ERROR");
        const response = await statusService.createStatus(statusData);
        commit("ADD_STATUS", response.data);
        return response.data;
      } catch (error) {
        commit(
          "SET_ERROR",
          error.response?.data?.message || "Failed to create status"
        );
        throw error;
      } finally {
        commit("SET_LOADING", false);
      }
    },

    async updateStatus({ commit }, { id, statusData }) {
      try {
        commit("SET_LOADING", true);
        commit("CLEAR_ERROR");
        const response = await statusService.updateStatus(id, statusData);
        commit("UPDATE_STATUS", response.data);
        return response.data;
      } catch (error) {
        commit(
          "SET_ERROR",
          error.response?.data?.message || "Failed to update status"
        );
        throw error;
      } finally {
        commit("SET_LOADING", false);
      }
    },

    async deleteStatus({ commit }, id) {
      try {
        commit("SET_LOADING", true);
        commit("CLEAR_ERROR");
        await statusService.deleteStatus(id);
        commit("REMOVE_STATUS", id);
      } catch (error) {
        commit(
          "SET_ERROR",
          error.response?.data?.message || "Failed to delete status"
        );
        throw error;
      } finally {
        commit("SET_LOADING", false);
      }
    },
  },
};
