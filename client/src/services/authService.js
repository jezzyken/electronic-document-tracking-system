import api from './api';

export default {
  login(credentials) {
    return api.post('/auth/login', credentials);
  },
  register(userData) {
    return api.post('/user', userData);
  },
  getCurrentUser() {
    return api.get('/auth/me');
  },
  verifyToken() {
    return axios.get('auth/verify-token', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    })
  }
};