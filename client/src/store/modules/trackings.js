import documentTrackingService from "@/services/documentTrackingService";

export default {
  namespaced: true,
  state: {
    trackings: [],
    loading: false,
    error: null,
  },
  getters: {
    trackings: (state) => state.trackings,
    loading: (state) => state.loading,
    error: (state) => state.error,
  },
  mutations: {
    SET_TRACKINGS(state, trackings) {
      state.trackings = trackings;
    },
    ADD_TRACKING(state, tracking) {
      state.trackings.push(tracking);
    },
    UPDATE_TRACKING(state, updatedTracking) {
      const index = state.trackings.findIndex(
        (t) => t._id === updatedTracking._id
      );
      if (index !== -1) {
        state.trackings.splice(index, 1, updatedTracking);
      }
    },
    REMOVE_TRACKING(state, trackingId) {
      state.trackings = state.trackings.filter((t) => t._id !== trackingId);
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
    async fetchTrackings({ commit }, documentId) {
      try {
        commit("SET_LOADING", true);
        commit("CLEAR_ERROR");
        const response = await documentTrackingService.getTrackings(documentId);
        commit("SET_TRACKINGS", response.data);
      } catch (error) {
        commit(
          "SET_ERROR",
          error.response?.data?.message || "Failed to fetch trackings"
        );
        throw error;
      } finally {
        commit("SET_LOADING", false);
      }
    },
    async createTracking({ commit }, trackingData) {
      try {
        commit("SET_LOADING", true);
        commit("CLEAR_ERROR");
        const response = await documentTrackingService.createTracking(
          trackingData
        );
        commit("ADD_TRACKING", response.data);
        return response.data;
      } catch (error) {
        commit(
          "SET_ERROR",
          error.response?.data?.message || "Failed to create tracking"
        );
        throw error;
      } finally {
        commit("SET_LOADING", false);
      }
    },
    async updateTracking({ commit }, { id, trackingData }) {
      try {
        commit("SET_LOADING", true);
        commit("CLEAR_ERROR");
        const response = await documentTrackingService.updateTracking(
          id,
          trackingData
        );
        commit("UPDATE_TRACKING", response.data);
        return response.data;
      } catch (error) {
        commit(
          "SET_ERROR",
          error.response?.data?.message || "Failed to update tracking"
        );
        throw error;
      } finally {
        commit("SET_LOADING", false);
      }
    },
    async deleteTracking({ commit }, id) {
      try {
        commit("SET_LOADING", true);
        commit("CLEAR_ERROR");
        await documentTrackingService.deleteTracking(id);
        commit("REMOVE_TRACKING", id);
      } catch (error) {
        commit(
          "SET_ERROR",
          error.response?.data?.message || "Failed to delete tracking"
        );
        throw error;
      } finally {
        commit("SET_LOADING", false);
      }
    },
  },
};
