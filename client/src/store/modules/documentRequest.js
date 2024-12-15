import documentRequestService from '@/services/documentRequestService';

export default {
  namespaced: true,
  state: {
    requests: [],
    currentRequest: null,
    loading: false,
    error: null,
    pagination: {
      currentPage: 1,
      totalPages: 1,
      totalRequests: 0
    }
  },
  getters: {
    requests: state => state.requests,
    currentRequest: state => state.currentRequest,
    loading: state => state.loading,
    error: state => state.error,
    pagination: state => state.pagination
  },
  mutations: {
    SET_REQUESTS(state, requests) {
      state.requests = requests;
    },
    SET_CURRENT_REQUEST(state, request) {
      state.currentRequest = request;
    },
    SET_PAGINATION(state, pagination) {
      state.pagination = pagination;
    },
    ADD_REQUEST(state, request) {
      state.requests.unshift(request);
    },
    UPDATE_REQUEST(state, updatedRequest) {
      const index = state.requests.findIndex(r => r.trackingNumber === updatedRequest.trackingNumber);
      if (index !== -1) {
        state.requests.splice(index, 1, updatedRequest);
      }
    },
    REMOVE_REQUEST(state, trackingNumber) {
      state.requests = state.requests.filter(r => r.trackingNumber !== trackingNumber);
    },
    SET_LOADING(state, loading) {
      state.loading = loading;
    },
    SET_ERROR(state, error) {
      state.error = error;
    },
    CLEAR_ERROR(state) {
      state.error = null;
    }
  },
  actions: {
    async fetchRequests({ commit }, params) {
      try {
        commit('SET_LOADING', true);
        commit('CLEAR_ERROR');
        const response = await documentRequestService.getDocumentRequests(params);
        commit('SET_REQUESTS', response.data.requests);
        commit('SET_PAGINATION', {
          currentPage: response.data.currentPage,
          totalPages: response.data.totalPages,
          totalRequests: response.data.totalRequests
        });
      } catch (error) {
        commit('SET_ERROR', error.response?.data?.message || 'Failed to fetch requests');
        throw error;
      } finally {
        commit('SET_LOADING', false);
      }
    },
    async fetchRequest({ commit }, trackingNumber) {
      try {
        commit('SET_LOADING', true);
        commit('CLEAR_ERROR');
        const response = await documentRequestService.getDocumentRequest(trackingNumber);
        commit('SET_CURRENT_REQUEST', response.data);
      } catch (error) {
        commit('SET_ERROR', error.response?.data?.message || 'Failed to fetch request');
        throw error;
      } finally {
        commit('SET_LOADING', false);
      }
    },
    async createRequest({ commit }, requestData) {
      try {
        commit('SET_LOADING', true);
        commit('CLEAR_ERROR');
        const response = await documentRequestService.createDocumentRequest(requestData);
        commit('ADD_REQUEST', response.data);
        return response.data;
      } catch (error) {
        commit('SET_ERROR', error.response?.data?.message || 'Failed to create request');
        throw error;
      } finally {
        commit('SET_LOADING', false);
      }
    },
    async updateRequestStatus({ commit }, { trackingNumber, statusData }) {
      try {
        commit('SET_LOADING', true);
        commit('CLEAR_ERROR');
        const response = await documentRequestService.updateDocumentRequestStatus(trackingNumber, statusData);
        commit('UPDATE_REQUEST', response.data);
        return response.data;
      } catch (error) {
        commit('SET_ERROR', error.response?.data?.message || 'Failed to update request status');
        throw error;
      } finally {
        commit('SET_LOADING', false);
      }
    },
    async deleteRequest({ commit }, trackingNumber) {
      try {
        commit('SET_LOADING', true);
        commit('CLEAR_ERROR');
        await documentRequestService.deleteDocumentRequest(trackingNumber);
        commit('REMOVE_REQUEST', trackingNumber);
      } catch (error) {
        commit('SET_ERROR', error.response?.data?.message || 'Failed to delete request');
        throw error;
      } finally {
        commit('SET_LOADING', false);
      }
    }
  }
};