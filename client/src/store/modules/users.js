import userService from "@/services/userService";

const state = {
  users: [],
  currentUser: null,
  loading: false,
  error: null,
};

const mutations = {
  SET_USERS(state, users) {
    state.users = users;
  },
  SET_CURRENT_USER(state, user) {
    state.currentUser = user;
  },
  SET_LOADING(state, status) {
    state.loading = status;
  },
  SET_ERROR(state, error) {
    state.error = error;
  },
  ADD_USER(state, user) {
    state.users.push(user);
  },
  UPDATE_USER(state, updatedUser) {
    const index = state.users.findIndex((user) => user._id === updatedUser._id);
    if (index !== -1) {
      state.users.splice(index, 1, updatedUser);
    }
  },
  REMOVE_USER(state, userId) {
    state.users = state.users.filter((user) => user._id !== userId);
  },
};

const actions = {
  async fetchUsers({ commit }) {
    commit("SET_LOADING", true);
    try {
      const response = await userService.getUsers();
      commit("SET_USERS", response.data.data);
      commit("SET_ERROR", null);
    } catch (error) {
      commit(
        "SET_ERROR",
        error.response?.data?.error || "Error fetching users"
      );
    } finally {
      commit("SET_LOADING", false);
    }
  },

  async fetchUser({ commit }, id) {
    commit("SET_LOADING", true);
    try {
      const response = await userService.getUser(id);
      commit("SET_CURRENT_USER", response.data.data);
      commit("SET_ERROR", null);
      return response.data.data;
    } catch (error) {
      commit("SET_ERROR", error.response?.data?.error || "Error fetching user");
      throw error;
    } finally {
      commit("SET_LOADING", false);
    }
  },

  async createUser({ commit }, userData) {
    commit("SET_LOADING", true);
    try {
      const response = await userService.createUser(userData);
      commit("ADD_USER", response.data.data);
      commit("SET_ERROR", null);
      return response.data.data;
    } catch (error) {
      commit("SET_ERROR", error.response?.data?.error || "Error creating user");
      throw error;
    } finally {
      commit("SET_LOADING", false);
    }
  },

  async updateUser({ commit }, { id, userData }) {
    commit("SET_LOADING", true);
    try {
      const response = await userService.updateUser(id, userData);
      commit("UPDATE_USER", response.data.data);
      commit("SET_ERROR", null);
      return response.data.data;
    } catch (error) {
      commit("SET_ERROR", error.response?.data?.error || "Error updating user");
      throw error;
    } finally {
      commit("SET_LOADING", false);
    }
  },

  async deleteUser({ commit }, id) {
    commit("SET_LOADING", true);
    try {
      await userService.deleteUser(id);
      commit("REMOVE_USER", id);
      commit("SET_ERROR", null);
    } catch (error) {
      commit("SET_ERROR", error.response?.data?.error || "Error deleting user");
      throw error;
    } finally {
      commit("SET_LOADING", false);
    }
  },

  async changePassword({ commit }, passwordData) {
    commit("SET_LOADING", true);
    try {
      await userService.changePassword(passwordData);
      commit("SET_ERROR", null);
    } catch (error) {
      commit(
        "SET_ERROR",
        error.response?.data?.error || "Error changing password"
      );
      throw error;
    } finally {
      commit("SET_LOADING", false);
    }
  },
};

const getters = {
  getUsers: (state) => state.users,
  getCurrentUser: (state) => state.currentUser,
  isLoading: (state) => state.loading,
  getError: (state) => state.error,
  getUserById: (state) => (id) => state.users.find((user) => user._id === id),
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters,
};
