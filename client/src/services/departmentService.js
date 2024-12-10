import api from "./api";

export default {
  getDepartments() {
    return api.get("/department");
  },

  getDepartment(id) {
    return api.get(`/department/${id}`);
  },

  createDepartment(departmentData) {
    return api.post("/department", departmentData);
  },

  updateDepartment(id, departmentData) {
    return api.patch(`/department/${id}`, departmentData);
  },

  deleteDepartment(id) {
    return api.delete(`/department/${id}`);
  },
};
