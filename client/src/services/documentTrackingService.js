import api from "./api";

export default {
  getTrackings(documentId) {
    return api.get(`/tracking/${documentId}`);
  },
  createTracking(trackingData) {
    const formData = new FormData();

    Object.keys(trackingData).forEach((key) => {
      if (key !== "attachments") {
        formData.append(key, JSON.stringify(trackingData[key]));
      }
    });

    if (trackingData.attachments) {
      trackingData.attachments.forEach((file) => {
        formData.append("attachments", file);
      });
    }

    return api.post("/tracking", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },
  updateTracking(id, trackingData) {
    return api.put(`/tracking/${id}`, trackingData);
  },
  deleteTracking(id) {
    return api.delete(`/tracking/${id}`);
  },
};
