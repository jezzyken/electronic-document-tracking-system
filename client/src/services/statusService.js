import api from "./api";

export default {
  getStatuses() {
    return api.get("/status");
  },

  getStatus(id) {
    return api.get(`/status/${id}`);
  },

  createStatus(statusData) {
    return api.post("/status", statusData);
  },

  updateStatus(id, statusData) {
    return api.put(`/status/${id}`, statusData);
  },

  deleteStatus(id) {
    return api.delete(`/status/${id}`);
  },
};
