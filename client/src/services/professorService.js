import api from './api';

export default {
  getAllProfessors() {
    return api.get('/professor');
  },

  getProfessor(id) {
    return api.get(`/professor/${id}`);
  },

  createProfessor(professorData) {
    return api.post('/professor', professorData);
  },

  updateProfessor(id, professorData) {
    return api.patch(`/professor/${id}`, professorData);
  },

  deleteProfessor(id) {
    return api.delete(`/professor/${id}`);
  },

  getProfessorTeachingLoad(id) {
    return api.get(`/professor/${id}/teaching-load`);
  }
};