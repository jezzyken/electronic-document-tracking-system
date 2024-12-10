import documentService from "@/services/documentService";

export default {
  namespaced: true,

  state: {
    documents: [],
    currentDocument: null,
    loading: false,
    error: null,
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
    UPDATE_DOCUMENT_STATUS(state, { documentId, status }) {
      const document = state.documents.find((d) => d._id === documentId);
      if (document) {
        document.status = status;
      }
    },

    UPDATE_TRACKING(state, { documentId, trackingId, data }) {
      const document = state.documents.find((d) => d._id === documentId);
      if (document && document.tracking) {
        const trackingIndex = document.tracking.findIndex(
          (t) => t._id === trackingId
        );
        if (trackingIndex !== -1) {
          document.tracking[trackingIndex] = {
            ...document.tracking[trackingIndex],
            ...data,
          };
        }
      }
    },

    ADD_TRACKING(state, { documentId, tracking }) {
      const document = state.documents.find((d) => d._id === documentId);
      if (document) {
        if (!document.tracking) document.tracking = [];
        document.tracking.push(tracking);
      }
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
    async fetchDocuments({ commit }) {
      try {
        commit("SET_LOADING", true);
        commit("CLEAR_ERROR");
        const response = await documentService.getDocuments();
        console.log({ response });
        commit("SET_DOCUMENTS", response.data);
      } catch (error) {
        commit(
          "SET_ERROR",
          error.response?.data?.error || "Failed to fetch documents"
        );
        throw error;
      } finally {
        commit("SET_LOADING", false);
      }
    },

    async fetchDocument({ commit }, id) {
      try {
        commit("SET_LOADING", true);
        commit("CLEAR_ERROR");
        const response = await documentService.getDocument(id);
        commit("SET_CURRENT_DOCUMENT", response.data);
      } catch (error) {
        commit(
          "SET_ERROR",
          error.response?.data?.error || "Failed to fetch document"
        );
        throw error;
      } finally {
        commit("SET_LOADING", false);
      }
    },

    async createDocument({ commit }, newDocument) {
      try {
        commit("SET_LOADING", true);
        commit("CLEAR_ERROR");

        const response = await documentService.createDocument(newDocument);
        commit("ADD_DOCUMENT", response.data);
        return response.data;
      } catch (error) {
        commit(
          "SET_ERROR",
          error.response?.data?.error || "Failed to create document"
        );
        throw error;
      } finally {
        commit("SET_LOADING", false);
      }
    },

    async addTracking({ commit }, data) {
      try {
        commit("SET_LOADING", true);
        commit("CLEAR_ERROR");

        const response = await documentService.addTracking(data);
        commit("ADD_TRACKING", {
          documentId: data.documentId,
          tracking: response.data,
        });
        commit("UPDATE_DOCUMENT_STATUS", {
          documentId: data.documentId,
          status: response.data.status,
        });
        return response.data;
      } catch (error) {
        commit(
          "SET_ERROR",
          error.response?.data?.error || "Failed to add tracking"
        );
        throw error;
      } finally {
        commit("SET_LOADING", false);
      }
    },

    async updateTracking({ commit }, { documentId, trackingId, trackingData }) {
      try {
        commit("SET_LOADING", true);
        commit("CLEAR_ERROR");

        const response = await documentService.updateTracking(
          documentId,
          trackingId,
          trackingData
        );

        commit("UPDATE_TRACKING", {
          documentId,
          trackingId,
          data: response.data,
        });

        return response.data;
      } catch (error) {
        commit(
          "SET_ERROR",
          error.response?.data?.error || "Failed to update tracking"
        );
        throw error;
      } finally {
        commit("SET_LOADING", false);
      }
    },
  },
};
