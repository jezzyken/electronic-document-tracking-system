import documentService from "@/services/documentService";

export default {
  namespaced: true,

  state: {
    documents: [],
    currentDocument: null,
    loading: false,
    error: null,
      userRole: JSON.parse(localStorage.getItem('user'))?.role || null
  },

  getters: {
    documents: (state) => state.documents,
    currentDocument: (state) => state.currentDocument,
    loading: (state) => state.loading,
    error: (state) => state.error,
  },

  mutations: {
    SET_DOCUMENTS(state, documents) {
      state.documents = documents;
    },
    SET_CURRENT_DOCUMENT(state, document) {
      state.currentDocument = document;
    },
    ADD_DOCUMENT(state, document) {
      state.documents.push(document);
    },
    UPDATE_DOCUMENT(state, updatedDocument) {
      const index = state.documents.findIndex(
        (d) => d._id === updatedDocument._id
      );
      if (index !== -1) {
        state.documents.splice(index, 1, updatedDocument);
      }
    },
    REMOVE_DOCUMENT(state, documentId) {
      state.documents = state.documents.filter((d) => d._id !== documentId);
    },
    SET_LOADING(state, loading) {
      state.loading = loading;
    },
    SET_ERROR(state, error) {
      state.error = error;
    },
    CLEAR_ERROR(state) {
      state.error = null;
    },
  },

  actions: {
    async fetchDocuments({ commit }, query) {
      try {
        commit("SET_LOADING", true);
        commit("CLEAR_ERROR");
        const response = await documentService.getDocuments(query);
        commit("SET_DOCUMENTS", response.data);
      } catch (error) {
        commit(
          "SET_ERROR",
          error.response?.data?.message || "Failed to fetch documents"
        );
        throw error;
      } finally {
        commit("SET_LOADING", false);
      }
    },

    async uploadDocument({ commit }, { formData, config }) {
      try {
        commit("SET_LOADING", true);
        commit("CLEAR_ERROR");
        const response = await documentService.uploadDocument(formData, config);
        commit("ADD_DOCUMENT", response.data);
        return response.data;
      } catch (error) {
        commit("SET_ERROR", error.response?.data?.message || "Upload failed");
        throw error;
      } finally {
        commit("SET_LOADING", false);
      }
    },

    async updateDocumentStatus({ commit }, data) {
      console.log(data);
      try {
        commit("SET_LOADING", true);
        commit("CLEAR_ERROR");
        const response = await documentService.updateStatus(data);
        commit("UPDATE_DOCUMENT", response.data);
        return response.data;
      } catch (error) {
        commit(
          "SET_ERROR",
          error.response?.data?.message || "Failed to update status"
        );
        throw error;
      } finally {
        commit("SET_LOADING", false);
      }
    },

    async deleteDocument({ commit }, id) {
      try {
        commit("SET_LOADING", true);
        commit("CLEAR_ERROR");
        await documentService.deleteDocument(id);
        commit("REMOVE_DOCUMENT", id);
      } catch (error) {
        commit(
          "SET_ERROR",
          error.response?.data?.message || "Failed to delete document"
        );
        throw error;
      } finally {
        commit("SET_LOADING", false);
      }
    },

    async downloadDocument({ commit }, item) {
      try {
        commit("SET_LOADING", true);
        commit("CLEAR_ERROR");
        const response = await documentService.downloadDocument(item._id);

        const ext = item.name.split(".").pop().toLowerCase();
        const types = {
          pdf: "application/pdf",
          doc: "application/msword",
          docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
          txt: "text/plain",
          zip: "application/zip",
        };
        const fileType = types[ext] || "application/octet-stream";

        const blob = new Blob([response.data], { type: fileType });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = item.name;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      } catch (error) {
        commit("SET_ERROR", error.response?.data?.message || "Download failed");
        throw error;
      } finally {
        commit("SET_LOADING", false);
      }
    },
  },
};
