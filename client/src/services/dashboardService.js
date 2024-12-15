import api from './api';

export default {
  getDashboardStats() {
    return api.get('/dashboard/stats');
  },
  getDocumentTimeline(documentId) {
    return api.get(`/dashboard/timeline/${documentId}`);
  },
  getDocumentRequests(params) {
    return api.get('/dashboard/requests', { params });
  }
};