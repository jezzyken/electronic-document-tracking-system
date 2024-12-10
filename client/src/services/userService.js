import api from "./api";

export default {
  getUsers() {
    return api.get("/user");
  },

  getUser(id) {
    return api.get(`/user/${id}`);
  },

  createUser(userData) {
    return api.post("/user", userData);
  },

  updateUser(id, userData) {
    return api.put(`/user/${id}`, userData);
  },

  deleteUser(id) {
    return api.delete(`/user/${id}`);
  },

  changePassword(passwordData) {
    return api.post("/user/change-password", passwordData);
  },
};
