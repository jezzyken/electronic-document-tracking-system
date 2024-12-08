import api from './api';

export default {
  getRoles() {
    return api.get('/role');
  },

  getRole(id) {
    return api.get(`/role/${id}`);
  },

  createRole(roleData) {
    return api.post('/role', roleData);
  },

  updateRole(id, roleData) {
    return api.put(`/role/${id}`, roleData);
  },

  deleteRole(id) {
    return api.delete(`/role/${id}`);
  }
};