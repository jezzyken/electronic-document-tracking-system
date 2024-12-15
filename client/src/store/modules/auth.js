import authService from "@/services/authService";
import router from "@/router";

export default {
  namespaced: true,

  state: {
    token: localStorage.getItem("token") || null,
    user: null,
    loading: false,
    error: null,
  },

  getters: {
    isAuthenticated: (state) => !!state.token,
    user: (state) => state.user,
    loading: (state) => state.loading,
    error: (state) => state.error,
  },

  mutations: {
    SET_TOKEN(state, token) {
      state.token = token;
    },
    SET_USER(state, user) {
      state.user = user;
    },
    SET_LOADING(state, loading) {
      state.loading = loading;
    },
    SET_ERROR(state, error) {
      state.error = error;
    },
    CLEAR_AUTH(state) {
      state.token = null;
      state.user = null;
      state.error = null;
    },
  },

  actions: {
    async login({ commit }, credentials) {
      try {
        commit("SET_LOADING", true);
        const response = await authService.login(credentials);
        const { token, user } = response.data.data;

        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(user));
        commit("SET_TOKEN", token);
        commit("SET_USER", user);
        router.push("/admin/dashboard");
      } catch (error) {
        commit("SET_ERROR", error.response?.data?.message || "Login failed");
        throw error;
      } finally {
        commit("SET_LOADING", false);
      }
    },

    async verifyUser({ commit, state }) {
      if (!state.token) return;

      try {
        commit("SET_LOADING", true);
        const response = await authService.verifyToken();
        console.log({ response });

        commit("SET_USER", response.data.user);
      } catch (error) {
        commit("CLEAR_AUTH");
        router.push("/login");
      } finally {
        commit("SET_LOADING", false);
      }
    },

    logout({ commit }) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      commit("CLEAR_AUTH");
      router.push("/login");
    },
  },
};
