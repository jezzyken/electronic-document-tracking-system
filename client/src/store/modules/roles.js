import roleService from '@/services/roleService';

export default {
  namespaced: true,

  state: {
    roles: [],
    currentRole: null,
    loading: false,
    error: null
  },

  getters: {
    roles: state => state.roles,
    currentRole: state => state.currentRole,
    loading: state => state.loading,
    error: state => state.error
  },

  mutations: {
    SET_ROLES(state, roles) {
      state.roles = roles;
    },
    SET_CURRENT_ROLE(state, role) {
      state.currentRole = role;
    },
    ADD_ROLE(state, role) {
      state.roles.push(role);
    },
    UPDATE_ROLE(state, updatedRole) {
      const index = state.roles.findIndex(r => r._id === updatedRole._id);
      if (index !== -1) {
        state.roles.splice(index, 1, updatedRole);
      }
    },
    REMOVE_ROLE(state, roleId) {
      state.roles = state.roles.filter(r => r._id !== roleId);
    },
    SET_LOADING(state, loading) {
      state.loading = loading;
    },
    SET_ERROR(state, error) {
      state.error = error;
    },
    CLEAR_ERROR(state) {
      state.error = null;
    }
  },

  actions: {
    async fetchRoles({ commit }) {
      try {
        commit('SET_LOADING', true);
        commit('CLEAR_ERROR');
        const response = await roleService.getRoles();
        commit('SET_ROLES', response.data);
      } catch (error) {
        commit('SET_ERROR', error.response?.data?.message || 'Failed to fetch roles');
        throw error;
      } finally {
        commit('SET_LOADING', false);
      }
    },

    async fetchRole({ commit }, id) {
      try {
        commit('SET_LOADING', true);
        commit('CLEAR_ERROR');
        const response = await roleService.getRole(id);
        commit('SET_CURRENT_ROLE', response.data);
      } catch (error) {
        commit('SET_ERROR', error.response?.data?.message || 'Failed to fetch role');
        throw error;
      } finally {
        commit('SET_LOADING', false);
      }
    },

    async createRole({ commit }, roleData) {
      try {
        commit('SET_LOADING', true);
        commit('CLEAR_ERROR');
        const response = await roleService.createRole(roleData);
        commit('ADD_ROLE', response.data);
        return response.data;
      } catch (error) {
        commit('SET_ERROR', error.response?.data?.message || 'Failed to create role');
        throw error;
      } finally {
        commit('SET_LOADING', false);
      }
    },

    async updateRole({ commit }, { id, roleData }) {
      try {
        commit('SET_LOADING', true);
        commit('CLEAR_ERROR');
        const response = await roleService.updateRole(id, roleData);
        commit('UPDATE_ROLE', response.data);
        return response.data;
      } catch (error) {
        commit('SET_ERROR', error.response?.data?.message || 'Failed to update role');
        throw error;
      } finally {
        commit('SET_LOADING', false);
      }
    },

    async deleteRole({ commit }, id) {
      try {
        commit('SET_LOADING', true);
        commit('CLEAR_ERROR');
        await roleService.deleteRole(id);
        commit('REMOVE_ROLE', id);
      } catch (error) {
        commit('SET_ERROR', error.response?.data?.message || 'Failed to delete role');
        throw error;
      } finally {
        commit('SET_LOADING', false);
      }
    }
  }
};