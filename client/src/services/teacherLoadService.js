import api from "./api";

export default {
  getAllTeacherLoads(query = {}) {
    return api.get("/teacher-load", { params: query });
  },

  getTeacherLoadsForProfessor(professorId) {
    return api.get(`/teacher-load/professor/${professorId}`);
  },

  getTeacherLoad(id) {
    return api.get(`/teacher-load/${id}`);
  },

  getStudentSchedule(query) {
    return api.get(`/teacher-load/student-schedule`, { params: query });
  },

  fetchStudentSubjectGrade(query) {
    return api.get(`/teacher-load/student/grade`, { params: query });
  },

  createTeacherLoad(loadData) {
    return api.post("/teacher-load", loadData);
  },

  updateTeacherLoad(id, loadData) {
    return api.patch(`/teacher-load/${id}`, loadData);
  },

  deleteTeacherLoad(id) {
    return api.delete(`/teacher-load/${id}`);
  },

  checkConflictSchedule(data) {
    if (!data.professorId) {
      throw new Error("Professor ID is required");
    }
    return api.post("/teacher-load/check-conflicts", data);
  },
  getAvailableSubjects(academicYear, semester) {
    return api.get("/teacher-load/available-subjects", {
      params: { academicYear, semester },
    });
  },
  updateTeacherLoadStudents(data) {
    return api.patch(`/teacher-load/students`, data);
  },

  updateStudentGrade(data) {
    return api.patch(`/teacher-load/student/grade`, data);
  },
};
