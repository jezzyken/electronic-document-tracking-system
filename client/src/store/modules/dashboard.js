import dashboardService from '@/services/dashboardService';

export default {
  namespaced: true,
  state: {
    stats: {
      documentStats: {},
      priorityStats: {},
      requestStats: {},
      recentActivities: []
    },
    documentTimeline: {
      document: null,
      timeline: []
    },
    documentRequests: {
      requests: [],
      pagination: {
        currentPage: 1,
        totalPages: 1,
        totalItems: 0
      },
      statusCounts: {}
    },
    loading: false,
    error: null
  },

  getters: {
    stats: state => state.stats,
    documentTimeline: state => state.documentTimeline,
    documentRequests: state => state.documentRequests,
    loading: state => state.loading,
    error: state => state.error
  },

  mutations: {
    SET_STATS(state, stats) {
      state.stats = stats;
    },
    SET_DOCUMENT_TIMELINE(state, timeline) {
      state.documentTimeline = timeline;
    },
    SET_DOCUMENT_REQUESTS(state, data) {
      state.documentRequests = data;
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
    async fetchDashboardStats({ commit }) {
      try {
        commit('SET_LOADING', true);
        commit('CLEAR_ERROR');
        const response = await dashboardService.getDashboardStats();
        commit('SET_STATS', response.data);
      } catch (error) {
        commit('SET_ERROR', error.response?.data?.message || 'Failed to fetch dashboard statistics');
        throw error;
      } finally {
        commit('SET_LOADING', false);
      }
    },

    async fetchDocumentTimeline({ commit }, documentId) {
      try {
        commit('SET_LOADING', true);
        commit('CLEAR_ERROR');
        const response = await dashboardService.getDocumentTimeline(documentId);
        commit('SET_DOCUMENT_TIMELINE', response.data);
      } catch (error) {
        commit('SET_ERROR', error.response?.data?.message || 'Failed to fetch document timeline');
        throw error;
      } finally {
        commit('SET_LOADING', false);
      }
    },

    async fetchDocumentRequests({ commit }, params) {
      try {
        commit('SET_LOADING', true);
        commit('CLEAR_ERROR');
        const response = await dashboardService.getDocumentRequests(params);
        commit('SET_DOCUMENT_REQUESTS', response.data);
      } catch (error) {
        commit('SET_ERROR', error.response?.data?.message || 'Failed to fetch document requests');
        throw error;
      } finally {
        commit('SET_LOADING', false);
      }
    }
  }
};