import api from "./api";

export default {
  getDocuments() {
    return api.get("/document/documents");
  },

  getDocument(id) {
    return api.get(`/document/documents/${id}`);
  },

  createDocument(documentData) {
    const formData = new FormData();

    formData.append("documents", JSON.stringify(documentData.documents));
    formData.append("tracking", JSON.stringify(documentData.tracking[0]));

    if (documentData.tracking[0].documents.attachments) {
      documentData.tracking[0].documents.attachments.forEach((_, index) => {
        const originalFile = documentData.newDocument.attachments[index];
        formData.append("attachments", originalFile);
      });
    }

    return api.post("/document/documents", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },

  addTracking(data) {
    const documentId = data.documentId;
    const trackingData = data.trackingData;

    const formData = new FormData();

    formData.append("fromDepartment", trackingData.fromDepartment);
    formData.append("toDepartment", trackingData.toDepartment);
    formData.append("sentBy", trackingData.sentBy);
    formData.append("status", trackingData.status);
    formData.append("comments", trackingData.comments);

    if (trackingData.attachments) {
      trackingData.attachments.forEach((file) => {
        formData.append("attachments", file);
      });
    }

    return api.post(`/document/documents/${documentId}/tracking`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },

  updateTracking(documentId, trackingId, data) {
    return api.patch(
      `/document/documents/${documentId}/tracking/${trackingId}`,
      data
    );
  },
};
