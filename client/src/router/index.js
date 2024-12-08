import Vue from "vue";
import VueRouter from "vue-router";
import store from "@/store";

Vue.use(VueRouter);

const routes = [
  {
    path: "/login",
    name: "Login",
    component: () => import("@/views/auth/LoginView.vue"),
    meta: { guest: true },
  },
  {
    path: "/",
    component: () => import("@/layouts/DashboardLayout.vue"),
    meta: { requiresAuth: true },
    children: [
      {
        path: "",
        redirect: "/dashboard",
      },
      {
        path: "/dashboard",
        name: "Dashboard",
        component: () => import("@/views/DashboardView.vue"),
      },
      {
        path: "/uploads",
        name: "uploads",
        component: () => import("@/views/UploadDocument.vue"),
      },
      {
        path: "/request",
        name: "request",
        component: () => import("@/views/RequestList.vue"),
      },
      {
        path: "/documents",
        name: "documents",
        component: () => import("@/views/DocumentList.vue"),
      },
      {
        path: "/document-library",
        name: "documentLibrary",
        component: () => import("@/views/DocumentLibrary.vue"),
      },
      {
        path: "/settings",
        name: "settings",
        component: () => import("@/views/Settings.vue"),
      },
      {
        path: "/users",
        name: "users",
        component: () => import("@/views/UserList.vue"),
      },
      {
        path: "/user-roles",
        name: "roles",
        component: () => import("@/views/RoleList.vue"),
      },
      {
        path: "/reports",
        component: () => import("@/views/Reports.vue"),
        children: [
          {
            path: "",
            name: "Reports",
          },
        ],
      },
    ],
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

router.beforeEach((to, from, next) => {
  const requiresAuth = to.matched.some((record) => record.meta.requiresAuth);
  const isAuthenticated = store.getters["auth/isAuthenticated"];

  console.log(requiresAuth, isAuthenticated);
  console.log("auth");

  if (requiresAuth && !isAuthenticated) {
    next("/login");
  } else if (to.meta.guest && isAuthenticated) {
    next("/dashboard");
  } else {
    next();
  }
});

export default router;
