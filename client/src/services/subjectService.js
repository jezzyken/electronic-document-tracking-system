import api from './api';

export default {
  getAllSubjects(query) {
    return api.get('/subject', {
      params: query
    });
  },

  getSubject(id) {
    return api.get(`/subject/${id}`);
  },

  createSubject(subjectData) {
    return api.post('/subject', subjectData);
  },

  updateSubject(id, subjectData) {
    return api.patch(`/subject/${id}`, subjectData);
  },

  deleteSubject(id) {
    return api.delete(`/subject/${id}`);
  },

  getSubjectsByYearAndSemester(yearLevel, semester) {
    return api.get(`/subject/year/${yearLevel}/semester/${semester}`);
  }
};