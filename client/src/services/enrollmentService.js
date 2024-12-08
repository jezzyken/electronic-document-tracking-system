import api from "./api";

export default {
  enrollNewStudent(data) {
    return api.post("/enrollment/new-student", data);
  },

  enrollContinuingStudent({studentId, enrollmentData}) {
    return api.post(`/enrollment/continuing-student/${studentId}`, enrollmentData);
  },

  addSubjects(enrollmentId, subjects) {
    return api.post(`/enrollment/${enrollmentId}/subjects`, { subjects });
  },

  dropSubject(enrollmentId, subjectId) {
    return api.patch(`/enrollment/${enrollmentId}/subjects/${subjectId}/drop`);
  },

  getStudentEnrollments(data) {
    return api.get(`/enrollment/student/${data.studentId}`, {
      params: data.query
    });
  },

  getEnrollmentDetails(enrollmentId) {
    return api.get(`/enrollment/${enrollmentId}`);
  },

  updateEnrollmentStatus(enrollmentId) {
    return api.patch(`/enrollment/${enrollmentId}`);
  },
};
