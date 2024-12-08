import api from "./api";

export default {
  uploadDocument(formData, config) {
    return api.post("/document/upload", formData, {
      headers: { "Content-Type": "multipart/form-data" },
      onUploadProgress: config?.onUploadProgress,
    });
  },

  getDocuments(query = {}) {
    console.log(query)
    return api.get("/document", { params: query });
  },

  getDocument(id) {
    return api.get(`/document/${id}`);
  },
  updateStatus(data) {
    return api.patch(`/document/${data.id}/status`, data.data);
  },

  deleteDocument(id) {
    return api.delete(`/document/${id}`);
  },

  downloadDocument(id) {
    return api.get(`/document/${id}/download`, {
      responseType: "blob",
    });
  },
};
