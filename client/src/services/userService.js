import api from './api';

export default {
  getUsers() {
    return api.get('/user');
  },

  getUser(id) {
    return api.get(`/user/${id}`);
  },

  createUser(userData) {
    return api.post('/user', userData);
  },

  updateUser(id, userData) {
    return api.patch(`/user/${id}`, userData);
  },

  deleteUser(id) {
    return api.delete(`/user/${id}`);
  }
};