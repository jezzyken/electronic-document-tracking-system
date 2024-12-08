import professorService from "@/services/professorService";

export default {
  namespaced: true,

  state: {
    professors: [],
    currentProfessor: null,
    teachingLoad: null,
    totalProfessors: 0,
    loading: false,
    error: null,
  },

  mutations: {
    SET_PROFESSORS(state, professors) {
      state.professors = professors;
    },
    SET_CURRENT_PROFESSOR(state, professor) {
      state.currentProfessor = professor;
    },
    SET_TEACHING_LOAD(state, teachingLoad) {
      state.teachingLoad = teachingLoad;
    },
    SET_TOTAL_PROFESSORS(state, total) {
      state.totalProfessors = total;
    },
    ADD_PROFESSOR(state, professor) {
      state.professors.push(professor);
    },
    UPDATE_PROFESSOR(state, updatedProfessor) {
      const index = state.professors.findIndex(p => p._id === updatedProfessor._id);
      if (index !== -1) {
        state.professors.splice(index, 1, updatedProfessor);
      }
      if (state.currentProfessor?._id === updatedProfessor._id) {
        state.currentProfessor = updatedProfessor;
      }
    },
    REMOVE_PROFESSOR(state, professorId) {
      state.professors = state.professors.filter(p => p._id !== professorId);
      if (state.currentProfessor?._id === professorId) {
        state.currentProfessor = null;
      }
    },
    SET_LOADING(state, loading) {
      state.loading = loading;
    },
    SET_ERROR(state, error) {
      state.error = error;
    },
  },

  actions: {
    async fetchProfessors({ commit }) {
      commit("SET_LOADING", true);
      try {
        const response = await professorService.getAllProfessors();
        commit("SET_PROFESSORS", response.data.data.professors);
        commit("SET_TOTAL_PROFESSORS", response.data.results);
      } catch (error) {
        commit("SET_ERROR", error.response?.data?.message);
        throw error;
      } finally {
        commit("SET_LOADING", false);
      }
    },

    async fetchProfessor({ commit }, id) {
      commit("SET_LOADING", true);
      try {
        const response = await professorService.getProfessor(id);
        console.log(response)
        commit("SET_CURRENT_PROFESSOR", response.data.data.professor);
        return response.data.data.professor;
      } catch (error) {
        commit("SET_ERROR", error.response?.data?.message);
        throw error;
      } finally {
        commit("SET_LOADING", false);
      }
    },

    async fetchTeachingLoad({ commit }, id) {
      commit("SET_LOADING", true);
      try {
        const response = await professorService.getProfessorTeachingLoad(id);
        commit("SET_TEACHING_LOAD", response.data.data.teachingLoad);
        return response.data.data.teachingLoad;
      } catch (error) {
        commit("SET_ERROR", error.response?.data?.message);
        throw error;
      } finally {
        commit("SET_LOADING", false);
      }
    },

    async createProfessor({ commit }, professorData) {
      commit("SET_LOADING", true);
      try {
        const response = await professorService.createProfessor(professorData);
        commit("ADD_PROFESSOR", response.data.data.professor);
        return response.data.data.professor;
      } catch (error) {
        commit("SET_ERROR", error.response?.data?.message);
        throw error;
      } finally {
        commit("SET_LOADING", false);
      }
    },

    async updateProfessor({ commit }, { id, professorData }) {
      commit("SET_LOADING", true);
      try {
        const response = await professorService.updateProfessor(id, professorData);
        commit("UPDATE_PROFESSOR", response.data.data.professor);
        return response.data.data.professor;
      } catch (error) {
        commit("SET_ERROR", error.response?.data?.message);
        throw error;
      } finally {
        commit("SET_LOADING", false);
      }
    },

    async deleteProfessor({ commit }, id) {
      commit("SET_LOADING", true);
      try {
        await professorService.deleteProfessor(id);
        commit("REMOVE_PROFESSOR", id);
      } catch (error) {
        commit("SET_ERROR", error.response?.data?.message);
        throw error;
      } finally {
        commit("SET_LOADING", false);
      }
    },
  },

  getters: {
    getProfessorById: (state) => (id) => {
      return state.professors.find(p => p._id === id);
    },
    getProfessorsByDepartment: (state) => (departmentId) => {
      return state.professors.filter(p => p.academicInfo.department === departmentId);
    },
    getActiveFullTimeProfessors: (state) => {
      return state.professors.filter(p => 
        p.accountStatus === 'active' && 
        p.academicInfo.employmentStatus === 'full-time'
      );
    }
  }
};