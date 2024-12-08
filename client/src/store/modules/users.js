import userService from "@/services/userService";

export default {
  namespaced: true,

  state: {
    users: [],
    currentUser: null,
    loading: false,
    error: null,
  },

  getters: {
    users: (state) => state.users,
    currentUser: (state) => state.currentUser,
    loading: (state) => state.loading,
    error: (state) => state.error,
  },

  mutations: {
    SET_USERS(state, users) {
      state.users = users;
    },
    SET_CURRENT_USER(state, user) {
      state.currentUser = user;
    },
    ADD_USER(state, user) {
      state.users.push(user);
    },
    UPDATE_USER(state, updatedUser) {
      const index = state.users.findIndex(
        (u) => u._id === updatedUser._id
      );
      if (index !== -1) {
        state.users.splice(index, 1, updatedUser);
      }
    },
    REMOVE_USER(state, userId) {
      state.users = state.users.filter(
        (u) => u._id !== userId
      );
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
    async fetchUsers({ commit }) {
      try {
        commit("SET_LOADING", true);
        commit("CLEAR_ERROR");
        const response = await userService.getUsers();
        commit("SET_USERS", response.data.data.users);
      } catch (error) {
        commit(
          "SET_ERROR",
          error.response?.data?.message || "Failed to fetch users"
        );
        throw error;
      } finally {
        commit("SET_LOADING", false);
      }
    },

    async fetchUser({ commit }, id) {
      try {
        commit("SET_LOADING", true);
        commit("CLEAR_ERROR");
        const response = await userService.getUser(id);
        commit("SET_CURRENT_USER", response.data.data.user);
      } catch (error) {
        commit(
          "SET_ERROR",
          error.response?.data?.message || "Failed to fetch user"
        );
        throw error;
      } finally {
        commit("SET_LOADING", false);
      }
    },

    async createUser({ commit }, userData) {
      try {
        commit("SET_LOADING", true);
        commit("CLEAR_ERROR");
        const response = await userService.createUser(userData);
        commit("ADD_USER", response.data.data.user);
        return response.data.data.user;
      } catch (error) {
        commit(
          "SET_ERROR",
          error.response?.data?.message || "Failed to create user"
        );
        throw error;
      } finally {
        commit("SET_LOADING", false);
      }
    },

    async updateUser({ commit }, { id, userData }) {
      try {
        commit("SET_LOADING", true);
        commit("CLEAR_ERROR");
        const response = await userService.updateUser(id, userData);
        commit("UPDATE_USER", response.data.data.user);
        return response.data.data.user;
      } catch (error) {
        commit(
          "SET_ERROR",
          error.response?.data?.message || "Failed to update user"
        );
        throw error;
      } finally {
        commit("SET_LOADING", false);
      }
    },

    async deleteUser({ commit }, id) {
      try {
        commit("SET_LOADING", true);
        commit("CLEAR_ERROR");
        await userService.deleteUser(id);
        commit("REMOVE_USER", id);
      } catch (error) {
        commit(
          "SET_ERROR",
          error.response?.data?.message || "Failed to delete user"
        );
        throw error;
      } finally {
        commit("SET_LOADING", false);
      }
    },
  },
};