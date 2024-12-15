import api from "./api";

export default {
  getDocumentRequests(params) {
    return api.get("/document-request", { params });
  },
  getDocumentRequest(trackingNumber) {
    return api.get(`/document-request/${trackingNumber}`);
  },
  createDocumentRequest(requestData) {
    return api.post("/document-request", requestData);
  },
  updateDocumentRequestStatus(trackingNumber, statusData) {
    return api.patch(`/document-request/${trackingNumber}/status`, statusData);
  },
  updateDocumentRequest(trackingNumber, requestData) {
    return api.put(`/document-request/${trackingNumber}`, requestData);
  },
  deleteDocumentRequest(trackingNumber) {
    return api.delete(`/document-request/${trackingNumber}`);
  },
};
